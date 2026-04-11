import { useState, useEffect } from 'react'
import { syncCases } from '../pages/utils/sync.js'
 
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
 
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true)
      // Auto-sync when coming back online
      try {
        await syncCases()
      } catch (e) {
        console.warn('Auto-sync failed:', e)
      }
    }
    const handleOffline = () => setIsOnline(false)
 
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
 
  return isOnline
}
 