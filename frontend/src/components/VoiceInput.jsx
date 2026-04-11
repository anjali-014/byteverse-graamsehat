import { useState, useRef } from 'react';

export default function VoiceInput({ onTranscript, onError, disabled }) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SR) {
      onError('Voice input not supported on this browser. Please type symptoms.');
      return;
    }

    const recognition = new SR();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setInterim('');
    };

    recognition.onresult = (event) => {
      let interimText = '';
      let finalText = '';

      for (const result of event.results) {
        if (result.isFinal) finalText += result[0].transcript;
        else interimText += result[0].transcript;
      }

      setInterim(interimText);
      if (finalText) onTranscript(finalText);
    };

    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === 'no-speech') {
        onError('Koi awaaz nahi aayi. Dobara try karein.');
      } else if (event.error === 'network') {
        onError('Network error. Offline mode mein type karein.');
      } else {
        onError(`Voice error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setListening(false);
      setInterim('');
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <button
        onClick={listening ? stopListening : startListening}
        disabled={disabled}
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: 'none',
          fontSize: 32,
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: listening ? '#e74c3c' : '#3498db',
          color: 'white',
          boxShadow: listening ? '0 0 0 8px rgba(231,76,60,0.3)' : 'none',
          transition: 'all 0.2s',
        }}
      >
        {listening ? '⏹' : '🎤'}
      </button>
      <p style={{ marginTop: 8, color: '#666', fontSize: 14 }}>
        {listening ? `Sun raha hoon... ${interim}` : 'Lakshan bolne ke liye dabaaein'}
      </p>
    </div>
  );
}