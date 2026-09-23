import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

const NotificationContext = createContext(null)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notice, setNotice] = useState(null)

  const showNotification = useCallback((message, tone = 'info') => {
    setNotice({ message, tone, id: Date.now() })
  }, [])

  const dismiss = useCallback(() => setNotice(null), [])

  const value = useMemo(() => ({ showNotification }), [showNotification])

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="notice-slot" aria-live="polite">
        {notice && (
          <div className={`notice notice-${notice.tone}`} role="status">
            <p>{notice.message}</p>
            <button type="button" onClick={dismiss} aria-label="Dismiss notification">
              Close
            </button>
          </div>
        )}
      </div>
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
