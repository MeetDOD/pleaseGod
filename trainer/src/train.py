import os
import tensorflow as tf
import json
import numpy as np

# Ensure the 'models' directory exists
os.makedirs('./models', exist_ok=True)

# Load Preprocessed Data
with open('./data/preprocessed.json', 'r') as file:
    raw_data = json.load(file)

# Extract Features (X) and Labels (Y)
features = np.array([[   
    row['DurationDays'], 
    row['ComplexityScore'], 
    row['CourtLevel'], 
    row['Region'], 
    row['ClaimAmount'], 
    row['SettlementAmount'], 
    row['LegalRepresentation'], 
    row['EvidenceScore'], 
    row['SettlementType']
] for row in raw_data])

labels = np.array([row['RiskLevel'] for row in raw_data])

# Define the model
model = tf.keras.Sequential([
    tf.keras.layers.Dense(16, activation='relu', input_shape=(features.shape[1],)),
    tf.keras.layers.Dense(8, activation='relu'),
    tf.keras.layers.Dense(3, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Train the model
model.fit(
    features, 
    labels,
    epochs=150,
    batch_size=10,
    shuffle=True
)

# Save the model (now the directory exists)
model.save('./models/legal_model.keras')

print("✅ Model training complete and saved successfully!")
