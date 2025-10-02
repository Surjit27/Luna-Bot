import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { geminiService } from '../services/geminiService'
import { ragService } from '../services/ragService'
import { voiceService } from '../services/voiceService'

const InterviewContext = createContext()

const initialState = {
  currentSession: null,
  currentQuestion: null,
  userAnswer: '',
  isInterviewActive: false,
  timeRemaining: 0,
  questions: [],
  answers: [],
  dashboardData: null,
  voiceSettings: {
    enabled: false,
    language: 'en-US',
    rate: 1,
    pitch: 1,
    volume: 1
  },
  loading: false,
  error: null
}

function interviewReducer(state, action) {
  switch (action.type) {
    case 'START_INTERVIEW':
      return {
        ...state,
        isInterviewActive: true,
        currentSession: action.payload.session,
        currentQuestion: action.payload.question,
        timeRemaining: action.payload.question.timeLimit * 60,
        loading: false
      }
    
    case 'SET_QUESTION':
      return {
        ...state,
        currentQuestion: action.payload,
        timeRemaining: action.payload.timeLimit * 60,
        userAnswer: ''
      }
    
    case 'UPDATE_ANSWER':
      return {
        ...state,
        userAnswer: action.payload
      }
    
    case 'SUBMIT_ANSWER':
      return {
        ...state,
        answers: [...state.answers, action.payload],
        userAnswer: ''
      }
    
    case 'END_INTERVIEW':
      return {
        ...state,
        isInterviewActive: false,
        currentSession: null,
        currentQuestion: null,
        timeRemaining: 0
      }
    
    case 'SET_QUESTIONS':
      return {
        ...state,
        questions: action.payload
      }
    
    case 'SET_DASHBOARD_DATA':
      return {
        ...state,
        dashboardData: action.payload
      }
    
    case 'UPDATE_VOICE_SETTINGS':
      return {
        ...state,
        voiceSettings: { ...state.voiceSettings, ...action.payload }
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    
    case 'UPDATE_TIME':
      return {
        ...state,
        timeRemaining: action.payload
      }
    
    default:
      return state
  }
}

export function InterviewProvider({ children }) {
  const [state, dispatch] = useReducer(interviewReducer, initialState)

  // Load dashboard data on mount
  useEffect(() => {
    loadDashboardData()
  }, [])

  // Timer effect
  useEffect(() => {
    let interval = null
    if (state.isInterviewActive && state.timeRemaining > 0) {
      interval = setInterval(() => {
        dispatch({ type: 'UPDATE_TIME', payload: state.timeRemaining - 1 })
      }, 1000)
    } else if (state.timeRemaining === 0 && state.isInterviewActive) {
      // Auto-submit when time runs out
      handleSubmitAnswer()
    }
    return () => clearInterval(interval)
  }, [state.isInterviewActive, state.timeRemaining])

  const loadDashboardData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const data = await ragService.getDashboardData()
      dispatch({ type: 'SET_DASHBOARD_DATA', payload: data })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  const startInterview = async (questions, resumeData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const session = {
        id: Date.now().toString(),
        startTime: new Date(),
        questions,
        answers: [],
        status: 'active',
        candidateName: resumeData?.name || 'Unknown',
        position: resumeData?.position || 'Unknown'
      }
      
      dispatch({ type: 'SET_QUESTIONS', payload: questions })
      dispatch({ 
        type: 'START_INTERVIEW', 
        payload: { session, question: questions[0] } 
      })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  const updateAnswer = (answer) => {
    dispatch({ type: 'UPDATE_ANSWER', payload: answer })
  }

  const nextQuestion = () => {
    if (!state.currentSession || !state.currentSession.questions) {
      console.error('No session or questions available')
      return
    }
    
    const currentIndex = state.currentSession.questions.findIndex(q => q.id === state.currentQuestion.id)
    console.log('Current question index:', currentIndex, 'Total questions:', state.currentSession.questions.length)
    
    if (currentIndex < state.currentSession.questions.length - 1) {
      const nextQ = state.currentSession.questions[currentIndex + 1]
      console.log('Moving to next question:', nextQ.title)
      dispatch({ type: 'SET_QUESTION', payload: nextQ })
    } else {
      console.log('No more questions, ending interview')
      endInterview()
    }
  }

  const handleSubmitAnswer = async () => {
    try {
      const answer = {
        questionId: state.currentQuestion.id,
        answer: state.userAnswer,
        timeSpent: (state.currentQuestion.timeLimit * 60) - state.timeRemaining,
        submittedAt: new Date()
      }

      // Get feedback from Gemini
      const feedback = await geminiService.evaluateAnswer(
        state.currentQuestion, 
        state.userAnswer
      )
      
      answer.feedback = feedback.feedback
      answer.isCorrect = feedback.isCorrect

      dispatch({ type: 'SUBMIT_ANSWER', payload: answer })
      
      // Speak feedback if voice is enabled
      if (state.voiceSettings.enabled) {
        voiceService.speak(feedback.feedback)
      }
      
      nextQuestion()
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  const endInterview = () => {
    console.log('Ending interview...')
    dispatch({ type: 'END_INTERVIEW' })
    loadDashboardData()
    // Navigate to dashboard or show completion message
    if (window.location.pathname !== '/dashboard') {
      window.location.href = '/dashboard'
    }
  }

  const updateVoiceSettings = (settings) => {
    dispatch({ type: 'UPDATE_VOICE_SETTINGS', payload: settings })
    voiceService.updateSettings(settings)
  }

  const speakQuestion = () => {
    if (state.voiceSettings.enabled && state.currentQuestion) {
      voiceService.speak(state.currentQuestion.description)
    }
  }

  const value = {
    ...state,
    startInterview,
    nextQuestion,
    handleSubmitAnswer,
    updateAnswer,
    endInterview,
    updateVoiceSettings,
    speakQuestion,
    loadDashboardData
  }

  // Expose startInterview globally for App.jsx
  React.useEffect(() => {
    window.startInterviewFromContext = startInterview
    return () => {
      delete window.startInterviewFromContext
    }
  }, [startInterview])

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  )
}

export function useInterview() {
  const context = useContext(InterviewContext)
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider')
  }
  return context
}
