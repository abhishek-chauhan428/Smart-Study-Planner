import { useContext } from 'react'
import { SessionContext } from '../context/session-context.js'

export function useSessions() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSessions must be used within a SessionProvider')
  }
  return context
}
