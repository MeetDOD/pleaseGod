import tensorflow as tf
import numpy as np

# Load the trained model
model = tf.keras.models.load_model(r"F:\Hackthon\pleaseGod\trainer\data\models\legal_model.keras")  
print("✅ Model loaded successfully!")

# Sample input for a low-risk case (Risk Level 0)
sample_case = np.array([[30, 1, 0, 0, 10000, 9500, 1, 5, 0]])  # Example case

# Make a prediction
prediction = model.predict(sample_case)

# Get the predicted risk level
predicted_risk = np.argmax(prediction)  # Get the class with the highest probability
print(f"🟢 Predicted Risk Level: {predicted_risk}")
