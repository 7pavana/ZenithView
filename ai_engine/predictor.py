import numpy as np
from tensorflow.keras.models import load_model
audio_model = load_model('Audio.keras')
video_model = load_model('trained.keras')
emotion_map = {
    0: 'Angry', 1: 'Disgust', 2: 'Fear', 
    3: 'Happy', 4: 'Sad', 5: 'Surprise', 6: 'Neutral'
}
def multimodal_predict(audio_data, video_input):
    """
    Fuses Audio and Video data with a 70/30 weight.
    """
    a_input = np.expand_dims(audio_data, axis=0)
    prob_audio = audio_model.predict(a_input, verbose=0)[0] 
    if isinstance(video_input, np.ndarray) and video_input.shape == (7,):
        prob_video = video_input
    else:
        v_input = np.expand_dims(video_input, axis=0) if video_input.ndim == 3 else video_input
        prob_video = video_model.predict(v_input, verbose=0)[0] 
    audio_neutral = max(prob_audio[0], prob_audio[1]) 
    prob_audio_aligned = np.array([
        prob_audio[4],  # Angry
        prob_audio[6],  # Disgust
        prob_audio[5],  # Fear
        prob_audio[2],  # Happy
        prob_audio[3],  # Sad
        prob_audio[7],  # Surprise
        audio_neutral   # Neutral
    ])
    final_prob = (0.7 * prob_audio_aligned) + (0.3 * prob_video)
    final_index = np.argmax(final_prob)
    confidence = np.max(final_prob)
    return emotion_map[final_index], confidence