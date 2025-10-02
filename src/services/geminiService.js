import { GoogleGenerativeAI } from '@google/generative-ai'

class GeminiService {
  constructor() {
    this.apiKey = 'AIzaSyAo_tpyxOwECQMeqy9wBfMWk-Z1aBYJ0Qw'
    console.log('Initializing Gemini with API key:', this.apiKey.substring(0, 10) + '...')
    this.genAI = new GoogleGenerativeAI(this.apiKey)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' })
  }

  async analyzeResume(resumeText) {
    try {
      console.log('Starting resume analysis...')
      console.log('Resume text length:', resumeText.length)
      
      const prompt = `
        Analyze this resume and extract the following information in JSON format:
        {
          "skills": ["skill1", "skill2"],
          "technicalSkills": ["tech1", "tech2"],
          "programmingLanguages": ["lang1", "lang2"],
          "yearsOfExperience": number,
          "experienceLevel": "entry|mid|senior|lead",
          "education": "degree and institution",
          "previousRoles": ["role1", "role2"],
          "projects": ["project1", "project2"],
          "certifications": ["cert1", "cert2"],
          "strengths": ["strength1", "strength2"],
          "areasForImprovement": ["area1", "area2"]
        }
        
        Resume text: ${resumeText}
        
        Focus on technical skills, programming languages, years of experience, and relevant projects.
        Be thorough but concise in the analysis.
      `

      console.log('Sending request to Gemini...')
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      console.log('Received response from Gemini:', text.substring(0, 200) + '...')
      
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0])
        console.log('Successfully parsed resume analysis:', analysis)
        return analysis
      }
      
      console.error('No JSON found in response:', text)
      throw new Error('Failed to parse resume analysis - no JSON found in response')
    } catch (error) {
      console.error('Error analyzing resume:', error)
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
      
      if (error.message.includes('API key')) {
        throw new Error('Invalid API key. Please check your Gemini API key.')
      } else if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please try again later.')
      } else {
        throw new Error('Failed to analyze resume: ' + error.message)
      }
    }
  }

  async generatePersonalizedQuestions(resumeData) {
    try {
      const prompt = `
        Based on this candidate's resume, generate 12 comprehensive DSA (Data Structures and Algorithms) interview questions.
        
        Candidate Info:
        - Name: ${resumeData.name}
        - Position: ${resumeData.position}
        - Skills: ${resumeData.analysis.skills?.join(', ') || 'Not specified'}
        - Technical Skills: ${resumeData.analysis.technicalSkills?.join(', ') || 'Not specified'}
        - Programming Languages: ${resumeData.analysis.programmingLanguages?.join(', ') || 'Not specified'}
        - Experience Level: ${resumeData.analysis.experienceLevel}
        - Years of Experience: ${resumeData.analysis.yearsOfExperience}
        - Previous Roles: ${resumeData.analysis.previousRoles?.join(', ') || 'Not specified'}
        - Projects: ${resumeData.analysis.projects?.join(', ') || 'Not specified'}
        
        Generate questions that:
        1. Focus on Data Structures and Algorithms (DSA)
        2. Include compiler-related questions (parsing, optimization, memory management)
        3. Mix of difficulty: 3 easy, 5 medium, 4 hard
        4. Cover: Arrays, Linked Lists, Trees, Graphs, Dynamic Programming, Sorting, Searching
        5. Include system design questions for senior levels
        6. Test problem-solving and coding skills
        7. Include both coding problems and conceptual questions
        
        Format as JSON array with fields: id, title, description, difficulty, category, timeLimit, testCases, expectedSkills, hints, followUpQuestions
        Make questions challenging but fair for their level. Generate exactly 12 questions.
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0])
        return questions.map((q, index) => ({
          ...q,
          id: `q_${Date.now()}_${index}`,
          timeLimit: q.timeLimit || this.getDefaultTimeLimit(q.difficulty),
          personalizedFor: resumeData.name
        }))
      }
      
      throw new Error('Failed to parse personalized questions')
    } catch (error) {
      console.error('Error generating personalized questions:', error)
      throw new Error('Failed to generate personalized questions. Please check your API key.')
    }
  }

  async generateQuestions(category, difficulty, count = 5) {
    try {
      const prompt = `
        Generate ${count} technical interview questions for ${category} at ${difficulty} difficulty level.
        Each question should include:
        - A clear problem statement
        - Expected time to solve (in minutes)
        - Difficulty level
        - Category
        - Sample test cases if applicable
        
        Format as JSON array with fields: id, title, description, difficulty, category, timeLimit, testCases
        Make questions challenging but fair for ${difficulty} level.
        Focus on practical problem-solving skills.
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Parse JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0])
        return questions.map((q, index) => ({
          ...q,
          id: `q_${Date.now()}_${index}`,
          category,
          difficulty,
          timeLimit: q.timeLimit || this.getDefaultTimeLimit(difficulty)
        }))
      }
      
      throw new Error('Failed to parse questions from Gemini response')
    } catch (error) {
      console.error('Error generating questions:', error)
      throw new Error('Failed to generate questions. Please check your API key.')
    }
  }

  async evaluateAnswer(question, userAnswer) {
    try {
      const prompt = `
        Evaluate this coding answer for the following question:
        
        Question: ${question.description}
        User Answer: ${userAnswer}
        
        Provide feedback on:
        1. Correctness (is the solution correct?)
        2. Efficiency (time/space complexity)
        3. Code quality (readability, best practices)
        4. Edge cases handled
        5. Suggestions for improvement
        
        Respond in JSON format:
        {
          "isCorrect": boolean,
          "score": number (0-100),
          "feedback": "detailed feedback string",
          "suggestions": ["suggestion1", "suggestion2"]
        }
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      
      return {
        isCorrect: false,
        score: 0,
        feedback: 'Unable to evaluate answer. Please try again.',
        suggestions: []
      }
    } catch (error) {
      console.error('Error evaluating answer:', error)
      return {
        isCorrect: false,
        score: 0,
        feedback: 'Error occurred during evaluation.',
        suggestions: []
      }
    }
  }

  async generateHint(question, userAnswer) {
    try {
      const prompt = `
        The user is working on this problem: ${question.description}
        Their current approach: ${userAnswer}
        
        Provide a helpful hint (not the full solution) to guide them in the right direction.
        Keep it concise and encouraging.
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Error generating hint:', error)
      return 'Unable to generate hint at this time.'
    }
  }

  getDefaultTimeLimit(difficulty) {
    switch (difficulty) {
      case 'easy': return 15
      case 'medium': return 30
      case 'hard': return 45
      default: return 30
    }
  }

  async testConnection() {
    try {
      console.log('Testing Gemini API connection...')
      console.log('API Key (first 10 chars):', this.apiKey.substring(0, 10))
      
      // Simple test request
      const result = await this.model.generateContent('Say "Hello"')
      const response = await result.response
      const text = response.text()
      console.log('Gemini API test response:', text)
      return true
    } catch (error) {
      console.error('Gemini API test failed:', error)
      console.error('Error details:', error.message)
      console.error('Error code:', error.code)
      
      // Check if it's an API key issue
      if (error.message.includes('API_KEY_INVALID') || error.message.includes('invalid')) {
        console.error('API Key appears to be invalid')
        return false
      }
      
      // Check if it's a quota issue
      if (error.message.includes('quota') || error.message.includes('limit')) {
        console.error('API quota exceeded')
        return false
      }
      
      return false
    }
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' })
  }
}

export const geminiService = new GeminiService()
