# ML Service for GraamSehat

This is the machine learning service for the GraamSehat healthcare application. It provides AI-powered triage predictions based on patient symptoms.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the service:
```bash
uvicorn main:app --host 127.0.0.1 --port 8000
```

Or for development with auto-reload:
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## API Endpoints

- `GET /` - Health check
- `POST /predict` - Get triage prediction

### Prediction Request Format

```json
{
  "symptoms": ["bukhar", "sar dard", "thandi lagana"]
}
```

### Prediction Response Format

```json
{
  "prediction": 2,
  "confidence": 0.91
}
```

Prediction values:
- 0: GREEN (low urgency)
- 1: YELLOW (medium urgency)
- 2: RED (high urgency)

## Data Files

- `data/symptom_cols.json` - List of all possible symptoms (131 symptoms)
- `data/symptom_map.json` - Mapping from Hindi terms to English symptoms
- `models/best_model.keras` - Trained TensorFlow model (expects 132 input features)
- `models/model_config.json` - Model configuration and thresholds

## Model

The model is a neural network trained on symptom data to predict triage urgency levels. It uses a 132-dimensional input vector where each position represents the presence (1) or absence (0) of a specific symptom.