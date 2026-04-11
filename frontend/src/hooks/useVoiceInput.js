import { useState, useRef, useCallback } from 'react'
 
export function useVoiceInput() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const [confidence, setConfidence] = useState(0)
  const recognitionRef = useRef(null)
 
  const startListening = useCallback(() => {
    setError(null)
 
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('voice_not_supported')
      return
    }
 
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
 
    // Configure for Hindi + multilingual
    recognition.lang = 'hi-IN'
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 3
 
    recognition.onstart = () => {
      setIsListening(true)
      setTranscript('')
    }
 
    recognition.onresult = (event) => {
      let interimTranscript = ''
      let finalTranscript = ''
 
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
          setConfidence(result[0].confidence || 0.8)
        } else {
          interimTranscript += result[0].transcript
        }
      }
 
      if (finalTranscript) {
        setTranscript(prev => (prev + ' ' + finalTranscript).trim())
      } else if (interimTranscript) {
        // Show interim results with indicator
        setTranscript(interimTranscript)
      }
    }
 
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      if (event.error === 'not-allowed') {
        setError('mic_permission_denied')
      } else if (event.error === 'network') {
        setError('network_error')
      } else if (event.error === 'no-speech') {
        setError('no_speech')
      } else {
        setError('recognition_error')
      }
    }
 
    recognition.onend = () => {
      setIsListening(false)
    }
 
    try {
      recognition.start()
    } catch (e) {
      setError('recognition_error')
      setIsListening(false)
    }
  }, [])
 
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }, [])
 
  const clearTranscript = useCallback(() => {
    setTranscript('')
    setError(null)
    setConfidence(0)
  }, [])
 
  const appendText = useCallback((text) => {
    setTranscript(prev => prev ? prev + ' ' + text : text)
  }, [])
 
  return {
    isListening,
    transcript,
    setTranscript,
    error,
    confidence,
    startListening,
    stopListening,
    clearTranscript,
    appendText,
    isSupported: !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  }
}
 