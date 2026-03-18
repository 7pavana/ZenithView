import kagglehub

# Download latest version
path1 = kagglehub.dataset_download("uwrfkaggler/ravdess-emotional-speech-audio")
print("Path to dataset files:", path1)
path = kagglehub.dataset_download("msambare/fer2013")
print("Path to dataset files:", path)