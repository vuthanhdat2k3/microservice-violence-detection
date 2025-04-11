import os
import numpy as np
import cv2
from werkzeug.utils import secure_filename
from utils import video_mamonreader, pred_fight
import time

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def setup_upload_folder():
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

def process_video_upload(request, model, app, render_template, flash, redirect, url_for, jsonify):
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
                fight, percent = pred_fight(model, datav)
                result = {
                    'fight': 'Yes' if fight else 'No',
                    'percentage': f"{percent * 100:.2f}%"
                }
                return render_template('index.html', result=result, video_path=filename)
            except Exception as e:
                flash(f"Error processing video: {str(e)}")
            finally:
                if os.path.exists(filepath):
                    os.remove(filepath)
            return redirect(request.url)

    return render_template('index.html', result=None)

def process_api_predict(request, model, app, jsonify):
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
            start_time = int(round(time.time() * 1000))
            fight, percent = pred_fight(model, datav)
            end_time = int(round(time.time() * 1000))

            result = {
                'fight': fight,
                'percentageoffight': f"{percent * 100:.2f}",
                'processing_time': str(end_time - start_time)
            }
            return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if os.path.exists(filepath):
                os.remove(filepath)

    return jsonify({'error': 'Invalid file type'}), 400
