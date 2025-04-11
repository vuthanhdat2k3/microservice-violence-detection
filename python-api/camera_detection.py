import cv2
import numpy as np
import threading
from utils import pred_fight
import time

# Global stop event for camera detection
stop_event = threading.Event()

def detect_violence_from_camera(model, camera_index=0, frame_skip=5):
    """
    Detect violence from camera feed

    Args:
        model: Loaded TensorFlow model
        camera_index: Camera device index (default: 0 for webcam)
        frame_skip: Number of frames to skip between predictions (for performance)
    """
    cap = cv2.VideoCapture(camera_index)

    if not cap.isOpened():
        print("Error: Could not open camera.")
        return

    frame_count = 0
    frames_buffer = []

    try:
        while not stop_event.is_set():
            ret, frame = cap.read()
            if not ret:
                print("Error: Failed to capture frame.")
                break

            # Display the frame
            cv2.imshow('Violence Detection', frame)

            # Process every nth frame for performance
            if frame_count % frame_skip == 0:
                # Preprocess frame
                processed_frame = cv2.resize(frame, (160, 160))
                frames_buffer.append(processed_frame)

                # When we have enough frames for prediction
                if len(frames_buffer) >= 20:  # Assuming model needs 20 frames
                    # Convert frames to format expected by model
                    frames_array = np.array(frames_buffer[-20:])  # Take last 20 frames
                    frames_array = frames_array / 255.0  # Normalize

                    # Make prediction
                    input_data = np.expand_dims(frames_array, axis=0)
                    fight, percent = pred_fight(model, input_data)

                    # Display result on frame
                    text = f"Violence: {'Yes' if fight else 'No'} ({percent*100:.2f}%)"
                    color = (0, 0, 255) if fight else (0, 255, 0)  # Red if fight, green otherwise
                    cv2.putText(frame, text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
                    cv2.imshow('Violence Detection', frame)

                    # Remove oldest frame to maintain buffer size
                    frames_buffer.pop(0)

            frame_count += 1

            # Check for 'q' key to stop
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    finally:
        stop_event.set()
        cap.release()
        cv2.destroyAllWindows()
