import React, { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader, Button, Alert, Progress, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap'
import { useInterview } from '../context/InterviewContext'
import { voiceService } from '../services/voiceService'
import { dsaCompilerService } from '../services/dsaCompilerService'
import { evaluationService } from '../services/evaluationService'

function InterviewInterface() {
  const {
    currentQuestion,
    userAnswer,
    timeRemaining,
    isInterviewActive,
    loading,
    error,
    startInterview,
    handleSubmitAnswer,
    updateAnswer,
    speakQuestion,
    voiceSettings,
    updateVoiceSettings,
    nextQuestion,
    endInterview
  } = useInterview()

  // Debug logging
  React.useEffect(() => {
    console.log('InterviewInterface - Current State:', {
      isInterviewActive,
      currentQuestion: currentQuestion?.title,
      hasQuestions: !!currentQuestion,
      loading,
      error,
      questionId: currentQuestion?.id,
      category: currentQuestion?.category
    })
  }, [isInterviewActive, currentQuestion, loading, error])

  const [showVoiceSettings, setShowVoiceSettings] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [testResults, setTestResults] = useState(null)
  const [runningTests, setRunningTests] = useState(false)

  useEffect(() => {
    // Set up voice command handlers
    voiceService.setCommandHandler((command) => {
      switch (command) {
        case 'start':
          // Start interview logic
          break
        case 'next':
          // Next question logic
          break
        case 'submit':
          handleSubmitAnswer()
          break
        case 'speak':
          speakQuestion()
          break
      }
    })

    voiceService.setTextHandler((text) => {
      updateAnswer(text)
    })

    return () => {
      voiceService.setCommandHandler(null)
      voiceService.setTextHandler(null)
    }
  }, [handleSubmitAnswer, speakQuestion, updateAnswer])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (e) => {
    const value = e.target.value
    console.log('Answer changed:', value.length, 'characters')
    updateAnswer(value)
  }

  const runTests = async () => {
    if (!userAnswer.trim()) {
      alert('Please write some code first!')
      return
    }

    // Only run tests for DSA questions
    if (currentQuestion.category === 'hr' || currentQuestion.category === 'technical') {
      alert('Test cases are only available for DSA questions. HR and Technical questions are evaluated by AI.')
      return
    }

    setRunningTests(true)
    try {
      console.log('Running tests for question:', currentQuestion.title)
      const results = await dsaCompilerService.runTestCases(userAnswer, currentQuestion.testCases, 'javascript')
      setTestResults(results)
      console.log('Test results:', results)
    } catch (error) {
      console.error('Error running tests:', error)
      setTestResults({
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        passRate: 0,
        results: [],
        error: error.message
      })
    } finally {
      setRunningTests(false)
    }
  }

  const startListening = () => {
    setIsListening(true)
    voiceService.startListening()
  }

  const stopListening = () => {
    setIsListening(false)
    voiceService.stopListening()
  }

  if (!isInterviewActive) {
    return (
      <div className="container-fluid p-0">
        <div className="row justify-content-center min-vh-100">
          <div className="col-12 col-lg-10 col-xl-8 p-4">
            <Card className="shadow">
              <CardHeader className="bg-success text-white">
                <h4 className="mb-0">🎯 Ready to Start Interview</h4>
              </CardHeader>
              <CardBody>
                <p className="lead">No active interview session. Please upload a resume first to generate personalized questions.</p>
                <div className="d-flex gap-2">
                  <Button 
                    color="primary" 
                    size="lg" 
                    onClick={() => window.location.href = '/'}
                    className="flex-fill"
                  >
                    Go to Resume Upload
                  </Button>
                  <Button 
                    color="warning" 
                    size="lg" 
                    onClick={() => {
                      console.log('Manual start interview clicked')
                      // Try to start with mock questions if available
                      const mockQuestions = [
                        {
                          id: 'mock_1',
                          title: 'Array Manipulation',
                          description: 'Write a function to find the two numbers in an array that add up to a target sum.',
                          difficulty: 'medium',
                          category: 'dsa',
                          timeLimit: 30
                        }
                      ]
                      startInterview(mockQuestions, { name: 'Test Candidate', position: 'Developer' })
                    }}
                    className="flex-fill"
                  >
                    Start Test Interview
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid p-0">
      <div className="row min-vh-100">
        <div className="col-12 col-lg-8 p-4">
          {/* Question Card */}
          <Card className="question-card mb-4">
            <CardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{currentQuestion?.title}</h5>
              <div className="d-flex align-items-center gap-3">
                <span className={`badge ${currentQuestion?.category === 'hr' ? 'bg-success' : currentQuestion?.category === 'technical' ? 'bg-warning' : 'bg-info'}`}>
                  {currentQuestion?.category === 'hr' ? 'HR' : currentQuestion?.category === 'technical' ? 'Technical' : 'DSA'}
                </span>
                <span className="badge bg-light text-dark">
                  {currentQuestion?.difficulty?.toUpperCase()}
                </span>
                <span className="badge bg-warning text-dark">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </CardHeader>
            <CardBody>
              <div className="mb-3">
                <h6>Question:</h6>
                <p className="lead">{currentQuestion?.description}</p>
              </div>

              {currentQuestion?.testCases && (
                <div className="mb-3">
                  <h6>Test Cases:</h6>
                  {currentQuestion.testCases.map((testCase, index) => (
                    <div key={index} className="bg-light p-2 rounded mb-2">
                      <strong>Input:</strong> {testCase.input}<br/>
                      <strong>Expected Output:</strong> {testCase.expectedOutput}
                    </div>
                  ))}
                </div>
              )}

              {/* Voice Controls */}
              <div className="voice-controls mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Button 
                      color="info" 
                      size="sm" 
                      onClick={speakQuestion}
                      disabled={!voiceSettings.enabled}
                    >
                      🔊 Speak Question
                    </Button>
                    <Button 
                      color="secondary" 
                      size="sm" 
                      onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                      className="ms-2"
                    >
                      ⚙️ Voice Settings
                    </Button>
                  </div>
                  <div>
                    {isListening ? (
                      <Button color="danger" size="sm" onClick={stopListening}>
                        🛑 Stop Listening
                      </Button>
                    ) : (
                      <Button 
                        color="success" 
                        size="sm" 
                        onClick={startListening}
                        disabled={!voiceSettings.enabled}
                      >
                        🎤 Start Voice Input
                      </Button>
                    )}
                  </div>
                </div>

                {showVoiceSettings && (
                  <div className="mt-3 p-3 bg-dark rounded">
                    <Form>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label check>
                              <Input 
                                type="checkbox" 
                                checked={voiceSettings.enabled}
                                onChange={(e) => updateVoiceSettings({ enabled: e.target.checked })}
                              />
                              {' '}Enable Voice
                            </Label>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label>Speech Rate</Label>
                            <Input 
                              type="range" 
                              min="0.5" 
                              max="2" 
                              step="0.1"
                              value={voiceSettings.rate}
                              onChange={(e) => updateVoiceSettings({ rate: parseFloat(e.target.value) })}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Answer Section */}
          <Card className="notepad-container">
            <CardHeader>
              <h5>Your Answer</h5>
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label for="answer">Write your solution here:</Label>
                <Input
                  type="textarea"
                  id="answer"
                  rows="15"
                  value={userAnswer}
                  onChange={handleAnswerChange}
                  placeholder="Write your code, algorithm, or explanation here..."
                  className="code-editor"
                  style={{
                    fontFamily: 'Courier New, monospace',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    resize: 'vertical'
                  }}
                />
                <small className="text-muted">
                  Characters: {userAnswer.length} | You can type your answer here
                </small>
              </FormGroup>

              {error && <Alert color="danger">{error}</Alert>}

              {/* Test Results */}
              {testResults && (
                <Card className="mt-3">
                  <CardHeader>
                    <h6 className="mb-0">🧪 Test Results</h6>
                  </CardHeader>
                  <CardBody>
                    <div className="row">
                      <div className="col-md-3">
                        <div className="text-center">
                          <h4 className={testResults.passRate >= 80 ? 'text-success' : testResults.passRate >= 50 ? 'text-warning' : 'text-danger'}>
                            {testResults.passRate}%
                          </h4>
                          <small>Pass Rate</small>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text-center">
                          <h4 className="text-success">{testResults.passedTests}</h4>
                          <small>Passed</small>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text-center">
                          <h4 className="text-danger">{testResults.failedTests}</h4>
                          <small>Failed</small>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text-center">
                          <h4 className="text-info">{testResults.totalTests}</h4>
                          <small>Total</small>
                        </div>
                      </div>
                    </div>
                    
                    {testResults.results && testResults.results.length > 0 && (
                      <div className="mt-3">
                        <h6>Test Case Details:</h6>
                        {testResults.results.map((result, index) => (
                          <div key={index} className={`p-2 mb-2 rounded ${result.passed ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}>
                            <div className="d-flex justify-content-between">
                              <span><strong>Test {result.testCase}:</strong> {result.passed ? '✅ PASSED' : '❌ FAILED'}</span>
                              <small>{result.executionTime}ms</small>
                            </div>
                            {result.error && (
                              <small className="text-danger">Error: {result.error}</small>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>
              )}

              <div className="d-flex justify-content-between mt-3">
                <div className="d-flex gap-2">
                  <Button 
                    color="success" 
                    size="lg" 
                    onClick={handleSubmitAnswer}
                    disabled={loading || !userAnswer.trim()}
                  >
                    {loading ? 'Submitting...' : 'Submit Answer'}
                  </Button>
                  
                  {currentQuestion.category !== 'hr' && currentQuestion.category !== 'technical' && (
                    <Button 
                      color="info" 
                      size="lg" 
                      onClick={runTests}
                      disabled={loading || runningTests || !userAnswer.trim()}
                    >
                      {runningTests ? '🔄 Running Tests...' : '🧪 Run Tests'}
                    </Button>
                  )}
                  
                  <Button 
                    color="primary" 
                    size="lg" 
                    onClick={() => {
                      console.log('Next Question clicked')
                      console.log('Current question:', currentQuestion)
                      nextQuestion()
                    }}
                    disabled={loading}
                  >
                    ➡️ Next Question
                  </Button>
                  
                  <Button 
                    color="danger" 
                    size="lg" 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to end the interview?')) {
                        endInterview()
                      }
                    }}
                  >
                    🏁 End Interview
                  </Button>
                </div>
                
                <div className="d-flex gap-2">
                  <Button color="info" onClick={speakQuestion}>
                    🔊 Speak Question
                  </Button>
                  <Button color="warning">
                    💡 Get Hint
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-12 col-lg-4 p-4">
          {/* Timer */}
          <Card className="mb-4">
            <CardBody className="text-center">
              <h4>Time Remaining</h4>
              <div className="display-4 text-primary">
                {formatTime(timeRemaining)}
              </div>
              <Progress 
                value={((currentQuestion?.timeLimit * 60 - timeRemaining) / (currentQuestion?.timeLimit * 60)) * 100}
                color="warning"
                className="mt-3"
              />
            </CardBody>
          </Card>

          {/* Question Info */}
          <Card className="mb-4">
            <CardBody>
              <h6>Question Details</h6>
              <ul className="list-unstyled">
                <li><strong>Category:</strong> {currentQuestion?.category}</li>
                <li><strong>Difficulty:</strong> {currentQuestion?.difficulty}</li>
                <li><strong>Time Limit:</strong> {currentQuestion?.timeLimit} minutes</li>
                <li><strong>Expected Skills:</strong> {currentQuestion?.expectedSkills?.join(', ')}</li>
              </ul>
            </CardBody>
          </Card>

          {/* Voice Status */}
          {voiceSettings.enabled && (
            <Card>
              <CardBody>
                <h6>Voice Status</h6>
                <div className="d-flex align-items-center">
                  <div className={`me-2 ${isListening ? 'text-success' : 'text-muted'}`}>
                    {isListening ? '🔴 Listening' : '⚪ Not Listening'}
                  </div>
                </div>
                <small className="text-muted">
                  Say "submit answer", "next question", or speak your answer
                </small>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default InterviewInterface
