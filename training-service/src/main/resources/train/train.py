from flask import Flask, request, jsonify
import cv2
import numpy as np
import tensorflow as tf

app = Flask(__name__)

@app.route('/train', methods=['POST'])
def train_model():
    data = request.get_json()
    video_url = data['videoUrl']

    # Tải video
    cap = cv2.VideoCapture(video_url)
    frames = []
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)
    cap.release()

    # Giả lập huấn luyện mô hình nhận diện vùng chuyển động
    # Sử dụng OpenCV để phát hiện chuyển động
    model = tf.keras.Sequential([
        tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    # Huấn luyện giả lập (thay bằng dữ liệu thực tế)
    model.save('movement_model.h5')

    return jsonify({"message": "Model trained and saved as movement_model.h5"})

# Tải mô hình đã huấn luyện
model = tf.keras.models.load_model('movement_model.h5')

@app.route('/detect', methods=['POST'])
def detect_violence():
    video_file = request.files['file']
    video_path = 'temp_video.mp4'
    video_file.save(video_path)

    # Tải video
    cap = cv2.VideoCapture(video_path)
    frames = []
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.resize(frame, (224, 224))
        frames.append(frame)
    cap.release()

    # Chuyển thành tensor và dự đoán
    frames = np.array(frames) / 255.0
    prediction = model.predict(frames)
    is_violent = np.mean(prediction) > 0.5

    result = {
        "isViolent": bool(is_violent),
        "description": "Violence detected" if is_violent else "No violence",
        "confidence": float(np.mean(prediction))
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)