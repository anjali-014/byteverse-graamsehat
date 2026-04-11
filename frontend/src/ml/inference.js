import * as tf from '@tensorflow/tfjs';
import { loadTriageModel } from './loadModel';
import { textToSymptomVector } from './vectorizer';

// Hard-coded danger signs — always RED regardless of model output
// These override the ML prediction for safety
const HARD_RED_SIGNS = [
  // Existing rules
  'gardan akad', 'stiff neck', 'stiff_neck',
  'behoshi', 'unconscious',
  'seene mein dard', 'chest pain', 'chest_pain',
  'mirgi', 'fits', 'convulsion',
  'sans nahi', 'not breathing',
  'khoon bahut', 'heavy bleeding',
  'laqwa', 'paralysis',
  'altered sensorium', 'altered_sensorium',

  // Dengue specific — pathognomonic signs
  'pain_behind_the_eyes',
  'pain behind the eyes',
  'pain behind eyes',
  'aankhon ke peeche dard',
  'aankhon mein gehri takleef',

  // Malaria specific  
  'blackwater fever',
  'cerebral malaria',
];
function applyHardRules(originalText, result) {
  const text = originalText.toLowerCase().trim();

  const HARD_RED_SIGNS = [
    'gardan akad', 'stiff neck', 'stiff_neck',
    'behoshi', 'unconscious', 'गर्दन अकड़', 'बेहोशी',
    'chest pain', 'chest_pain', 'seene mein dard', 'छाती में दर्द',
    'pain behind eyes', 'pain_behind_the_eyes', 'aankhon ke peeche dard',
    'mirgi', 'fits', 'convulsion', 'मिर्गी',
    'sans nahi', 'not breathing',
    'heavy bleeding', 'zyada khoon',
    'paralysis', 'laqwa',
    'altered sensorium', 'altered_sensorium',
    'red spots', 'red_spots_over_body', 'lal dabbe', 'लाल दाने',
  ];

  const RED_ADVICE = {
    steps: [
      'तुरंत नज़दीकी PHC या अस्पताल जाएं',
      '108 एम्बुलेंस को कॉल करें',
      'मरीज़ को अकेला न छोड़ें',
      'पानी पिलाएं, घबराएं नहीं'
    ]
  };

  const triggered = HARD_RED_SIGNS.filter(sign => text.includes(sign));

  if (triggered.length > 0) {
    console.log('🚨 Hard RED triggered by:', triggered);
    return {
      ...result,
      level: 'RED',
      advice: RED_ADVICE,      // ✅ override advice for RED
      confidence: Math.max(result.confidence, 95),  // hard rules = high confidence
      hardOverride: true,
      triggeredSigns: triggered
    };
  }
  return { ...result, hardOverride: false };
}

export async function runTriage(transcribedText) {
  // Step 1 — load model (cached after first load)
  const model = await loadTriageModel();

  // Step 2 — convert text to vector
  const vector = await textToSymptomVector(transcribedText);
  const activeSymptoms = vector.filter(v => v === 1).length;

  // Step 3 — guard: need at least 1 symptom
  if (activeSymptoms === 0) {
    return {
      level: null,
      error: 'NO_SYMPTOMS',
      message: 'Koi lakshan nahi mila. Kripya dobara bolein.'
    };
  }

  // Step 4 — run inference
  const inputTensor = tf.tensor2d([vector]);
  const predTensor  = model.predict(inputTensor);
  const probs       = await predTensor.data();

  inputTensor.dispose();
  predTensor.dispose();

  // Replace your existing runTriage function's return section
// from "Step 5" onwards with this:

  // Step 5 — threshold-based classification
  let level;
  if      (probs[2] > 0.50) level = 'RED';
  else if (probs[1] > 0.45) level = 'YELLOW';
  else                       level = 'GREEN';

  // Safety net — 2+ symptoms but GREEN → upgrade to YELLOW
  if (level === 'GREEN' && activeSymptoms >= 2) level = 'YELLOW';

  // ── Get detected symptom names (for ResultPage.detectedSymptoms) ──
  const colsRes = await fetch('/data/symptom_cols.json');
  const symptomCols = await colsRes.json();
  const detectedSymptoms = symptomCols.filter((_, i) => vector[i] === 1);

  // ── Hindi advice steps per triage level ──────────────────────────
  const ADVICE = {
    RED: {
      steps: [
        'तुरंत नज़दीकी PHC या अस्पताल जाएं',
        '108 एम्बुलेंस को कॉल करें',
        'मरीज़ को अकेला न छोड़ें',
        'पानी पिलाएं, घबराएं नहीं'
      ]
    },
    YELLOW: {
      steps: [
        '24 घंटे के अंदर डॉक्टर को दिखाएं',
        'आराम करने दें और पानी पिलाएं',
        'बुखार हो तो पैरासिटामोल दे सकते हैं',
        'लक्षण बढ़ें तो तुरंत PHC जाएं'
      ]
    },
    GREEN: {
      steps: [
        'घर पर देखभाल करें',
        'खूब पानी और आराम करें',
        'हल्का खाना खिलाएं',
        '2 दिन में ठीक न हो तो PHC जाएं'
      ]
    }
  };

  const result = {
    level,
    confidence: Math.round(Math.max(...probs) * 100),  // integer % for ResultPage
    probabilities: {
      green:  parseFloat(probs[0].toFixed(4)),
      yellow: parseFloat(probs[1].toFixed(4)),
      red:    parseFloat(probs[2].toFixed(4))
    },
    activeSymptoms,
    detectedSymptoms,          // ✅ array of names for ResultPage
    advice: ADVICE[level],     // ✅ Hindi steps for ResultPage
    diseaseHint: null,         // optional — can add later
    hardOverride: false
  };

  // Step 6 — apply hard rules
  return applyHardRules(transcribedText, result);
}