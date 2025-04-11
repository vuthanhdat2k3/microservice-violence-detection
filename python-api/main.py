import tensorflow as tf
from flask import Flask, request, render_template, flash, redirect, url_for, send_from_directory, jsonify
from flask_cors import CORS
import threading
import os
import uuid
import json
from utils import check_opencv_gui, load_model
from video_detection import setup_upload_folder, process_video_upload, process_api_predict, UPLOAD_FOLDER
from camera_detection import detect_violence_from_camera, stop_event
from training import process_training_request, get_training_job_status, process_dataset_upload

app = Flask(__name__)
CORS(app)
app.secret_key = "supersecretkey"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['TRAINING_FOLDER'] = 'training'
app.config['MODELS_FOLDER'] = 'models'
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500 MB max upload

# Verify OpenCV GUI support
check_opencv_gui()

# Setup folders
setup_upload_folder()
os.makedirs(app.config['TRAINING_FOLDER'], exist_ok=True)
os.makedirs(app.config['MODELS_FOLDER'], exist_ok=True)

# Load model
model = load_model(tf)

# Routes for video detection
@app.route('/', methods=['GET', 'POST'])
def upload_file():
    return process_video_upload(request, model, app, render_template, flash, redirect, url_for, jsonify)

@app.route('/api/predict', methods=['POST'])
def predict_api():
    return process_api_predict(request, model, app, jsonify)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Routes for camera detection
@app.route('/detect_camera', methods=['GET'])
def detect_camera():
    global stop_event
    stop_event.clear()  # Reset stop event for new detection
    detection_thread = threading.Thread(target=detect_violence_from_camera, args=(model,))
    detection_thread.start()
    return jsonify({"message": "Camera detection started. Press 'q' to stop."}), 200

# Routes for model training
@app.route('/api/training/submit', methods=['POST'])
def submit_training():
    return process_training_request(request, app, jsonify)

@app.route('/api/training/upload', methods=['POST'])
def upload_dataset():
    return process_dataset_upload(request, app, jsonify)

@app.route('/api/training/job/<job_id>', methods=['GET'])
def get_job_status(job_id):
    return get_training_job_status(job_id, app, jsonify)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
