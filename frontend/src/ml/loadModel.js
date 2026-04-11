import * as tf from '@tensorflow/tfjs';

let model = null;
let isLoading = false;

export async function loadTriageModel() {
  if (model) return model;
  if (isLoading) {
    // Wait for existing load to finish
    while (isLoading) {
      await new Promise(r => setTimeout(r, 100));
    }
    return model;
  }

  isLoading = true;
  try {
    console.log('Loading triage model...');
    model = await tf.loadLayersModel('/models/tfjs_model/model.json');
    console.log('✅ Model loaded:', model.inputs[0].shape);
    return model;
  } catch (err) {
    console.error('❌ Model load failed:', err);
    throw err;
  } finally {
    isLoading = false;
  }
}

export function getModel() {
  return model;
}