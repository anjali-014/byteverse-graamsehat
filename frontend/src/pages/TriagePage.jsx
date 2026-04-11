import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVoiceInput } from '../hooks/useVoiceInput.js'
import { runTriageInference } from '../ml/triageEngine.js'
import { saveCase } from './utils/sync.js'
import { getCurrentUser } from './utils/auth.js'

// Common symptom quick-tap chips
const QUICK_SYMPTOMS = [
  { hindi: 'बुखार', term: 'bukhar' },
  { hindi: 'खांसी', term: 'khansi' },
  { hindi: 'उल्टी', term: 'ulti' },
  { hindi: 'दस्त', term: 'dast' },
  { hindi: 'सिरदर्द', term: 'sar dard' },
  { hindi: 'पेट दर्द', term: 'pet dard' },
  { hindi: 'कमज़ोरी', term: 'kamzori' },
  { hindi: 'सांस तकलीफ', term: 'sans mushkil' },
  { hindi: 'गर्दन अकड़', term: 'gardan akad' },
  { hindi: 'दाने/जल्द', term: 'jald daane' },
  { hindi: 'खाना नहीं', term: 'khaana nahi' },
  { hindi: 'बेहोशी', term: 'behoshi' }
]

export default function TriagePage() {
  const navigate = useNavigate()
  const { isListening, transcript, setTranscript, error, startListening, stopListening, clearTranscript, appendText, isSupported } = useVoiceInput()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [addedChips, setAddedChips] = useState(new Set())
  const [patientAge, setPatientAge] = useState('')
  const [patientGender, setPatientGender] = useState('')

  const handleMicToggle = () => {
    if (isListening) stopListening()
    else startListening()
  }

  const handleChipTap = (chip) => {
    appendText(chip.term)
    setAddedChips(prev => new Set([...prev, chip.term]))
  }

  const handleAnalyze = async () => {
    const text = transcript.trim()
    if (!text) return

    setIsAnalyzing(true)

    // Simulate brief processing time for UX
    await new Promise(r => setTimeout(r, 800))

    const fullInput = `${text} ${patientAge ? patientAge + ' saal' : ''} ${patientGender}`
    const result = await runTriageInference(fullInput)

    // Save and sync
    try {
      const currentUser = getCurrentUser()
      const ashaId = currentUser?.ashaId || currentUser?.id || 'demo_worker'
      await saveCase(result, ashaId)
    } catch (e) {
      console.warn('Could not save case:', e)
    }

    navigate('/result', { state: { result, inputText: text } })
  }

  const voiceErrorMessages = {
    voice_not_supported: 'आपके फोन में आवाज़ इनपुट नहीं है — टाइप करें',
    mic_permission_denied: '🎤 माइक की अनुमति दें',
    no_speech: 'कोई आवाज़ नहीं आई — फिर कोशिश करें',
    network_error: 'इंटरनेट नहीं — टाइप करके लिखें',
    recognition_error: 'समझ नहीं आया — फिर बोलें'
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-sehat-green px-5 pt-10 pb-5 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl"
          >
            ‹
          </button>
          <div>
            <h2 className="text-xl font-bold">लक्षण बताएं</h2>
            <p className="text-green-200 text-xs">बोलें या लिखें</p>
          </div>
        </div>

        {/* Patient info */}
        <div className="flex gap-2">
          <input
            type="number"
            value={patientAge}
            onChange={e => setPatientAge(e.target.value)}
            placeholder="उम्र (साल)"
            className="bg-white/20 text-white placeholder-green-200 rounded-xl px-3 py-2 text-sm w-28 outline-none"
          />
          <button
            onClick={() => setPatientGender(g => g === 'ladka' ? 'ladki' : g === 'ladki' ? '' : 'ladka')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              patientGender === 'ladka' ? 'bg-blue-400 text-white' :
              patientGender === 'ladki' ? 'bg-pink-400 text-white' :
              'bg-white/20 text-green-200'
            }`}
          >
            {patientGender === 'ladka' ? '👦 लड़का' : patientGender === 'ladki' ? '👧 लड़की' : '👤 लिंग'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-5 pt-5 pb-28">

        {/* Voice input area */}
        <div className={`relative rounded-2xl border-2 p-4 mb-4 min-h-28 transition-all ${
          isListening
            ? 'border-green-400 bg-green-50'
            : transcript ? 'border-green-300 bg-white' : 'border-gray-200 bg-gray-50'
        }`}>
          {transcript ? (
            <div className="pr-8">
              <p className="text-gray-800 text-base leading-relaxed">{transcript}</p>
            </div>
          ) : (
            <p className="text-gray-400 text-base">
              {isListening ? '🎤 सुन रहा हूं...' : 'यहां लक्षण लिखें या माइक दबाएं...'}
            </p>
          )}
          {transcript && (
            <button
              onClick={clearTranscript}
              className="absolute top-3 right-3 w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm"
            >
              ✕
            </button>
          )}
          {/* Editable overlay */}
          {!isListening && (
            <textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 resize-none outline-none cursor-text"
              placeholder="लिखें..."
            />
          )}
          {transcript && !isListening && (
            <p className="text-xs text-gray-400 mt-2">✏️ छूकर बदल सकते हैं</p>
          )}
        </div>

        {/* Voice error */}
        {error && (
          <div className="mb-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5 text-sm text-orange-700">
            ⚠️ {voiceErrorMessages[error] || 'कोई गड़बड़ी हुई'}
          </div>
        )}

        {/* Quick symptom chips */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">जल्दी चुनें</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_SYMPTOMS.map(chip => (
              <button
                key={chip.term}
                onClick={() => handleChipTap(chip)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium border transition-all active:scale-95 ${
                  addedChips.has(chip.term)
                    ? 'bg-sehat-green text-white border-sehat-green'
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                {chip.hindi}
              </button>
            ))}
          </div>
        </div>

        {/* Duration chips */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">कब से?</p>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'आज से', term: 'aaj se' },
              { label: '2 दिन से', term: 'do din se' },
              { label: '3 दिन से', term: 'teen din se' },
              { label: '5 दिन से', term: 'panch din se' },
              { label: '1 हफ्ते से', term: 'hafte se' }
            ].map(d => (
              <button
                key={d.term}
                onClick={() => { appendText(d.term); setAddedChips(prev => new Set([...prev, d.term])) }}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium border transition-all active:scale-95 ${
                  addedChips.has(d.term)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 flex gap-3 items-center">
        {/* Mic button */}
        <div className="relative flex items-center justify-center">
          {isListening && (
            <>
              <div className="absolute w-16 h-16 rounded-full bg-red-400 opacity-30 pulse-ring" />
              <div className="absolute w-16 h-16 rounded-full bg-red-400 opacity-20 pulse-ring-2" />
            </>
          )}
          <button
            onClick={handleMicToggle}
            disabled={!isSupported}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg transition-all active:scale-90 ${
              isListening
                ? 'bg-red-500 text-white mic-active'
                : 'bg-sehat-green text-white'
            } ${!isSupported ? 'opacity-50' : ''}`}
          >
            {isListening ? '⏹' : '🎤'}
          </button>
        </div>

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          disabled={!transcript.trim() || isAnalyzing}
          className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 ${
            transcript.trim() && !isAnalyzing
              ? 'bg-sehat-green text-white shadow-lg shadow-green-200'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              जांच हो रही है...
            </span>
          ) : '🔍 जांच करें'}
        </button>
      </div>
    </div>
  )
}
