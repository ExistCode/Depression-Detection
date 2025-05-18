import datetime
import json
import tempfile
import uuid
import os
from pathlib import Path
import openai
from dotenv import load_dotenv
import mne
from lime.lime_tabular import LimeTabularExplainer
from mne.preprocessing import ICA
import tensorflow as tf
import numpy as np
import firebase_admin
from flask import Flask, request, jsonify
from firebase_admin import credentials, firestore, storage, initialize_app, get_app, auth
import requests.exceptions
import requests
from dotenv import load_dotenv
import sklearn
import lime
from lime import lime_tabular, explanation
import matplotlib.pyplot as plt
import io
import base64
from datetime import datetime, timedelta
from openai import OpenAI
from flask_cors import CORS

load_dotenv()
openai_api_key = os.getenv('OPENAI_API_KEY')
# Initialize OpenAI client
client = OpenAI()

# EEG Processing Constants
EEG_PREPROCESSING_PARAMS = {
    'l_freq': 0.5,
    'h_freq': 60.0,
    'notch_freq': 50.0,
    'n_components': 2,
    'epoch_duration': 5.0,
    'epoch_overlap': 1.0
}

scaling_factor = 1e5
# ICA channels configuration
ica_channels = ['Fp1', 'Fp2']

# Initialize Flask app
app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')


def process_channels(raw_data):
    print(f"Initial channels: {raw_data.ch_names}")
    channels_to_drop = []
    rename_map = {}

    for name in raw_data.ch_names:
        if any(x in name for x in ['23A-23R', '24A-24R', 'A2-A1']):
            channels_to_drop.append(name)
        else:
            new_name = name.replace('EEG ', '').replace('-LE', '')
            rename_map[name] = new_name

    if channels_to_drop:
        raw_data.drop_channels(channels_to_drop)
    raw_data.rename_channels(rename_map)

    expected_channels = [
        'Fp1', 'F3', 'C3', 'P3', 'O1', 'F7', 'T3', 'Fp2', 'F4',
        'C4', 'P4', 'O2', 'F8', 'T4', 'T6', 'Cz', 'Pz'
    ]

    channels_to_keep = set(expected_channels)
    channels_to_drop = [ch for ch in raw_data.ch_names if ch not in channels_to_keep]

    if channels_to_drop:
        raw_data.drop_channels(channels_to_drop)

    return raw_data


def bandpass_filter(data, l_freq, h_freq, notch_freq=None):
    filtered_data = data.copy()
    filtered_data.filter(l_freq=l_freq, h_freq=h_freq, method='fir', phase='zero')

    if notch_freq is not None:
        filtered_data.notch_filter(freqs=notch_freq, notch_widths=2.0)

    return filtered_data


def preprocess_ICA(epochs, n_components):
    try:
        print(f"Preprocessing ICA for {len(epochs)} epochs...")
        ica = ICA(n_components=n_components, random_state=97, max_iter=800)
        ica.fit(epochs.copy().pick_channels(ica_channels))
        return ica
    except ImportError:
        print("Warning: scikit-learn not found, skipping ICA")
        return None


# Define your actual channel names (replace with your specific channel labels)
channel_names = [
    'Fp1', 'F3', 'C3', 'P3', 'O1', 'F7', 'T3', 'Fp2',
    'F4', 'C4', 'P4', 'O2', 'F8', 'T4', 'T6', 'Cz', 'Pz'
]

def explain_prediction(file_path, model):
    try:
        # Load and preprocess data
        raw_data = mne.io.read_raw_edf(file_path, preload=True)
        processed_data = preprocess_eeg(
            raw_data,
            **EEG_PREPROCESSING_PARAMS
        )

        # Reshape the processed data to 2D format for LIME
        flattened_data = processed_data.reshape(processed_data.shape[0], -1)

        def model_predict(data):
            reshaped_data = data.reshape(-1, 17, 1280)
            data_tensor = tf.convert_to_tensor(reshaped_data, dtype=tf.float32)
            predictions = model.signatures['serving_default'](data_tensor)
            output_key = list(predictions.keys())[0]
            probs = predictions[output_key].numpy()
            two_class_probs = np.zeros((probs.shape[0], 2))
            two_class_probs[:, 1] = probs.flatten()
            two_class_probs[:, 0] = 1 - probs.flatten()
            return two_class_probs

        # Create LIME explainer
        explainer = lime.lime_tabular.LimeTabularExplainer(
            training_data=flattened_data,
            feature_names=[f"{channel}_{t}" for channel in channel_names
                           for t in range(processed_data.shape[2])],
            class_names=['Normal', 'MDD'],
            mode='classification',
            random_state=42
        )

        # Get explanation for first instance
        instance_to_explain = flattened_data[0]
        explanation = explainer.explain_instance(
            instance_to_explain,
            model_predict,
            num_features=10
        )

        # Get the model's prediction for this instance
        prediction_probs = model_predict(instance_to_explain.reshape(1, -1))
        prediction = prediction_probs[0, 1]  # Probability of MDD
        predicted_class = 1 if prediction > 0.5 else 0

        return explanation, instance_to_explain, predicted_class, prediction
    except Exception as e:
        print(f"Error generating explanation: {str(e)}")
        return None, None, None, None



def process_eeg_data(file_path):
    try:
        # Load EDF file
        raw_eeg = mne.io.read_raw_edf(file_path, preload=True)

        # Preprocess the EEG data
        processed_data = preprocess_eeg(
            raw_eeg,
            **EEG_PREPROCESSING_PARAMS
        )

        if processed_data is None:
            return None, None

        # Convert to tensor
        processed_data = np.squeeze(processed_data)
        reshaped_data = processed_data.reshape(
            processed_data.shape[0], processed_data.shape[1], -1)
        input_tensor = tf.convert_to_tensor(reshaped_data, dtype=tf.float32)

        # Make prediction
        predictions = predict_fn(input_tensor)
        output_key = list(predictions.keys())[0]
        preds = predictions[output_key].numpy()

        # Generate explanation
        explanation, instance_to_explain, predicted_class, prediction = explain_prediction(file_path, model)

        # Return values
        prediction_probability = float(preds[0][0])

        return prediction_probability, explanation, instance_to_explain, predicted_class, prediction
    except Exception as e:
        print(f"Error processing EEG data: {str(e)}")
        return None, None, None, None, None

def preprocess_eeg(raw_data, l_freq, h_freq, notch_freq, n_components, epoch_duration, epoch_overlap):
    try:
        processed_raw = raw_data.copy()

        # 1. Bandpass filtering
        print("1. Applying bandpass filter...")
        bandpass_filter(processed_raw, l_freq, h_freq, notch_freq)

        # 2. Bad channel removal
        print("2. Removing bad channels...")
        processed_raw = process_channels(raw_data=processed_raw)

        # 3. Epoching
        print("3. Creating epochs...")
        epochs = mne.make_fixed_length_epochs(
            processed_raw,
            duration=epoch_duration,
            overlap=epoch_overlap,
            preload=True
        )
        epochs.drop_bad()

        # 4. ICA
        print("4. Applying ICA...")
        try:
            ica = preprocess_ICA(epochs, n_components)
            if ica is not None:
                ica.apply(epochs)
                print("ICA completed")
            else:
                print("Skipping ICA due to missing dependencies")
        except Exception as e:
            print(f"Warning: ICA failed: {str(e)}")

        # 5. Baseline correction
        print("5. Applying baseline correction...")
        epochs.apply_baseline((None, None))

        # Get data and reshape for CNN
        data = epochs.get_data()
        data = data[..., np.newaxis]

        return data

    except Exception as e:
        print(f"General preprocessing error: {str(e)}")
        return None

# Model Loading Function
def load_model():
    try:
        BASE_DIR = Path(__file__).resolve().parent
        MODEL_PATH = os.path.join(BASE_DIR, 'models', 'saved_model')

        # Print path to debug
        print(f"Looking for model at: {MODEL_PATH}")
        print(f"Directory exists: {os.path.exists(MODEL_PATH)}")

        # Load model
        model = tf.saved_model.load(MODEL_PATH)
        print("Model loaded successfully")
        predict_fn = model.signatures['serving_default']
        return model, predict_fn
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        return None, None


def initialize_firebase():
    try:
        # Create credentials dictionary from environment variables
        config = {
            "type": os.getenv('FIREBASE_TYPE'),
            "project_id": os.getenv('FIREBASE_PROJECT_ID'),
            "private_key_id": os.getenv('FIREBASE_PRIVATE_KEY_ID'),
            "private_key": os.getenv('FIREBASE_PRIVATE_KEY').replace('\\n', '\n'),
            "client_email": os.getenv('FIREBASE_CLIENT_EMAIL'),
            "client_id": os.getenv('FIREBASE_CLIENT_ID'),
            "auth_uri": os.getenv('FIREBASE_AUTH_URI'),
            "token_uri": os.getenv('FIREBASE_TOKEN_URI'),
            "auth_provider_x509_cert_url": os.getenv('FIREBASE_AUTH_PROVIDER_CERT_URL'),
            "client_x509_cert_url": os.getenv('FIREBASE_CLIENT_CERT_URL')
        }

        # Initialize Firebase
        cred = credentials.Certificate(config)
        firebase_admin.initialize_app(cred, {
            'storageBucket': os.getenv('FIREBASE_STORAGE_BUCKET')
        })

        print("Firebase app initialized.")
        return firestore.client(), storage.bucket()
    except Exception as e:
        print(f"Error initializing Firebase: {str(e)}")
        return None, None


# Global variables
model, predict_fn = load_model()
db, bucket = initialize_firebase()

# Verify initialization
if db is None or bucket is None:
    print("Error: Failed to initialize Firebase services")

# Routes
@app.route('/')
def home():
    return jsonify({
        'message': 'Welcome to EEG Classification API',
        'status': 'running'
    })


def generate_analysis_report(predictions, feature_weights):
    # Get prediction probability
    probability = predictions[0]["probability"]

    # Format feature weights into readable text
    features_text = "\n".join([
        f"- {feature['feature']}: {feature['weight']:.4f}"
        for feature in feature_weights
    ])

    # Construct the prompt
    prompt = f"""
    Based on EEG analysis, the model predicted depression with {probability * 100:.2f}% confidence.

    The key EEG features that influenced this prediction were:
    {features_text}

    Please provide a detailed clinical interpretation of these results by:
    1. Explaining what these EEG features indicate about brain activity
    2. How these patterns relate to depression symptoms 
    3. The confidence level of this prediction
    4. Any limitations or caveats to consider
    5. Be more specific on the weight and why the model come up with the prediction results

    Format the response in two paragraphs.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system",
                 "content": "You are an expert neurologist specializing in EEG analysis and depression diagnosis."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Failed to generate report: {str(e)}"

@app.route('/api/eeg-analysis', methods=['POST'])
def download_data():
    if not model or not predict_fn:
        return jsonify({'error': 'Model not loaded'}), 500

    try:
        data = request.json
        file_url = data.get('file_url')

        if not file_url:
            return jsonify({'error': 'No file URL provided'}), 400

        with tempfile.TemporaryDirectory() as temp_dir:
            temp_filename = f"eeg_file_{uuid.uuid4()}.edf"
            temp_file_path = os.path.join(temp_dir, temp_filename)

            try:
                response = requests.get(
                    file_url,
                    stream=True,
                    timeout=30,
                    headers={'User-Agent': 'EEG-Processing-App/1.0'}
                )
                response.raise_for_status()

                if int(response.headers.get('content-length', 0)) > 10 * 1024 * 1024:
                    return jsonify({'error': 'File too large (max 10MB)'}), 400

                with open(temp_file_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)

                prediction_probability, explanation, instance_to_explain, predicted_class, prediction = process_eeg_data(temp_file_path)

                if prediction_probability is None:
                    return jsonify({
                        "status": "error",
                        "error": "Failed to process EEG data"
                    }), 400

                feature_weights = []
                xai_image_url = None

                if explanation:
                    for feature, weight in explanation.as_list():
                        if weight != 0:
                            feature_weights.append({
                                "feature": feature,
                                "weight": float(weight)
                            })

                            print(feature_weights);
                    if feature_weights:
                        plt.figure(figsize=(10, 6))
                        fig = explanation.as_pyplot_figure()

                        # Get the axes of the plot
                        axes = fig.axes

                        # Get all the bars (patches) from the axes
                        bars = axes[0].patches  # Extract bars from the plot

                        # Loop through each bar and set the colors based on the prediction
                        for bar in bars:
                            # For healthy (class 0), features with positive weights (supporting healthy) should be green
                            # For depressed (class 1), features with positive weights (supporting depressed) should be red
                            if predicted_class == 0:  # Healthy prediction
                                if bar.get_width() > 0:  # Features supporting healthy
                                    bar.set_color('green')
                                else:  # Features supporting depressed
                                    bar.set_color('red')
                            else:  # Depressed prediction
                                if bar.get_width() > 0:  # Features supporting depressed
                                    bar.set_color('red')
                                else:  # Features supporting healthy
                                    bar.set_color('green')

                        # Get the model's prediction for the instance
                        instance_rescaled = instance_to_explain / scaling_factor  # Scale back
                        instance_reshaped = instance_rescaled.reshape(1, 17, 1280)
                        data_tensor = tf.convert_to_tensor(instance_reshaped, dtype=tf.float32)
                        predictions = model.signatures['serving_default'](data_tensor)
                        output_key = list(predictions.keys())[0]
                        prediction = predictions[output_key].numpy()[0][0]

                        # Determine the predicted class
                        # predicted_class = 1 if prediction > 0.5 else 0

                        # Update the title color accordingly
                        colors = {0: 'green', 1: 'red'}  # 0 = Not Depressed (Green), 1 = Depressed (Red)
                        prediction_label = "Depressed" if predicted_class == 1 else "Not Depressed"
                        plt.title(
                            f"Top 10 EEG Features Influencing Prediction: Green (Supports Healthy) & Red (Supports Depressed)",
                            color=colors[predicted_class])

                        # Save the figure as a PNG
                        buffer = io.BytesIO()
                        plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
                        buffer.seek(0)

                        bucket = storage.bucket()
                        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                        blob_path = f'xai_images/lime_plot_{timestamp}.png'
                        blob = bucket.blob(blob_path)
                        blob.upload_from_string(
                            buffer.getvalue(),
                            content_type='image/png'
                        )

                        xai_image_url = blob.generate_signed_url(
                            expiration=timedelta(hours=1),
                            method='GET'
                        )

                        plt.close()

                analysis_report = generate_analysis_report([{"probability": prediction_probability}], feature_weights)

                return jsonify({
                    "status": "success",
                    "prediction": prediction_probability,
                    "analysis_report": analysis_report,
                    "lime_plot": xai_image_url
                }), 200

            except requests.exceptions.Timeout:
                return jsonify({'error': 'Download timeout'}), 408
            except requests.exceptions.RequestException as e:
                return jsonify({
                    'error': 'Failed to download file',
                    'message': str(e)
                }), 400

    except Exception as e:
        return jsonify({
            'error': 'Server error',
            'message': str(e)
        }), 500

# Error handlers
@app.errorhandler(400)
def bad_request(error):
    return jsonify({
        'error': 'Bad request',
        'message': str(error)
    }), 400


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'message': str(error)
    }), 500


if __name__ == '__main__':
    if not model or not predict_fn:
        print("Error: Model failed to load")
    else:
        app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
