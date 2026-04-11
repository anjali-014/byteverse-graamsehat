import { textToSymptomVector, getSymptomCols } from './vectorizer.js';
// Add at bottom of triageEngine.js
export function getSymptomLabel(symptomKey) {
  // Convert snake_case to readable Hindi/English
  const LABELS = {
    'high_fever': 'तेज़ बुखार',
    'headache': 'सिर दर्द',
    'fatigue': 'थकान',
    'vomiting': 'उल्टी',
    'nausea': 'जी मचलना',
    'chest_pain': 'सीने में दर्द',
    'breathlessness': 'सांस लेने में तकलीफ',
    'stiff_neck': 'गर्दन अकड़',
    'pain_behind_the_eyes': 'आंखों के पीछे दर्द',
    'red_spots_over_body': 'लाल दाने',
    'joint_pain': 'जोड़ों में दर्द',
    'muscle_pain': 'मांसपेशियों में दर्द',
    'abdominal_pain': 'पेट दर्द',
    'diarrhoea': 'दस्त',
    'skin_rash': 'चकत्ते',
    'yellowish_skin': 'पीली त्वचा',
    'loss_of_appetite': 'भूख न लगना',
    'cough': 'खांसी',
    'chills': 'ठंड लगना',
    'sweating': 'पसीना',
  };
  return LABELS[symptomKey] || symptomKey.replace(/_/g, ' ');
}

// Bridge function — connects TriagePage to your inference.js
import { runTriage } from './inference.js';

export async function runTriageInference(inputText) {
  return await runTriage(inputText);
}