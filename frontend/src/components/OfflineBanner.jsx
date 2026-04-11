import React from 'react'

export default function OfflineBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white text-center py-2 px-4 text-sm flex items-center justify-center gap-2">
      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
      इंटरनेट नहीं — ऑफलाइन मोड में काम हो रहा है
    </div>
  )
}
