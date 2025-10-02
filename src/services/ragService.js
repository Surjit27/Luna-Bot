class RAGService {
  constructor() {
    this.questionBank = []
    this.embeddings = new Map()
    this.sessions = []
    this.loadFromStorage()
  }

  // Simple embedding function (in production, use a proper embedding model)
  async generateEmbedding(text) {
    // This is a simplified embedding - in production, use OpenAI embeddings or similar
    const words = text.toLowerCase().split(/\s+/)
    const embedding = new Array(100).fill(0)
    
    words.forEach(word => {
      const hash = this.simpleHash(word)
      embedding[hash % 100] += 1
    })
    
    return embedding
  }

  simpleHash(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  async addQuestion(question) {
    const embedding = await this.generateEmbedding(question.description)
    this.questionBank.push({
      ...question,
      embedding,
      addedAt: new Date()
    })
    this.saveToStorage()
  }

  async findSimilarQuestions(query, limit = 5) {
    const queryEmbedding = await this.generateEmbedding(query)
    const similarities = []

    for (const question of this.questionBank) {
      const similarity = this.cosineSimilarity(queryEmbedding, question.embedding)
      similarities.push({ question, similarity })
    }

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.question)
  }

  cosineSimilarity(a, b) {
    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  async getContextualQuestions(currentQuestion, userHistory = []) {
    const context = `
      Current question: ${currentQuestion.description}
      User's previous answers: ${userHistory.map(a => a.answer).join(' ')}
    `
    
    return await this.findSimilarQuestions(context, 3)
  }

  async saveSession(session) {
    this.sessions.push(session)
    this.saveToStorage()
  }

  async getDashboardData() {
    console.log('Getting dashboard data...')
    console.log('Sessions:', this.sessions.length)
    console.log('Sessions data:', this.sessions)
    
    const totalSessions = this.sessions.length
    const totalQuestions = this.sessions.reduce((sum, session) => sum + session.questions.length, 0)
    
    const categoryBreakdown = this.sessions.reduce((acc, session) => {
      session.questions.forEach(q => {
        acc[q.category] = (acc[q.category] || 0) + 1
      })
      return acc
    }, {})

    const difficultyBreakdown = this.sessions.reduce((acc, session) => {
      session.questions.forEach(q => {
        acc[q.difficulty] = (acc[q.difficulty] || 0) + 1
      })
      return acc
    }, {})

    const averageScore = this.calculateAverageScore()
    const scoreDistribution = this.calculateScoreDistribution()
    const topSkills = this.calculateTopSkills()

    return {
      totalSessions,
      totalQuestionsAnswered: totalQuestions,
      averageScore,
      categoryBreakdown,
      difficultyBreakdown,
      recentSessions: this.sessions.slice(-5),
      scoreDistribution,
      topSkills
    }
  }

  async getAllSessions() {
    return this.sessions
  }

  async getSessionById(sessionId) {
    return this.sessions.find(session => session.id === sessionId)
  }

  async saveResumeData(resumeData) {
    // Store resume data for later reference
    const resumeStorage = JSON.parse(localStorage.getItem('resume-data') || '[]')
    resumeStorage.push(resumeData)
    localStorage.setItem('resume-data', JSON.stringify(resumeStorage))
  }

  calculateScoreDistribution() {
    const allScores = this.sessions.flatMap(session => 
      session.answers.map(answer => answer.score || 0)
    )

    return {
      excellent: allScores.filter(score => score >= 80).length,
      good: allScores.filter(score => score >= 60 && score < 80).length,
      poor: allScores.filter(score => score < 60).length
    }
  }

  calculateTopSkills() {
    const skillCounts = {}
    
    this.sessions.forEach(session => {
      session.questions.forEach(question => {
        if (question.expectedSkills) {
          question.expectedSkills.forEach(skill => {
            skillCounts[skill] = (skillCounts[skill] || 0) + 1
          })
        }
      })
    })

    const totalSkills = Object.values(skillCounts).reduce((sum, count) => sum + count, 0)
    
    return Object.entries(skillCounts)
      .map(([skill, count]) => ({
        name: skill,
        count,
        percentage: Math.round((count / totalSkills) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  calculateAverageScore() {
    const allAnswers = this.sessions.flatMap(session => session.answers)
    if (allAnswers.length === 0) return 0
    
    const totalScore = allAnswers.reduce((sum, answer) => {
      return sum + (answer.score || 0)
    }, 0)
    
    return Math.round(totalScore / allAnswers.length)
  }

  async generatePersonalizedQuestion(category, difficulty, userHistory = []) {
    // Analyze user's weak areas based on history
    const weakAreas = this.analyzeWeakAreas(userHistory)
    
    // Find similar questions that user struggled with
    const similarQuestions = await this.findSimilarQuestions(
      weakAreas.join(' '), 
      10
    )
    
    // Filter by category and difficulty
    const filteredQuestions = similarQuestions.filter(q => 
      q.category === category && q.difficulty === difficulty
    )
    
    return filteredQuestions[0] || null
  }

  analyzeWeakAreas(userHistory) {
    const incorrectAnswers = userHistory.filter(answer => !answer.isCorrect)
    const weakAreas = []
    
    incorrectAnswers.forEach(answer => {
      // Extract keywords from questions user got wrong
      const words = answer.questionId.split('_')
      weakAreas.push(...words)
    })
    
    return [...new Set(weakAreas)] // Remove duplicates
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('interview-bot-data')
      if (stored) {
        const data = JSON.parse(stored)
        this.questionBank = data.questionBank || []
        this.sessions = data.sessions || []
      }
    } catch (error) {
      console.error('Error loading from storage:', error)
    }
  }

  saveToStorage() {
    try {
      const data = {
        questionBank: this.questionBank,
        sessions: this.sessions
      }
      localStorage.setItem('interview-bot-data', JSON.stringify(data))
    } catch (error) {
      console.error('Error saving to storage:', error)
    }
  }

  async clearData() {
    this.questionBank = []
    this.sessions = []
    this.saveToStorage()
  }
}

export const ragService = new RAGService()
