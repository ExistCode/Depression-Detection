# Depression Detection System

A full-stack demo that detects signs of depression from EEG (brainwave) files.  
It contains:
- **Python model** that cleans EEG signals and runs a TensorFlow classifier
- **Flask backend** that talks to Firebase, stores files, and asks an OpenAI agent to write plain-language reports
- **React frontend** that lets people upload EEG data and read the results

If you can follow a recipe, you can run this project. The steps below avoid jargon, name every tool you need, and point to the right Google Cloud (GCP) products.

---

## Project Snapshot
- EEG `.edf` upload → preprocessing → TensorFlow SavedModel prediction → optional explanation plots (LIME)
- Results, user profiles, and EEG files go to Firebase (Firestore + Storage)
- Human-friendly summaries come from an OpenAI-powered agent (see `agent.md`)
- UI built with React + Firebase Auth; backend deployable to Cloud Run or any server that can run Python 3.10+

---

## Architecture at a Glance

```
[React Frontend] --(HTTPS)--> [Flask API]
      |                           |
      | Firebase Auth             | TensorFlow SavedModel (backend/models/saved_model)
      |                           |-> Google Cloud: Firestore (results) & Storage (EEG/report files)
      |                           |-> OpenAI Agent (text explanations)
      |
   Users download PDF reports or view dashboards
```

---

## What You Need Before You Start

### Accounts & APIs
- Google account with permission to create a **Google Cloud project**.
- The same project must have **Firebase** upgraded to Blaze (pay-as-you-go) if you plan to exceed the generous free tier.
- An **OpenAI API key** for the reporting agent.

### Local tools
| Tool | Version | Notes |
| --- | --- | --- |
| Git | latest | For cloning the repo |
| Python | 3.10 or newer | Used by the backend and the training notebooks |
| Node.js | 18 LTS or newer | Needed for the React app |
| npm | bundled with Node | `yarn` also works |
| Virtual environment tool | `python -m venv` is built-in | Keeps Python packages tidy |

### Hardware & data
- 16 GB RAM recommended (TensorFlow + MNE are memory hungry).
- Sample EEG `.edf` files. You can download the **Mumtaz, Wajid (2016) MDD dataset** from [figshare: 10.6084/m9.figshare.4244171.v2](https://doi.org/10.6084/m9.figshare.4244171.v2).
- Stable internet when installing packages or calling cloud APIs.

### macOS quick start
- Works on macOS Ventura/Sonoma (Intel and Apple Silicon). Install the Apple command-line tools with `xcode-select --install` before anything else.
- Homebrew keeps the prerequisites tidy:
  ```bash
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  brew install git python@3.11 node
  ```
- Use the system `python3` to create virtual environments: `python3 -m venv venv && source venv/bin/activate`. The `source` command is identical on Linux and macOS shells (zsh/bash).
- If the stock `tensorflow` wheel fails on Apple Silicon, swap in `pip install tensorflow-macos tensorflow-metal` (they are drop-in replacements for this project).
- All other commands in this README work unchanged on macOS; just remember to use `python3`/`pip3` when your shell’s defaults still point to Python 2.

---

## Required Google Cloud / Firebase Products

| Product | Why it matters | Setup tips |
| --- | --- | --- |
| **Firebase Authentication** | Handles login for the React app. | Enable Email/Password (and any other method you prefer) in the Firebase console. |
| **Cloud Firestore** | Stores predictions, metadata, and references to EEG files. | Start in “production mode” if you will deploy publicly; “test mode” is fine for local dev. |
| **Firebase Storage (GCS bucket)** | Saves uploaded EEG files, generated plots, and PDF reports. | Buckets follow the format `<project-id>.appspot.com`. Assign the service account `roles/storage.admin`. |
| **IAM Service Account + Key** | Lets the backend talk to Firebase services securely. | Create a service account, grant it Firebase Admin + Storage roles, download the JSON, and convert it into environment variables (see below). |
| **Cloud Run (optional)** | Easiest place to deploy `backend/` without managing servers. | Build a container, set env vars in the console, and point the frontend to the Cloud Run URL. |
| **Firebase Hosting / Vite / Netlify (optional)** | For serving the React build. | `npm run build` creates the production bundle. |

---

## Step-by-Step: Set Up Google Cloud & Firebase
1. **Create a project** in the Google Cloud console (e.g., `depression-detection-demo`).
2. Open **Firebase console → Add Project**, pick the same project, and enable Analytics only if you need it.
3. In **Authentication → Get Started**, enable Email/Password (minimum requirement for the current UI).
4. In **Firestore → Create database**, choose a region close to you.
5. In **Storage → Get started**, keep the default bucket name or customize it.
6. Go to **Project Settings → Service Accounts**, click “Generate new private key.” Download the JSON and keep it safe.
7. Copy the values from the JSON into environment variables (template below).

---

## Environment Variables
Create `.env` files manually; they are ignored by Git on purpose.

### Backend (`backend/.env`)
```
SECRET_KEY=change-me
OPENAI_API_KEY=sk-...
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc@your-project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=...
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

### Frontend (`frontend/.env`)
```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=1:1234567890:web:abcdef
```

### Optional: customize API URL
`frontend/src/utils/apiService.js` currently points to a Cloud Run deployment.  
Change `API_BASE_URL` to `http://localhost:5000` when running the backend locally.

---

## Local Setup & Run Guide (High-School Friendly)

1. **Clone the repo**
   ```bash
   git clone https://github.com/ExistCode/Depression-Detection.git
   cd Depression-Detection
   ```

2. **(Optional) Prepare the training environment**
   ```bash
   cd python-model
   python -m venv venv
   source venv/bin/activate        # macOS/Linux; Windows: venv\Scripts\activate
   pip install -r requirements.txt
   # run notebooks or scripts as needed
   deactivate
   cd ..
   ```
   This folder is only required if you plan to retrain the model. Pretrained weights already exist at `backend/models/saved_model`.

3. **Install backend dependencies**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate        # macOS/Linux; Windows: venv\Scripts\activate
   pip install -r requirements.txt
   # create backend/.env using the template in this README
   # then paste the Firebase + OpenAI values
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   # create frontend/.env using the template in this README
   ```

5. **Run everything**
   - **Backend**
     ```bash
     cd ../backend
     source venv/bin/activate      # macOS/Linux; Windows: venv\Scripts\activate
     python app.py                 # serves on http://localhost:5000
     ```
   - **Frontend**
     ```bash
     cd ../frontend
     npm start                     # opens http://localhost:3000
     ```
   - Log in with any Firebase user you created. Upload an EEG `.edf` file and observe the prediction probability, explanation text, and downloadable report.

6. **Smoke test the API without the UI (optional)**
   ```bash
   curl -X POST http://localhost:5000/api/eeg-analysis \
        -H "Content-Type: application/json" \
        -d '{"fileUrl": "https://storage.googleapis.com/<bucket>/sample.edf"}'
   ```
   Replace the URL with a real file in your Storage bucket.

---

## Training or Replacing the EEG Model
1. Use the notebooks/scripts in `python-model/` to preprocess EEG data and train a new model.
2. Export the TensorFlow SavedModel into `backend/models/saved_model`.
3. Restart the Flask server; it automatically loads whatever lives in that folder.

Tips:
- Keep channel names consistent with `backend/app.py` (`channel_names` list).
- Update `EEG_PREPROCESSING_PARAMS` in the backend if your new model expects different filtering.

---

## Troubleshooting & FAQs
- **Firebase credential errors**: double-check that every newline in `FIREBASE_PRIVATE_KEY` is written as `\n`.
- **`ModuleNotFoundError: mne` or TensorFlow wheel issues**: ensure you activated the correct virtual environment before `pip install`.
- **Large EDF uploads timeout**: upload the file directly to Firebase Storage first, then submit its URL to the backend (current UI follows this pattern).
- **Frontend still calls the deployed API**: edit `frontend/src/utils/apiService.js` and restart `npm start`.
- **OpenAI quota exceeded**: the backend will return a message saying the report failed; predictions still succeed. Upgrade your OpenAI plan or disable report generation inside `generate_analysis_report`.

---

## Helpful Commands
- Format/clean Node modules: `rm -rf frontend/node_modules && npm install`
- Remove Python envs: delete the `venv/` folder inside each subproject.
- Build frontend for production: `cd frontend && npm run build`
- Gunicorn run (for deployment): `gunicorn wsgi:app --bind 0.0.0.0:8080` inside `backend/`

---

## Repository Map
```
.
├── backend/          # Flask API, Firebase + OpenAI integration, TensorFlow serving
├── frontend/         # React app with Firebase Auth + UI components
└── python-model/     # Notebooks and scripts for preprocessing & training
```
See `agent.md` for the reporting agent details.

---

## Contributors
- [Bonifacio Ronald](https://github.com/bonifacioronald)
- [Gregorius Hans Andreanto](https://github.com/ExistCode)
- [Lim Chuan Zhe](https://github.com/ehznauhcmil)
- [Benjamin Tan Wei Keong](https://github.com/ben1115123)
- [Richard Charlie Cahyono](https://github.com/Charliebzbz)

---

## License & Data Citation
- MIT License – see `LICENSE`.
- EEG dataset: Mumtaz, Wajid (2016). **MDD Patients and Healthy Controls EEG Data (New).** figshare. Dataset. https://doi.org/10.6084/m9.figshare.4244171.v2

Happy building!
