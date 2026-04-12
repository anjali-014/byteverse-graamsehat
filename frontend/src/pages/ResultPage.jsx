import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getSymptomLabel } from '../ml/triageEngine.js'
import { PHC_DATA, AMBULANCE_NUMBER } from './utils/phcData.js'
import { getCurrentUser, logoutUser } from "./utils/auth.js";

 const getConfidenceLabel = (conf) => {
  if (conf >= 90) return { label: 'बहुत पक्का', color: 'green' }
  if (conf >= 70) return { label: 'पक्का', color: 'yellow' }
  return { label: 'अनुमान', color: 'orange' }
 }

const LEVEL_CONFIG = {
  RED: {
    bg: 'bg-red-600',
    lightBg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    badge: 'bg-red-100 text-red-700',
    emoji: '🔴',
    hindi: 'आपातकाल',
    subtext: 'तुरंत PHC ले जाएं',
    icon: '🚨',
    gradient: 'from-red-600 to-red-700',
    glow: 'shadow-red-200'
  },
  YELLOW: {
    bg: 'bg-yellow-500',
    lightBg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    badge: 'bg-yellow-100 text-yellow-700',
    emoji: '🟡',
    hindi: 'ध्यान दें',
    subtext: '24-48 घंटे में डॉक्टर को दिखाएं',
    icon: '⚠️',
    gradient: 'from-yellow-500 to-yellow-600',
    glow: 'shadow-yellow-200'
  },
  GREEN: {
    bg: 'bg-green-500',
    lightBg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-700',
    emoji: '🟢',
    hindi: 'ठीक है',
    subtext: 'घर पर देखभाल करें',
    icon: '✅',
    gradient: 'from-green-500 to-green-600',
    glow: 'shadow-green-200'
  }
}

// Visual cards for showing family — icon only, no text dependency
const VISUAL_CARDS = {
  RED: [
    { icon: '🚗', desc: 'गाड़ी लाओ' },
    { icon: '🏥', desc: 'PHC जाओ' },
    { icon: '📞', desc: '108 कॉल' },
    { icon: '⚡', desc: 'अभी जाओ' }
  ],
  YELLOW: [
    { icon: '💊', desc: 'दवा दो' },
    { icon: '💧', desc: 'पानी पिलाओ' },
    { icon: '🛏️', desc: 'आराम करो' },
    { icon: '👁️', desc: 'नज़र रखो' }
  ],
  GREEN: [
    { icon: '🏠', desc: 'घर रहो' },
    { icon: '💧', desc: 'पानी पिलाओ' },
    { icon: '🍲', desc: 'हल्का खाना' },
    { icon: '😴', desc: 'आराम करो' }
  ]
}

export default function ResultPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showFamilyCard, setShowFamilyCard] = useState(false)
  const [flashActive, setFlashActive] = useState(false)

  const { result, inputText, isDemo } = location.state || {}

  useEffect(() => {
    if (!result) navigate('/')
    if (result?.level === 'RED') {
      setFlashActive(true)
      setTimeout(() => setFlashActive(false), 3000)
    }
    // Auto-show family card for RED cases
    if (result?.level === 'RED') {
      setTimeout(() => setShowFamilyCard(true), 1500)
    }
  }, [result])

  if (!result) return null

  const config = LEVEL_CONFIG[result.level]
  const nearestPHC = PHC_DATA[0]
  const visualCards = VISUAL_CARDS[result.level]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Result Hero */}
      <div className={`bg-gradient-to-b ${config.gradient} px-5 pt-10 pb-8 text-white ${flashActive && result.level === 'RED' ? 'emergency-flash' : ''}`}>
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/triage')}
            className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"
          >
            ‹
          </button>
          <span className="text-sm opacity-80">जांच का नतीजा</span>
          {isDemo && (
            <span className="ml-auto bg-white/20 rounded-lg px-2.5 py-1 text-xs font-semibold">
              🎬 DEMO
            </span>
          )}
        </div>

        {/* Level display */}
        <div className="text-center">
          <div className="text-7xl mb-3 animate-bounce-once">
            {config.icon}
          </div>
          <div className="text-5xl font-black tracking-tight mb-1">
            {config.emoji} {config.hindi}
          </div>
          <div className="text-white/80 text-lg mt-2">{config.subtext}</div>

          
          {/* Confidence */}
          <div className="mt-4 flex justify-center gap-3">
            <div className="bg-white/15 rounded-xl px-4 py-2 text-sm">
              🎯 {result.confidence}% सटीकता
            </div>
            {result.diseaseHint && (
              <div className="bg-white/15 rounded-xl px-4 py-2 text-sm">
                🩺 {result.diseaseHint}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pt-5 pb-32 space-y-4">

        {/* Symptoms detected */}
        {result.detectedSymptoms?.length > 0 && (
          <div className={`rounded-2xl border ${config.border} ${config.lightBg} p-4`}>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">पाए गए लक्षण</p>
            <div className="flex flex-wrap gap-2">
              {result.detectedSymptoms.map(s => (
                <span key={s} className={`rounded-full px-3 py-1.5 text-sm font-medium ${config.badge}`}>
                  {getSymptomLabel(s)}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">📝 बोले गए: "{inputText}"</p>
          </div>
        )}

        {/* Action steps */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">अभी क्या करें</p>
          <div className="space-y-2.5">
            {result.advice?.steps?.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full ${config.bg} text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5`}>
                  {i + 1}
                </div>
                <span className="text-gray-700 text-base leading-snug">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nearest PHC */}
        {(result.level === 'RED' || result.level === 'YELLOW') && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">🏥 नज़दीकी PHC</p>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-gray-800">{nearestPHC.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{nearestPHC.address}</p>
                <p className="text-xs text-green-600 mt-1">⏰ {nearestPHC.hours}</p>
              </div>
              <a
                href={`tel:${nearestPHC.phone}`}
                className="bg-green-100 text-green-700 rounded-xl px-4 py-2 text-sm font-semibold flex-shrink-0"
              >
                📞 कॉल
              </a>
            </div>
          </div>
        )}

        {/* Family visual card toggle */}
        <button
          onClick={() => setShowFamilyCard(!showFamilyCard)}
          className={`w-full rounded-2xl p-4 flex items-center gap-3 transition-all ${
            showFamilyCard ? `${config.lightBg} border-2 ${config.border}` : 'bg-white border border-gray-100'
          }`}
        >
          <span className="text-2xl">👨‍👩‍👧</span>
          <div className="text-left">
            <p className="font-bold text-gray-800">परिवार को दिखाएं</p>
            <p className="text-xs text-gray-500">चित्र कार्ड — पढ़ना ज़रूरी नहीं</p>
          </div>
          <span className="ml-auto text-xl">{showFamilyCard ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Family Visual Card Overlay */}
      {showFamilyCard && (
        <FamilyCard
          level={result.level}
          config={config}
          visualCards={visualCards}
          onClose={() => setShowFamilyCard(false)}
          phc={nearestPHC}
        />
      )}

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 flex gap-3">
        {result.level === 'RED' && (
          <a
            href={`tel:${AMBULANCE_NUMBER}`}
            className="flex-1 bg-red-600 text-white rounded-2xl py-4 text-center font-bold text-lg shadow-lg shadow-red-200"
          >
            🚨 108 एम्बुलेंस
          </a>
        )}
        <button
          onClick={() => navigate('/triage')}
          className={`${result.level === 'RED' ? 'w-14' : 'flex-1'} bg-sehat-green text-white rounded-2xl py-4 text-center font-bold text-lg shadow-lg shadow-green-200`}
        >
          {result.level === 'RED' ? '↩' : '+ नया केस'}
        </button>
      </div>
    </div>
  )
}

function FamilyCard({ level, config, visualCards, onClose, phc }) {
  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-end"
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-t-3xl p-6 slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`rounded-2xl ${config.bg} text-white text-center py-5 mb-5`}>
          <div className="text-6xl mb-2">
            {level === 'RED' ? '🚨' : level === 'YELLOW' ? '⚠️' : '✅'}
          </div>
          <div className="text-3xl font-black">
            {level === 'RED' ? 'तुरंत जाएं!' : level === 'YELLOW' ? 'ध्यान दें' : 'ठीक है'}
          </div>
          {level === 'RED' && (
            <div className="text-white/80 text-lg mt-1">{phc.name}</div>
          )}
        </div>

        {/* Icon grid - no text required */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {visualCards.map((card, i) => (
            <div key={i} className={`rounded-2xl ${config.lightBg} border ${config.border} p-4 flex flex-col items-center gap-2`}>
              <span className="text-5xl">{card.icon}</span>
              <span className="text-xs text-center text-gray-600 font-medium">{card.desc}</span>
            </div>
          ))}
        </div>

        {/* Ambulance number big display */}
        {level === 'RED' && (
          <a
            href="tel:108"
            className="w-full bg-red-600 text-white rounded-2xl py-5 flex items-center justify-center gap-3 mb-3 shadow-lg"
          >
            <span className="text-4xl">📞</span>
            <div className="text-center">
              <div className="text-4xl font-black">108</div>
              <div className="text-red-200 text-sm">एम्बुलेंस</div>
            </div>
          </a>
        )}

        <button
          onClick={onClose}
          className="w-full bg-gray-100 text-gray-600 rounded-2xl py-3.5 font-semibold text-base"
        >
          बंद करें
        </button>
      </div>
    </div>
  )
}
 
