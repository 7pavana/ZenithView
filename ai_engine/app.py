import os
import cv2
import librosa
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from moviepy import VideoFileClip
from tensorflow.keras.models import load_model
from predictor import multimodal_predict 
app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = "temp_uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
VIDEO_MODEL = load_model('trained.keras')
def process_video(video_path):
    audio_path = video_path.rsplit(".", 1)[0] + ".wav"
    with VideoFileClip(video_path) as clip:
        duration = clip.duration
        if clip.audio:
            clip.audio.write_audiofile(audio_path, logger=None)
        else:
            raise Exception("Video has no audio track")
    y, sr = librosa.load(audio_path)
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS) 
    num_samples = 10
    frame_indices = np.linspace(0, total_frames - 1, num_samples, dtype=int)
    
    all_timestamp_results = [] 
    for idx in frame_indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        success, frame = cap.read()
        if success:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            resized = cv2.resize(gray, (48, 48))
            v_input = (resized / 255.0).reshape(1, 48, 48, 1)
            current_time = idx / fps
            start_sample = int(max(0, current_time - 1.25) * sr)
            end_sample = int(min(duration, current_time + 1.25) * sr)
            audio_slice = y[start_sample:end_sample]  
            if len(audio_slice) > 0:
                mfcc = librosa.feature.mfcc(y=audio_slice, sr=sr, n_mfcc=40)
                a_feat = np.mean(mfcc.T, axis=0).reshape(40, 1)
                emotion, confidence = multimodal_predict(a_feat, v_input)
                all_timestamp_results.append({
                    "timestamp": round(current_time, 2),
                    "emotion": emotion,
                    "confidence": float(confidence)
                })
    cap.release()
    return all_timestamp_results, audio_path
@app.route("/predict", methods=["POST"])
def predict():
    if "video" not in request.files:
        return jsonify({"error": "No video uploaded"}), 400
    video_file = request.files["video"]
    file_path = os.path.join(UPLOAD_FOLDER, video_file.filename)
    video_file.save(file_path)
    audio_path = None
    try:
        timeline, audio_path = process_video(file_path)
        if not timeline:
            return jsonify({"error": "Processing failed", "status": "failed"}), 400
        emotions_only = [res['emotion'] for res in timeline]
        dominant_emotion = max(set(emotions_only), key=emotions_only.count)     
        return jsonify({
            "dominant_emotion": dominant_emotion,
            "timeline": timeline,
            "status": "success"
        })
    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({"error": str(e), "status": "failed"}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
        if audio_path and os.path.exists(audio_path):
            os.remove(audio_path)

if __name__ == "__main__":
    app.run(debug=True, port=5000)