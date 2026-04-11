let symptomCols = null;
let symptomMap = null;

// Load both JSON files once
async function loadVocabulary() {
  if (symptomCols && symptomMap) return;

  const [colsRes, mapRes] = await Promise.all([
    fetch('/data/symptom_cols.json'),
    fetch('/data/symptom_map.json')
  ]);

  symptomCols = await colsRes.json();
  symptomMap  = await mapRes.json();
  console.log(`✅ Vocabulary loaded: ${symptomCols.length} symptoms, ${Object.keys(symptomMap).length} Hindi mappings`);
}

export async function textToSymptomVector(transcribedText) {
  await loadVocabulary();

  const vector = new Array(symptomCols.length).fill(0);
  let text = transcribedText.toLowerCase().trim();

  // Step 1 — apply Hindi/Bhojpuri synonym map
  Object.entries(symptomMap).forEach(([hindi, english]) => {
    if (text.includes(hindi)) {
      text += ' ' + english.replace(/_/g, ' ');
    }
  });

  // Step 2 — also map common English phrases directly
  const ENGLISH_PHRASE_MAP = {
    'pain behind eyes':    'pain behind the eyes',
    'pain behind the eyes':'pain behind the eyes',
    'chest pain':          'chest pain',
    'stiff neck':          'stiff neck',
    'red spots':           'red spots over body',
    'joint pain':          'joint pain',
    'muscle pain':         'muscle pain',
    'back pain':           'back pain',
    'stomach pain':        'abdominal pain',
    'belly pain':          'belly pain',
  };

  Object.entries(ENGLISH_PHRASE_MAP).forEach(([phrase, replacement]) => {
    if (text.includes(phrase)) {
      text += ' ' + replacement;
    }
  });

  // Step 3 — match against symptom column names
  symptomCols.forEach((symptom, i) => {
    const symptomWords = symptom.replace(/_/g, ' ');
    if (text.includes(symptomWords) || text.includes(symptom)) {
      vector[i] = 1;
    }
  });

  const activeCount = vector.filter(v => v === 1).length;
  console.log(`Vectorized: ${activeCount} symptoms detected from: "${text}"`);
  return vector;
}

export async function getSymptomCols() {
  await loadVocabulary();
  return symptomCols;
}