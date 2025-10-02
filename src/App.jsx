import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ResumeUpload from './components/ResumeUpload'
import InterviewInterface from './components/InterviewInterface'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import Navigation from './components/Navigation'
import { InterviewProvider } from './context/InterviewContext'

function App() {
  const [currentStep, setCurrentStep] = useState('upload')
  const [resumeData, setResumeData] = useState(null)
  const [interviewQuestions, setInterviewQuestions] = useState(null)

  const handleResumeAnalyzed = (data) => {
    setResumeData(data)
    setCurrentStep('interview')
  }

  const handleStartInterview = (questions, resume) => {
    setInterviewQuestions(questions)
    setResumeData(resume)
    setCurrentStep('interview')
    // Also trigger the context to start the interview
    if (window.startInterviewFromContext) {
      window.startInterviewFromContext(questions, resume)
    }
  }

  const handleInterviewComplete = () => {
    setCurrentStep('dashboard')
  }

  return (
    <div className="App">
      <InterviewProvider>
        <Router>
          <div className="interview-container">
            <Navigation />
            <Routes>
              <Route path="/" element={
                currentStep === 'upload' ? (
                  <ResumeUpload 
                    onResumeAnalyzed={handleResumeAnalyzed}
                    onStartInterview={handleStartInterview}
                  />
                ) : currentStep === 'interview' ? (
                  <InterviewInterface 
                    questions={interviewQuestions}
                    resumeData={resumeData}
                    onComplete={handleInterviewComplete}
                  />
                ) : (
                  <AnalyticsDashboard />
                )
              } />
              <Route path="/dashboard" element={<AnalyticsDashboard />} />
            </Routes>
          </div>
        </Router>
      </InterviewProvider>
    </div>
  )
}

export default App
