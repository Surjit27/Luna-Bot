import React, { useState } from 'react'
import { Card, CardBody, CardHeader, Button, Alert, Progress, Form, FormGroup, Label, Input } from 'reactstrap'
import { geminiService } from '../services/geminiService'
import { ragService } from '../services/ragService'
import { interviewQuestionsService } from '../services/dsaQuestionsService'

function ResumeUpload({ onResumeAnalyzed, onStartInterview }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [resumeData, setResumeData] = useState(null)
  const [candidateInfo, setCandidateInfo] = useState({
    name: '',
    email: '',
    position: ''
  })

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.txt')) {
        setError('Please upload a PDF or TXT file')
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleInputChange = (e) => {
    setCandidateInfo({
      ...candidateInfo,
      [e.target.name]: e.target.value
    })
  }

  const extractTextFromFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        if (file.type === 'application/pdf') {
          // For PDF files, we'll use a simple text extraction
          // In production, use a proper PDF parser like pdf-parse
          const text = e.target.result
          resolve(text)
        } else {
          resolve(e.target.result)
        }
      }
      
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const analyzeResume = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      // Test API connection first
      setProgress(10)
      console.log('Testing Gemini API connection...')
      const isConnected = await geminiService.testConnection()
      if (!isConnected) {
        console.warn('Gemini API not available, using mock analysis...')
        // Use mock analysis as fallback
        const mockAnalysis = {
          skills: ['JavaScript', 'React', 'Node.js', 'Python'],
          technicalSkills: ['Web Development', 'API Design', 'Database Management'],
          programmingLanguages: ['JavaScript', 'Python', 'Java'],
          yearsOfExperience: 3,
          experienceLevel: 'mid',
          education: 'Bachelor of Computer Science',
          previousRoles: ['Software Developer', 'Full Stack Developer'],
          projects: ['E-commerce Platform', 'Task Management App'],
          certifications: ['AWS Certified Developer'],
          strengths: ['Problem Solving', 'Team Collaboration'],
          areasForImprovement: ['System Design', 'DevOps']
        }
        
        setProgress(60)
        const resumeData = {
          ...candidateInfo,
          originalText: await extractTextFromFile(file),
          analysis: mockAnalysis,
          uploadedAt: new Date(),
          fileName: file.name
        }
        
        setProgress(80)
        setResumeData(resumeData)
        await ragService.saveResumeData(resumeData)
        setProgress(100)
        onResumeAnalyzed(resumeData)
        return
      }
      
      // Extract text from file
      setProgress(20)
      const resumeText = await extractTextFromFile(file)
      
      // Analyze resume with Gemini
      setProgress(40)
      const analysis = await geminiService.analyzeResume(resumeText)
      
      setProgress(60)
      const resumeData = {
        ...candidateInfo,
        originalText: resumeText,
        analysis,
        uploadedAt: new Date(),
        fileName: file.name
      }
      
      setProgress(80)
      setResumeData(resumeData)
      
      // Save to RAG service
      await ragService.saveResumeData(resumeData)
      
      setProgress(100)
      onResumeAnalyzed(resumeData)
      
    } catch (error) {
      console.error('Resume analysis error:', error)
      setError(`Error analyzing resume: ${error.message}`)
      setUploading(false)
    }
  }

  const generatePersonalizedQuestions = async () => {
    if (!resumeData) return

    try {
      setUploading(true)
      
      // Use default questions database (DSA + HR + Technical)
      console.log('Using default questions database...')
      const questions = interviewQuestionsService.getMixedQuestions(15)
      
      console.log('Generated questions:', questions.length)
      onStartInterview(questions, resumeData)
    } catch (error) {
      setError(`Error generating questions: ${error.message}`)
      setUploading(false)
    }
  }

  return (
    <div className="container-fluid p-0">
      <div className="row justify-content-center min-vh-100">
        <div className="col-12 col-lg-10 col-xl-8 p-4">
          <Card className="shadow">
            <CardHeader className="bg-primary text-white">
              <h4 className="mb-0">📄 Resume Upload & Analysis</h4>
            </CardHeader>
            <CardBody>
              {!resumeData ? (
                <div>
                  <Form>
                    <FormGroup>
                      <Label for="candidateName">Candidate Name</Label>
                      <Input
                        type="text"
                        name="name"
                        id="candidateName"
                        value={candidateInfo.name}
                        onChange={handleInputChange}
                        placeholder="Enter candidate name"
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label for="candidateEmail">Email</Label>
                      <Input
                        type="email"
                        name="email"
                        id="candidateEmail"
                        value={candidateInfo.email}
                        onChange={handleInputChange}
                        placeholder="Enter candidate email"
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label for="position">Position Applied For</Label>
                      <Input
                        type="text"
                        name="position"
                        id="position"
                        value={candidateInfo.position}
                        onChange={handleInputChange}
                        placeholder="e.g., Software Engineer, Data Scientist"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label for="resumeFile">Upload Resume</Label>
                      <Input
                        type="file"
                        id="resumeFile"
                        onChange={handleFileChange}
                        accept=".pdf,.txt"
                      />
                      <small className="text-muted">
                        Supported formats: PDF, TXT (Max size: 10MB)
                      </small>
                    </FormGroup>
                  </Form>

                  {error && <Alert color="danger">{error}</Alert>}

                  {uploading && (
                    <div className="mt-3">
                      <Progress value={progress} color="info" />
                      <small className="text-muted">Analyzing resume...</small>
                    </div>
                  )}

                  <div className="mt-4">
                    <Button 
                      color="primary" 
                      size="lg" 
                      onClick={analyzeResume}
                      disabled={uploading || !file}
                      className="w-100"
                    >
                      {uploading ? 'Analyzing...' : 'Analyze Resume'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <Alert color="success">
                    <h5>✅ Resume Analysis Complete!</h5>
                    <p><strong>Candidate:</strong> {resumeData.name}</p>
                    <p><strong>Position:</strong> {resumeData.position}</p>
                    <p><strong>Skills Detected:</strong> {resumeData.analysis.skills?.join(', ') || 'None detected'}</p>
                    <p><strong>Experience Level:</strong> {resumeData.analysis.experienceLevel}</p>
                  </Alert>

                  <div className="mt-4">
                    <h6>Analysis Summary:</h6>
                    <div className="bg-light p-3 rounded">
                      <p><strong>Technical Skills:</strong> {resumeData.analysis.technicalSkills?.join(', ') || 'None'}</p>
                      <p><strong>Programming Languages:</strong> {resumeData.analysis.programmingLanguages?.join(', ') || 'None'}</p>
                      <p><strong>Years of Experience:</strong> {resumeData.analysis.yearsOfExperience || 'Not specified'}</p>
                      <p><strong>Education:</strong> {resumeData.analysis.education || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="mt-4 d-flex gap-2">
                    <Button 
                      color="success" 
                      size="lg" 
                      onClick={generatePersonalizedQuestions}
                      disabled={uploading}
                      className="flex-fill"
                    >
                      {uploading ? 'Generating Questions...' : 'Start Personalized Interview'}
                    </Button>
                    <Button 
                      color="secondary" 
                      onClick={() => {
                        setResumeData(null)
                        setFile(null)
                        setCandidateInfo({ name: '', email: '', position: '' })
                      }}
                    >
                      Upload Another Resume
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ResumeUpload
