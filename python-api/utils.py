import os
import numpy as np
import cv2

def check_opencv_gui():
    """Check if OpenCV GUI support is available"""
    try:
        cv2.namedWindow("Test", cv2.WINDOW_NORMAL)
        cv2.destroyAllWindows()
        print("OpenCV GUI support is available")
    except:
        print("WARNING: OpenCV GUI support is not available. Camera detection may not work properly.")

def load_model(tf):
    """Load the violence detection model"""
    model_path = os.environ.get('MODEL_PATH', 'models/violence_detection_model')

    try:
        # Try to load the model
        model = tf.keras.models.load_model(model_path)
        print(f"Model loaded successfully from {model_path}")
        return model
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        print("Using dummy model for testing purposes")
        # Create a dummy model for testing if the real model can't be loaded
        return create_dummy_model(tf)

def create_dummy_model(tf):
    """Create a dummy model for testing purposes"""
    inputs = tf.keras.Input(shape=(None, 160, 160, 3))
    x = tf.keras.layers.ConvLSTM2D(filters=4, kernel_size=(3, 3), padding='same', return_sequences=False)(inputs)
    x = tf.keras.layers.Flatten()(x)
    outputs = tf.keras.layers.Dense(1, activation='sigmoid')(x)
    model = tf.keras.Model(inputs, outputs)
    return model

def video_mamonreader(cv2, filepath, target_frames=20, resize=(160, 160)):
    """
    Read video file and convert to format expected by the model

    Args:
        cv2: OpenCV module
        filepath: Path to video file
        target_frames: Number of frames to extract
        resize: Target size for frames

    Returns:
        Numpy array of processed video frames
    """
    cap = cv2.VideoCapture(filepath)

    # Get video properties
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    duration = frame_count / fps

    # Calculate frame indices to extract
    if frame_count <= target_frames:
        # If video has fewer frames than target, duplicate frames
        indices = np.linspace(0, frame_count-1, target_frames, dtype=int)
    else:
        # Extract evenly spaced frames
        indices = np.linspace(0, frame_count-1, target_frames, dtype=int)

    frames = []
    for idx in indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if not ret:
            # If frame read failed, create a blank frame
            frame = np.zeros((resize[0], resize[1], 3), dtype=np.uint8)
        else:
            # Resize frame
            frame = cv2.resize(frame, resize)

        # Normalize pixel values
        frame = frame / 255.0
        frames.append(frame)

    cap.release()
    return np.array(frames)

def pred_fight(model, video_data):
    """
    Predict if video contains violence

    Args:
        model: TensorFlow model
        video_data: Preprocessed video data

    Returns:
        Tuple of (is_fight, confidence)
    """
    # Make prediction
    prediction = model.predict(video_data)[0][0]

    # Determine if fight based on threshold
    threshold = 0.5
    is_fight = prediction >= threshold

    return bool(is_fight), float(prediction)
