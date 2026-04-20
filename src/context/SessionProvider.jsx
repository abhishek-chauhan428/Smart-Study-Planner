import { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { SessionContext } from './session-context.js'
import { useAuth } from '../hooks/useAuth.js'
import { db } from '../services/firebase.js'
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore'

function generateSlots(totalSessionMins, slotMins, breakMins) {
  let remainingSecs = totalSessionMins * 60
  const slots = []
  let studyNo = 1
  let breakNo = 1

  while (remainingSecs > 0) {
    const studyTime = Math.min(remainingSecs, slotMins * 60)
    slots.push({ type: 'study', duration: studyTime, index: studyNo })
    remainingSecs -= studyTime

    if (remainingSecs <= 0) break

    const breakTime = Math.min(remainingSecs, breakMins * 60)
    slots.push({ type: 'break', duration: breakTime, index: breakNo })
    remainingSecs -= breakTime

    if (remainingSecs <= 0) break

    studyNo++
    breakNo++
  }

  const totalStudySlots = slots.filter((s) => s.type === 'study').length
  const totalBreakSlots = slots.filter((s) => s.type === 'break').length

  return { slots, totalStudySlots, totalBreakSlots }
}

export function SessionProvider({ children }) {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    if (!user) {
      setSessions([])
      return
    }

    const q = query(collection(db, 'sessions'), where('userId', '==', user.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedSessions = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }))
      setSessions(loadedSessions)
    }, (error) => {
      console.error("Error fetching sessions:", error)
    })

    return () => unsubscribe()
  }, [user])

  // Configuration State
  const [totalSession, setTotalSession] = useState(50)
  const [slotDuration, setSlotDuration] = useState(20)
  const [breakDuration, setBreakDuration] = useState(5)

  const loadState = (key, defaultVal) => {
    try {
      const val = localStorage.getItem(`smart-study-${key}`)
      return val !== null ? JSON.parse(val) : defaultVal
    } catch {
      return defaultVal
    }
  }

  // Timer State: 'setup', 'running', 'paused', 'rating', 'done'
  const [phase, setPhase] = useState(() => loadState('phase', 'setup'))
  const [slots, setSlots] = useState(() => loadState('slots', []))
  const [currentSlotIdx, setCurrentSlotIdx] = useState(() => loadState('currentSlotIdx', 0))
  const [timeRemaining, setTimeRemaining] = useState(() => loadState('timeRemaining', 0))
  const [totalStudySlots, setTotalStudySlots] = useState(() => loadState('totalStudySlots', 0))
  const [totalBreakSlots, setTotalBreakSlots] = useState(() => loadState('totalBreakSlots', 0))
  const [endTime, setEndTime] = useState(() => loadState('endTime', null))
  const [selectedTask, setSelectedTask] = useState(() => loadState('selectedTask', ''))
  const [customTaskName, setCustomTaskName] = useState(() => loadState('customTaskName', ''))

  // Persist state
  useEffect(() => {
    localStorage.setItem('smart-study-phase', JSON.stringify(phase))
    localStorage.setItem('smart-study-slots', JSON.stringify(slots))
    localStorage.setItem('smart-study-currentSlotIdx', JSON.stringify(currentSlotIdx))
    localStorage.setItem('smart-study-timeRemaining', JSON.stringify(timeRemaining))
    localStorage.setItem('smart-study-totalStudySlots', JSON.stringify(totalStudySlots))
    localStorage.setItem('smart-study-totalBreakSlots', JSON.stringify(totalBreakSlots))
    localStorage.setItem('smart-study-endTime', JSON.stringify(endTime))
    localStorage.setItem('smart-study-selectedTask', JSON.stringify(selectedTask))
    localStorage.setItem('smart-study-customTaskName', JSON.stringify(customTaskName))
  }, [phase, slots, currentSlotIdx, timeRemaining, totalStudySlots, totalBreakSlots, endTime, selectedTask, customTaskName])

  const timerRef = useRef(null)

  const addSession = useCallback(async (sessionData) => {
    if (!user) return
    try {
      await addDoc(collection(db, 'sessions'), {
        ...sessionData,
        userId: user.uid,
        date: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error saving session:", error)
    }
  }, [user])

  const deleteSession = useCallback(async (id) => {
    if (!user) return
    try {
      const sessionRef = doc(db, 'sessions', id)
      await deleteDoc(sessionRef)
    } catch (error) {
      console.error("Error deleting session:", error)
    }
  }, [user])

  const handleSlotFinish = useCallback(() => {
    clearInterval(timerRef.current)
    if (currentSlotIdx + 1 < slots.length) {
      const nextIdx = currentSlotIdx + 1
      setCurrentSlotIdx(nextIdx)
      setTimeRemaining(slots[nextIdx].duration)
      setEndTime(Date.now() + slots[nextIdx].duration * 1000)
    } else {
      setPhase('rating')
      setEndTime(null)
    }
  }, [currentSlotIdx, slots])

  // Timer loop
  useEffect(() => {
    if (phase === 'running' && endTime) {
      // Execute immediately on mount to catch up missed time
      const checkTime = () => {
        const remaining = Math.round((endTime - Date.now()) / 1000)
        if (remaining <= 0) {
          setTimeRemaining(0)
          handleSlotFinish()
        } else {
          setTimeRemaining(remaining)
        }
      }
      checkTime()
      timerRef.current = setInterval(checkTime, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [phase, endTime, handleSlotFinish])

  const startSession = useCallback(() => {
    if (phase === 'setup') {
      const { slots: generated, totalStudySlots: tss, totalBreakSlots: tbs } = generateSlots(
        Number(totalSession),
        Number(slotDuration),
        Number(breakDuration)
      )
      
      if (generated.length === 0) return

      setSlots(generated)
      setTotalStudySlots(tss)
      setTotalBreakSlots(tbs)
      setCurrentSlotIdx(0)
      setTimeRemaining(generated[0].duration)
      setEndTime(Date.now() + generated[0].duration * 1000)
    } else if (phase === 'paused') {
      setEndTime(Date.now() + timeRemaining * 1000)
    }
    setPhase('running')
  }, [phase, totalSession, slotDuration, breakDuration, timeRemaining])

  const pauseSession = useCallback(() => {
    setPhase('paused')
    setEndTime(null)
  }, [])

  const stopSession = useCallback(() => {
    clearInterval(timerRef.current)
    setPhase('rating')
    setEndTime(null)
  }, [])

  const resetSession = useCallback(() => {
    setPhase('setup')
    setSlots([])
    setCurrentSlotIdx(0)
    setTimeRemaining(0)
    setEndTime(null)
    setSelectedTask('')
    setCustomTaskName('')
    
    // Clear localStorage to ensure fresh start
    const keys = ['phase', 'slots', 'currentSlotIdx', 'timeRemaining', 'totalStudySlots', 'totalBreakSlots', 'endTime', 'selectedTask', 'customTaskName']
    keys.forEach(k => localStorage.removeItem(`smart-study-${k}`))
  }, [])

  const getActiveStudySeconds = useCallback(() => {
    if (phase === 'setup' || slots.length === 0) return 0;
    let actualStudySeconds = 0
    for (let i = 0; i < currentSlotIdx; i++) {
      if (slots[i].type === 'study') {
        actualStudySeconds += slots[i].duration
      }
    }
    if (slots[currentSlotIdx] && slots[currentSlotIdx].type === 'study') {
       actualStudySeconds += (slots[currentSlotIdx].duration - timeRemaining)
    }
    return actualStudySeconds
  }, [phase, slots, currentSlotIdx, timeRemaining])

  const saveCurrentSession = useCallback((focusRating) => {
    const actualStudySeconds = getActiveStudySeconds()
    addSession({
      taskId: selectedTask === 'custom' ? null : (selectedTask || null),
      customTaskTitle: selectedTask === 'custom' ? customTaskName : null,
      durationMinutes: Math.round(actualStudySeconds / 60),
      focusRating: focusRating,
    })
    resetSession()
  }, [addSession, selectedTask, customTaskName, getActiveStudySeconds, resetSession])

  const value = useMemo(
    () => ({
      sessions,
      addSession,
      deleteSession,
      
      // Config State
      totalSession, setTotalSession,
      slotDuration, setSlotDuration,
      breakDuration, setBreakDuration,
      selectedTask, setSelectedTask,
      customTaskName, setCustomTaskName,

      // Timer State
      phase,
      slots,
      currentSlotIdx,
      timeRemaining,
      totalStudySlots,
      totalBreakSlots,
      
      // Actions
      startSession,
      pauseSession,
      stopSession,
      resetSession,
      saveCurrentSession,
      getActiveStudySeconds
    }),
    [
      sessions, addSession, deleteSession,
      totalSession, slotDuration, breakDuration, selectedTask, customTaskName,
      phase, slots, currentSlotIdx, timeRemaining, totalStudySlots, totalBreakSlots,
      startSession, pauseSession, stopSession, resetSession, saveCurrentSession, getActiveStudySeconds
    ]
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
