import os
import json
import uuid
import time
import threading
import shutil
from werkzeug.utils import secure_filename
import tensorflow as tf
import numpy as np

# Dictionary to store training jobs
training_jobs = {}

def process_training_request(request, app, jsonify):
    """Process a training request from the API"""
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()

    # Validate required fields
    required_fields = ["modelName", "modelType", "datasetPath"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    # Create a job ID
    job_id = str(uuid.uuid4())

    # Create a job record
    job = {
        "id": job_id,
        "modelName": data["modelName"],
        "modelType": data["modelType"],
        "datasetPath": data["datasetPath"],
        "epochs": data.get("epochs", 10),
        "learningRate": data.get("learningRate", 0.001),
        "status": "QUEUED",
        "createdAt": time.time(),
        "progress": 0.0
    }

    # Save the job
    training_jobs[job_id] = job

    # Start training in a background thread
    training_thread = threading.Thread(
        target=train_model,
        args=(job_id, app)
    )
    training_thread.start()

    # Return the job ID
    return jsonify({
        "jobId": job_id,
        "status": "QUEUED",
        "message": "Training job submitted successfully"
    })

def process_dataset_upload(request, app, jsonify):
    """Process a dataset upload and training request"""
    # Check if the post request has the file part
    if 'dataset' not in request.files:
        return jsonify({"error": "No dataset file provided"}), 400

    file = request.files['dataset']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Get other form parameters
    model_name = request.form.get('modelName')
    model_type = request.form.get('modelType')

    if not model_name or not model_type:
        return jsonify({"error": "Missing required parameters: modelName or modelType"}), 400

    # Save the uploaded file
    filename = secure_filename(file.filename)
    dataset_dir = os.path.join(app.config['TRAINING_FOLDER'], 'datasets')
    os.makedirs(dataset_dir, exist_ok=True)

    filepath = os.path.join(dataset_dir, filename)
    file.save(filepath)

    # Create a job ID
    job_id = str(uuid.uuid4())

    # Create a job record
    job = {
        "id": job_id,
        "modelName": model_name,
        "modelType": model_type,
        "datasetPath": filepath,
        "epochs": int(request.form.get('epochs', 10)),
        "learningRate": float(request.form.get('learningRate', 0.001)),
        "status": "QUEUED",
        "createdAt": time.time(),
        "progress": 0.0
    }

    # Save the job
    training_jobs[job_id] = job

    # Start training in a background thread
    training_thread = threading.Thread(
        target=train_model,
        args=(job_id, app)
    )
    training_thread.start()

    # Return the job ID
    return jsonify({
        "jobId": job_id,
        "status": "QUEUED",
        "message": "Dataset uploaded and training job submitted successfully"
    })

def get_training_job_status(job_id, app, jsonify):
    """Get the status of a training job"""
    if job_id not in training_jobs:
        return jsonify({"error": "Job not found"}), 404

    job = training_jobs[job_id]
    return jsonify(job)

def train_model(job_id, app):
    """Train a model in the background"""
    job = training_jobs[job_id]

    try:
        # Update job status
        job["status"] = "RUNNING"
        job["startedAt"] = time.time()

        # Simulate training progress
        for i in range(1, 11):
            # Check if job was cancelled
            if job["status"] == "CANCELLED":
                return

            # Update progress
            job["progress"] = i * 10.0
            time.sleep(3)  # Simulate work

        # In a real implementation, you would:
        # 1. Load the dataset
        # 2. Preprocess the data
        # 3. Create and train the model
        # 4. Evaluate the model
        # 5. Save the model

        # Generate a model ID
        model_id = str(uuid.uuid4())

        # Create a dummy model file
        model_dir = os.path.join(app.config['MODELS_FOLDER'], model_id)
        os.makedirs(model_dir, exist_ok=True)

        # Create a metadata file
        metadata = {
            "id": model_id,
            "name": job["modelName"],
            "type": job["modelType"],
            "createdAt": time.time(),
            "accuracy": 0.85 if job["modelType"] == "PERSON_DETECTION" else 0.78
        }

        with open(os.path.join(model_dir, "metadata.json"), "w") as f:
            json.dump(metadata, f)

        # Update job status
        job["status"] = "COMPLETED"
        job["completedAt"] = time.time()
        job["modelId"] = model_id
        job["accuracy"] = metadata["accuracy"]

    except Exception as e:
        # Update job status to failed
        job["status"] = "FAILED"
        job["completedAt"] = time.time()
        job["errorMessage"] = str(e)
