import os
import tensorflow as tf
import numpy as np
from skimage.transform import resize
import cv2
from flask import Flask, request, render_template, flash, redirect, url_for, send_from_directory, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.secret_key = "supersecretkey"
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create uploads directory if it doesn’t exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Model initialization
np.random.seed(1234)

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


def mamon_videoFightModel2(tf, weight="E:/Dataset/violencewights-combo94-cnn-lstm/mamonbest947oscombo-drive.h5"):
    layers = tf.keras.layers
    models = tf.keras.models
    optimizers = tf.keras.optimizers
    num_classes = 2

    base_model = tf.keras.applications.VGG19(
        include_top=False,
        weights=None,
        input_shape=(160, 160, 3)
    )
    base_model.load_weights("E:/Dataset/vgg19_weights_tf_dim_ordering_tf_kernels_notop.h5")

    cnn = models.Sequential([
        base_model,
        layers.Flatten()
    ])

    model = models.Sequential([
        layers.Input(shape=(30, 160, 160, 3)),
        layers.TimeDistributed(cnn),
        layers.LSTM(30, return_sequences=True),
        layers.TimeDistributed(layers.Dense(90)),
        layers.Dropout(0.1),
        layers.GlobalAveragePooling1D(),
        layers.Dense(512, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(num_classes, activation="sigmoid")
    ])

    adam = optimizers.Adam(learning_rate=0.0005, beta_1=0.9, beta_2=0.999, epsilon=1e-08)
    model.load_weights(weight)
    model.compile(loss='binary_crossentropy', optimizer=adam, metrics=["accuracy"])
    return model


model22 = mamon_videoFightModel2(tf)


def video_mamonreader(cv2, filename):
    frames = np.zeros((30, 160, 160, 3), dtype=np.float32)
    i = 0
    vc = cv2.VideoCapture(filename)
    if not vc.isOpened():
        raise ValueError(f"Could not open video file: {filename}")

    rval, frame = vc.read()
    if not rval:
        raise ValueError("Failed to read the first frame")

    frm = resize(frame, (160, 160, 3))
    frm = frm / 255.0 if np.max(frm) > 1 else frm
    frames[i] = frm
    i += 1

    while i < 30 and rval:
        rval, frame = vc.read()
        if rval:
            frm = resize(frame, (160, 160, 3))
            frm = frm / 255.0 if np.max(frm) > 1 else frm
            frames[i] = frm
            i += 1

    vc.release()
    return frames


def pred_fight(model, video, accuracy=0.65):
    pred_test = model.predict(video, verbose=0)
    fight_prob = pred_test[0][1]
    return (True, fight_prob) if fight_prob >= accuracy else (False, fight_prob)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            try:
                vid = video_mamonreader(cv2, filepath)
                datav = np.expand_dims(vid, axis=0)
                fight, percent = pred_fight(model22, datav)
                result = {
                    'fight': 'Yes' if fight else 'No',
                    'percentage': f"{percent * 100:.2f}%"
                }
                return render_template('index.html', result=result, video_path=filename)
            except Exception as e:
                flash(f"Error processing video: {str(e)}")
                return redirect(request.url)

    return render_template('index.html', result=None)


@app.route('/api/predict', methods=['POST'])
def predict_api():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        try:
            vid = video_mamonreader(cv2, filepath)
            datav = np.expand_dims(vid, axis=0)

            import time
            start_time = int(round(time.time() * 1000))
            fight, percent = pred_fight(model22, datav)
            end_time = int(round(time.time() * 1000))

            result = {
                'fight': fight,
                'precentegeoffight': f"{percent * 100:.2f}",
                'processing_time': str(end_time - start_time)
            }

            return jsonify(result)

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'Invalid file type'}), 400


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


if __name__ == '__main__':
    app.run(debug=True)