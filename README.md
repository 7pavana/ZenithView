# ZenithView 🌌
### A Multimodal Late Fusion Framework for Real-Time Public Speaking Emotion Analytics

**Author:** [Pavana HG](https://github.com/7pavana)  
*Dayananda Sagar College of Engineering (DSCE), Bengaluru, India*

---

## 📌 Overview
**ZenithView** is an AI-driven framework designed to combat **Public Speaking Anxiety (PSA)**. Unlike traditional unimodal systems that fail in low light or noisy environments, ZenithView uses a **Multimodal Late Fusion** approach. By cross-referencing spatial facial features and vocal prosody, it provides a robust, real-time diagnostic tool for professionals and students.

### Key Features
* **Audio-Visual Synchronization:** A unified pipeline that processes webcam feed and microphone input simultaneously.
* **Late Fusion Resilience:** Mitigates "Snapshot Bias" by validating facial expressions against vocal tones (e.g., distinguishing "Neutral" from "Calm").
* **Resource Efficient:** Optimized to run on standard consumer-grade hardware (CPUs/low-end GPUs) without requiring expensive clusters.

---

## 🛠️ System Architecture
The framework operates on two distinct neural processing branches:

1.  **Visual Branch (2D-CNN):** Analyzes spatial facial geometry using the **FER-2013** dataset.
2.  **Audio Branch (1D-CNN):** Analyzes vocal prosody and frequency components via **Mel Frequency Cepstral Coefficients (MFCC)** using the **RAVDESS** dataset.
3.  **Late Fusion Layer:** Consolidates the outputs of both branches to provide a final emotion classification.

---

## 📊 Performance Metrics
The system was validated using standard benchmark databases, achieving high reliability across various emotional states.

| Model | Dataset | Accuracy |
| :--- | :--- | :--- |
| **Visual (2D-CNN)** | FER-2013 | 64% |
| **Audio (1D-CNN)** | RAVDESS | **88%** |
| **Consolidated (ZenithView)** | **Multimodal** | **76%** |

### Visual Analysis Insights
The visual engine excels at identifying high-intensity emotions like **Happy (90% precision)** and **Surprise (68% precision)**.

---

## 💻 Tech Stack
* **Languages:** Python
* **Deep Learning:** TensorFlow / Keras (1D & 2D CNNs)
* **Signal Processing:** Librosa (MFCC Extraction)
* **Computer Vision:** OpenCV, MediaPipe
* **Web Integration:** JavaScript (Client-side interface)

---

## 🚀 Future Work
* **Temporal Modeling:** Integration of **LSTM (Long Short-Term Memory)** units to capture emotional trends over time.
* **Real-world Testing:** Deploying the system in live auditorium settings to refine practical applicability.
* **Linguistic Analysis:** Incorporating LLMs for real-time speech-to-text sentiment analysis.

---

## 📜 Citation
If you use this research or framework in your work, please cite it as:
> *HG, P. (2026). ZenithView: A Multimodal Late Fusion Framework for Real-Time Public Speaking Emotion Analytics.*

---
*Developed with ❤️ at Dayananda Sagar College of Engineering.*
