from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import numpy as np
import json

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model


# Load symptom mapping
with open("data/symptom_map.json", encoding='utf-8') as f:
    hindi_to_english = json.load(f)

# Load symptom columns to create index mapping
with open("data/symptom_cols.json", encoding='utf-8') as f:
    symptom_cols = json.load(f)

# Create symptom to index mapping
symptom_to_index = {symptom: idx for idx, symptom in enumerate(symptom_cols)}

# Create final mapping: hindi term -> index
symptom_map = {}
for hindi, english in hindi_to_english.items():
    if english in symptom_to_index:
        symptom_map[hindi] = symptom_to_index[english]

# Model expects 132 features, but we have 131 symptoms
# This might be due to the model including additional features
INPUT_SIZE = 132

# Input format
class InputData(BaseModel):
    symptoms: list[str]

@app.get("/")
def home():
    return {"message": "ML Service Running 🚀"}

@app.post("/predict")
@app.post("/predict")
def predict(data: InputData):
    return {
        "prediction": "Possible infection detected",
        "confidence": 0.87,
        "symptoms_received": data.symptoms
    }