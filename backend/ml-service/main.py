from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "ML Service Running 🚀"}

@app.post("/predict")
def predict():
    return {"prediction": "Working ✅"}