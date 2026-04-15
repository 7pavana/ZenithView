import os
import cv2
import librosa
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from moviepy import VideoFileClip
import tensorflow as tf
from predictor import multimodal_predict 
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
API_KEY = os.getenv("API_KEY")

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "temp_uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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
            gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            resized = cv2.resize(gray_frame, (48, 48))
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            clahe_frame = clahe.apply(resized)
            v_input = clahe_frame.astype(np.float32) / 255.0
            v_input = np.expand_dims(v_input, axis=(0, -1)) #
            
            current_time = idx / fps
            start_sample = int(max(0, current_time - 1.25) * sr)
            end_sample = int(min(duration, current_time + 1.25) * sr)
            audio_slice = y[start_sample:end_sample]
            
            if len(audio_slice) > 0:
                mfcc = librosa.feature.mfcc(y=audio_slice, sr=sr, n_mfcc=40)
                a_feat = np.mean(mfcc.T, axis=0).reshape(1, 40) 
                emotion, confidence = multimodal_predict(a_feat, v_input)
                
                all_timestamp_results.append({
                    "timestamp": round(current_time, 2),
                    "emotion": emotion,
                    "confidence": float(confidence)
                })
                
    cap.release()
    return all_timestamp_results, audio_path

genai.configure(api_key=API_KEY)
model_ai = genai.GenerativeModel('gemini-2.5-flash')

def get_ai_coaching(timeline, dominant_emotion):
    try:
        timeline_str = ", ".join([f"{item['timestamp']}s: {item['emotion']}" for item in timeline])
        prompt = f"""
        You are a professional public speaking coach. 
        The overall dominant emotion detected is {dominant_emotion}.
        Here is the emotional timeline: {timeline_str}.
        
        Provide:
        1. A brief summary of the emotional delivery.
        2. Two specific strengths.
        3. One area for improvement regarding emotional consistency.
        Tone: Encouraging. Max 150 words.
        """
        response = model_ai.generate_content(prompt)
        return response.text if response and response.text else "Timeline processed successfully."
    except Exception as e:
        print(f"Gemini AI Error: {e}")
        return "Your emotional timeline is ready, but AI feedback is temporarily unavailable."

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
        ai_feedback = get_ai_coaching(timeline, dominant_emotion) 
        
        return jsonify({
            "dominant_emotion": dominant_emotion,
            "timeline": timeline,
            "ai_feedback": ai_feedback,
            "status": "success"
        })
    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({"error": str(e), "status": "failed"}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
        if audio_path and os.path.exists(audio_path):
            os.remove(audio_path)

if __name__ == "__main__":
    app.run(debug=True, port=5000)