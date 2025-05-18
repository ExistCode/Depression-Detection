# Depression Detection System

A comprehensive system for detecting depression using EEG signals, featuring a Python-based machine learning model, a Flask backend, and a React frontend.

## Project Structure

```
.
├── frontend/           # React frontend application
├── backend/           # Flask backend server
└── python-model/      # Python-based machine learning model
```

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn
- Firebase account (for authentication)

## Setup Instructions

### 1. Python Model Setup

The Python model is responsible for processing EEG signals and making predictions.

```bash
cd python-model
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Key dependencies:
- TensorFlow 2.13.0
- PyTorch 2.1.2
- MNE 1.0.0
- scikit-learn 1.3.0

### 2. Backend Setup

The Flask backend serves as the API layer between the frontend and the Python model.

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Key dependencies:
- Flask 3.1.0
- Flask-CORS 5.0.0
- TensorFlow 2.18.0
- Firebase Admin 6.6.0

### 3. Frontend Setup

The React frontend provides the user interface for the application.

```bash
cd frontend
npm install
```

Key dependencies:
- React 18.3.1
- Firebase 11.0.1
- React Router DOM 6.28.0
- React PDF Renderer 4.0.0

## Running the Application

### 1. Start the Backend Server

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

The backend server will start on `http://localhost:5000`

### 2. Start the Frontend Development Server

```bash
cd frontend
npm start
```

The frontend application will start on `http://localhost:3000`

## Features

- EEG signal processing and analysis
- Machine learning-based depression detection
- User authentication and session management
- Interactive data visualization
- PDF report generation
- Real-time analysis results

## API Endpoints

The backend provides the following main endpoints:

- `/api/auth/*` - Authentication endpoints
- `/api/analysis/*` - EEG analysis endpoints
- `/api/results/*` - Results and report generation endpoints

## Environment Variables

### Backend (.env)
```
FLASK_APP=app.py
FLASK_ENV=development
FIREBASE_CREDENTIALS=path/to/firebase-credentials.json
```

### Frontend (.env)
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- MNE library for EEG signal processing
- TensorFlow and PyTorch for machine learning capabilities
- React and Flask communities for their excellent documentation
