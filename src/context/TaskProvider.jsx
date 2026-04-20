import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { TaskContext } from './task-context.js'
import { db } from '../services/firebase.js'
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'

export function TaskProvider({ children }) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (!user) {
      setTasks([])
      return
    }

    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedTasks = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }))
      setTasks(loadedTasks)
    }, (error) => {
      console.error("Error fetching tasks:", error)
    })

    return () => unsubscribe()
  }, [user])

  const addTask = useCallback(
    async ({ title, subject, deadline, estimatedMinutes }) => {
      if (!user) return
      try {
        await addDoc(collection(db, 'tasks'), {
          userId: user.uid,
          title: title.trim(),
          subject: (subject || '').trim(),
          deadline,
          estimatedMinutes: Math.max(0, Number(estimatedMinutes) || 0),
          status: 'pending',
          createdAt: new Date().toISOString(),
        })
      } catch (error) {
        console.error("Error adding task:", error)
      }
    },
    [user],
  )

  const updateTask = useCallback(
    async (id, patch) => {
      if (!user) return
      try {
        const taskRef = doc(db, 'tasks', id)
        await updateDoc(taskRef, patch)
      } catch (error) {
        console.error("Error updating task:", error)
      }
    },
    [user],
  )

  const deleteTask = useCallback(
    async (id) => {
      if (!user) return
      try {
        const taskRef = doc(db, 'tasks', id)
        await deleteDoc(taskRef)
      } catch (error) {
        console.error("Error deleting task:", error)
      }
    },
    [user],
  )

  const toggleComplete = useCallback(
    async (id) => {
      if (!user) return
      const task = tasks.find(t => t.id === id)
      if (!task) return
      try {
        const taskRef = doc(db, 'tasks', id)
        await updateDoc(taskRef, {
          status: task.status === 'completed' ? 'pending' : 'completed'
        })
      } catch (error) {
        console.error("Error toggling task completion:", error)
      }
    },
    [user, tasks],
  )

  const value = useMemo(
    () => ({
      tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
    }),
    [tasks, addTask, updateTask, deleteTask, toggleComplete],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
