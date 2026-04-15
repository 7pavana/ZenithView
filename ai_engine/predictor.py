import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model

audio_engine = load_model('Audio_updated.keras') 
vision_engine = load_model('zenithview_CustomCNN_Best_17.keras')

emotion_map = {
    0: 'Angry', 1: 'Disgust', 2: 'Fear', 
    3: 'Happy', 4: 'Sad', 5: 'Surprise', 6: 'Neutral'
}

def multimodal_predict(audio_data, vision_frame):
    """
    audio_data: MFCC features (Expected shape: 40,)
    vision_frame: Preprocessed image (Expected shape: 48, 48, 1)
    """
    try:
        a_input = np.array(audio_data).flatten()[:40]
        a_input = a_input.reshape(1, 40, 1)
        prob_audio = audio_engine.predict(a_input, verbose=0)[0] 
        v_input = np.array(vision_frame).reshape(1, 48, 48, 1)
        prob_video = vision_engine.predict(v_input, verbose=0)[0] 

       
        audio_neutral_avg = (prob_audio[0] + prob_audio[1]) / 2
        prob_audio_aligned = np.array([
            prob_audio[4], # Angry (Index 0)
            prob_audio[6], # Disgust (Index 1)
            prob_audio[5], # Fear (Index 2)
            prob_audio[2], # Happy (Index 3)
            prob_audio[3], # Sad (Index 4)
            prob_audio[7], # Surprise (Index 5)
            audio_neutral_avg # Neutral (Index 6)
        ])
        
        prob_audio_aligned /= (np.sum(prob_audio_aligned) + 1e-7)
        a_conf = np.max(prob_audio_aligned)
        w_a, w_v = (0.85, 0.15) if a_conf > 0.6 else (0.65, 0.35)
        final_prob = (w_a * prob_audio_aligned) + (w_v * prob_video)
        final_idx = np.argmax(final_prob)
        
        return emotion_map[final_idx], np.max(final_prob)
    
    except Exception as e:
        raise Exception(f"Prediction logic failed: {e}")