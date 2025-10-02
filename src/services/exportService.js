class ExportService {
  constructor() {
    this.ragService = null // Will be injected
  }

  setRAGService(ragService) {
    this.ragService = ragService
  }

  async exportInterviewData() {
    try {
      const data = await this.ragService.getDashboardData()
      const sessions = await this.ragService.getAllSessions()
      
      // Create CSV content
      const csvContent = this.generateCSV(sessions)
      
      // Download file
      this.downloadCSV(csvContent, 'interview-data.csv')
      
      return true
    } catch (error) {
      console.error('Error exporting data:', error)
      throw new Error('Failed to export data')
    }
  }

  generateCSV(sessions) {
    const headers = [
      'Session ID',
      'Candidate Name',
      'Position',
      'Start Time',
      'End Time',
      'Duration (minutes)',
      'Total Questions',
      'Questions Answered',
      'Average Score',
      'Status',
      'Skills Tested',
      'Difficulty Distribution'
    ]

    const rows = sessions.map(session => {
      const duration = session.endTime ? 
        Math.round((new Date(session.endTime) - new Date(session.startTime)) / 60000) : 
        'N/A'
      
      const skillsTested = session.questions?.map(q => q.expectedSkills).flat().join(', ') || 'N/A'
      
      const difficultyDist = this.calculateDifficultyDistribution(session.questions || [])
      
      return [
        session.id,
        session.candidateName || 'Unknown',
        session.position || 'N/A',
        new Date(session.startTime).toLocaleString(),
        session.endTime ? new Date(session.endTime).toLocaleString() : 'N/A',
        duration,
        session.questions?.length || 0,
        session.answers?.length || 0,
        session.averageScore || 0,
        session.status,
        skillsTested,
        difficultyDist
      ]
    })

    return [headers, ...rows].map(row => 
      row.map(cell => '"' + cell + '"').join(',')
    ).join('\n')
  }

  calculateDifficultyDistribution(questions) {
    const distribution = questions.reduce((acc, q) => {
      acc[q.difficulty] = (acc[q.difficulty] || 0) + 1
      return acc
    }, {})
    
    return Object.entries(distribution)
      .map(([difficulty, count]) => difficulty + ': ' + count)
      .join(', ')
  }

  downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  async exportDetailedResults(sessionId) {
    try {
      const session = await this.ragService.getSessionById(sessionId)
      if (!session) throw new Error('Session not found')

      const headers = [
        'Question ID',
        'Question Title',
        'Question Description',
        'Difficulty',
        'Category',
        'Time Limit (minutes)',
        'User Answer',
        'Is Correct',
        'Score',
        'Time Spent (seconds)',
        'Feedback',
        'Submitted At'
      ]

      const rows = session.answers.map(answer => {
        const question = session.questions.find(q => q.id === answer.questionId)
        return [
          answer.questionId,
          question?.title || 'N/A',
          question?.description || 'N/A',
          question?.difficulty || 'N/A',
          question?.category || 'N/A',
          question?.timeLimit || 'N/A',
          answer.answer,
          answer.isCorrect ? 'Yes' : 'No',
          answer.score || 0,
          answer.timeSpent,
          answer.feedback || 'N/A',
          new Date(answer.submittedAt).toLocaleString()
        ]
      })

      const csvContent = [headers, ...rows].map(row => 
        row.map(cell => '"' + cell + '"').join(',')
      ).join('\n')

      this.downloadCSV(csvContent, 'session-' + sessionId + '-details.csv')
      return true
    } catch (error) {
      console.error('Error exporting detailed results:', error)
      throw new Error('Failed to export detailed results')
    }
  }

  async exportResumeAnalysis(resumeData) {
    try {
      const headers = [
        'Candidate Name',
        'Email',
        'Position',
        'Skills',
        'Technical Skills',
        'Programming Languages',
        'Years of Experience',
        'Experience Level',
        'Education',
        'Previous Roles',
        'Projects',
        'Certifications',
        'Strengths',
        'Areas for Improvement',
        'Analysis Date'
      ]

      const row = [
        resumeData.name,
        resumeData.email,
        resumeData.position,
        resumeData.analysis.skills?.join(', ') || 'N/A',
        resumeData.analysis.technicalSkills?.join(', ') || 'N/A',
        resumeData.analysis.programmingLanguages?.join(', ') || 'N/A',
        resumeData.analysis.yearsOfExperience || 'N/A',
        resumeData.analysis.experienceLevel || 'N/A',
        resumeData.analysis.education || 'N/A',
        resumeData.analysis.previousRoles?.join(', ') || 'N/A',
        resumeData.analysis.projects?.join(', ') || 'N/A',
        resumeData.analysis.certifications?.join(', ') || 'N/A',
        resumeData.analysis.strengths?.join(', ') || 'N/A',
        resumeData.analysis.areasForImprovement?.join(', ') || 'N/A',
        new Date(resumeData.uploadedAt).toLocaleString()
      ]

      const csvContent = [headers, row].map(row => 
        row.map(cell => '"' + cell + '"').join(',')
      ).join('\n')

      this.downloadCSV(csvContent, 'resume-analysis-' + resumeData.name.replace(/\s+/g, '-') + '.csv')
      return true
    } catch (error) {
      console.error('Error exporting resume analysis:', error)
      throw new Error('Failed to export resume analysis')
    }
  }
}

export const exportService = new ExportService()
