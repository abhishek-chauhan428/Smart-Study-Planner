import { useCallback, useMemo, useState, useEffect } from 'react'
import { AuthContext } from './auth-context.js'
import { auth } from '../services/firebase.js'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [pending, setPending] = useState(false)
  const [authResolved, setAuthResolved] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setAuthResolved(true)
    })
    return () => unsubscribe()
  }, [])

  const login = useCallback(async (email, password) => {
    if (!email?.trim() || !password) throw new Error('INVALID')
    setPending(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } finally {
      setPending(false)
    }
  }, [])

  const signUp = useCallback(async (name, email, password) => {
    if (!email?.trim()) throw new Error('INVALID')
    if (!password || password.length < 6) throw new Error('WEAK')
    setPending(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password)
      if (name?.trim()) {
        await updateProfile(userCredential.user, { displayName: name.trim() })
        // Update local state to reflect displayName change immediately
        setUser({ ...userCredential.user, displayName: name.trim() })
      }
    } finally {
      setPending(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
  }, [])

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }, [])

  const resetPassword = useCallback(async (email) => {
    if (!email?.trim()) throw new Error('INVALID')
    await sendPasswordResetEmail(auth, email.trim())
  }, [])

  const value = useMemo(
    () => ({
      user,
      authResolved,
      pending,
      login,
      signUp,
      logout,
      loginWithGoogle,
      resetPassword,
      isAuthenticated: Boolean(user),
    }),
    [user, authResolved, pending, login, signUp, logout, loginWithGoogle, resetPassword],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
