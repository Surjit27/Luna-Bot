import { geminiService } from './geminiService'
import { dsaCompilerService } from './dsaCompilerService'

class EvaluationService {
  constructor() {
    this.evaluationCache = new Map()
  }

  // Evaluate a DSA answer with test cases and AI feedback
  async evaluateDSAAnswer(question, userAnswer, userCode) {
    try {
      console.log('Evaluating DSA answer for question:', question.title)
      
      // Run test cases if code is provided
      let testResults = null
      if (userCode && question.testCases) {
        testResults = await this.runTestCases(question, userCode)
      }

      // Get AI evaluation
      const aiEvaluation = await this.getAIEvaluation(question, userAnswer, testResults)

      // Calculate overall score
      const score = this.calculateScore(testResults, aiEvaluation)

      return {
        questionId: question.id,
        questionTitle: question.title,
        userAnswer: userAnswer,
        userCode: userCode,
        testResults: testResults,
        aiEvaluation: aiEvaluation,
        score: score,
        timestamp: new Date(),
        evaluation: {
          correctness: score.correctness,
          efficiency: score.efficiency,
          codeQuality: score.codeQuality,
          explanation: score.explanation,
          overall: score.overall
        }
      }
    } catch (error) {
      console.error('Error evaluating answer:', error)
      return {
        questionId: question.id,
        questionTitle: question.title,
        userAnswer: userAnswer,
        userCode: userCode,
        error: error.message,
        score: {
          correctness: 0,
          efficiency: 0,
          codeQuality: 0,
          explanation: 0,
          overall: 0
        }
      }
    }
  }

  // Run test cases for code
  async runTestCases(question, userCode) {
    try {
      const results = []
      let passedTests = 0

      for (let i = 0; i < question.testCases.length; i++) {
        const testCase = question.testCases[i]
        try {
          const executionResult = await dsaCompilerService.executeJavaScript(userCode, testCase)
          
          const passed = this.compareResults(executionResult.result, testCase.expected)
          if (passed) passedTests++

          results.push({
            testCase: i + 1,
            input: testCase.input,
            expected: testCase.expected,
            actual: executionResult.result,
            passed: passed,
            executionTime: executionResult.executionTime,
            error: executionResult.error
          })
        } catch (error) {
          results.push({
            testCase: i + 1,
            input: testCase.input,
            expected: testCase.expected,
            actual: null,
            passed: false,
            error: error.message,
            executionTime: 0
          })
        }
      }

      return {
        totalTests: question.testCases.length,
        passedTests: passedTests,
        failedTests: question.testCases.length - passedTests,
        passRate: (passedTests / question.testCases.length) * 100,
        results: results
      }
    } catch (error) {
      console.error('Error running test cases:', error)
      return {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        passRate: 0,
        results: [],
        error: error.message
      }
    }
  }

  // Get AI evaluation of the answer
  async getAIEvaluation(question, userAnswer, testResults) {
    try {
      const prompt = `
        Evaluate this DSA interview answer:

        Question: ${question.title}
        Description: ${question.description}
        Difficulty: ${question.difficulty}
        Expected Skills: ${question.expectedSkills?.join(', ') || 'Not specified'}

        User Answer: ${userAnswer}

        Test Results: ${testResults ? `
          - Total Tests: ${testResults.totalTests}
          - Passed Tests: ${testResults.passedTests}
          - Failed Tests: ${testResults.failedTests}
          - Pass Rate: ${testResults.passRate}%
        ` : 'No test results available'}

        Please provide a detailed evaluation in JSON format:
        {
          "correctness": {
            "score": 0-100,
            "feedback": "Detailed feedback on correctness"
          },
          "efficiency": {
            "score": 0-100,
            "feedback": "Feedback on time/space complexity"
          },
          "codeQuality": {
            "score": 0-100,
            "feedback": "Feedback on code readability, structure, best practices"
          },
          "explanation": {
            "score": 0-100,
            "feedback": "Feedback on explanation clarity and completeness"
          },
          "strengths": ["List of strengths"],
          "improvements": ["List of areas for improvement"],
          "overallFeedback": "Overall feedback and recommendations"
        }

        Be constructive and specific in your feedback. Consider the difficulty level and expected skills.
      `

      const result = await geminiService.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }

      // Fallback if JSON parsing fails
      return {
        correctness: { score: 50, feedback: "Unable to parse AI evaluation" },
        efficiency: { score: 50, feedback: "Unable to parse AI evaluation" },
        codeQuality: { score: 50, feedback: "Unable to parse AI evaluation" },
        explanation: { score: 50, feedback: "Unable to parse AI evaluation" },
        strengths: ["Answer provided"],
        improvements: ["Could be improved"],
        overallFeedback: "Evaluation completed with limited feedback"
      }
    } catch (error) {
      console.error('Error getting AI evaluation:', error)
      return {
        correctness: { score: 0, feedback: "AI evaluation failed" },
        efficiency: { score: 0, feedback: "AI evaluation failed" },
        codeQuality: { score: 0, feedback: "AI evaluation failed" },
        explanation: { score: 0, feedback: "AI evaluation failed" },
        strengths: [],
        improvements: ["AI evaluation unavailable"],
        overallFeedback: "Unable to provide AI evaluation due to technical issues"
      }
    }
  }

  // Calculate overall score
  calculateScore(testResults, aiEvaluation) {
    const weights = {
      correctness: 0.4,
      efficiency: 0.2,
      codeQuality: 0.2,
      explanation: 0.2
    }

    let correctnessScore = 0
    if (testResults && testResults.passRate !== undefined) {
      correctnessScore = testResults.passRate
    } else {
      correctnessScore = aiEvaluation.correctness?.score || 0
    }

    const efficiencyScore = aiEvaluation.efficiency?.score || 0
    const codeQualityScore = aiEvaluation.codeQuality?.score || 0
    const explanationScore = aiEvaluation.explanation?.score || 0

    const overallScore = 
      (correctnessScore * weights.correctness) +
      (efficiencyScore * weights.efficiency) +
      (codeQualityScore * weights.codeQuality) +
      (explanationScore * weights.explanation)

    return {
      correctness: Math.round(correctnessScore),
      efficiency: Math.round(efficiencyScore),
      codeQuality: Math.round(codeQualityScore),
      explanation: Math.round(explanationScore),
      overall: Math.round(overallScore)
    }
  }

  // Compare results for test cases
  compareResults(actual, expected) {
    if (actual === null || actual === undefined) return false
    if (actual === expected) return true

    // Handle array comparison
    if (Array.isArray(actual) && Array.isArray(expected)) {
      if (actual.length !== expected.length) return false
      return actual.every((val, index) => this.compareResults(val, expected[index]))
    }

    // Handle object comparison
    if (typeof actual === 'object' && typeof expected === 'object') {
      const actualKeys = Object.keys(actual).sort()
      const expectedKeys = Object.keys(expected).sort()
      if (actualKeys.length !== expectedKeys.length) return false
      return actualKeys.every(key => this.compareResults(actual[key], expected[key]))
    }

    return false
  }

  // Get evaluation summary for dashboard
  getEvaluationSummary(evaluations) {
    if (!evaluations || evaluations.length === 0) {
      return {
        totalQuestions: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        passedQuestions: 0,
        failedQuestions: 0
      }
    }

    const scores = evaluations.map(e => e.score.overall)
    const passedQuestions = evaluations.filter(e => e.score.overall >= 70).length

    return {
      totalQuestions: evaluations.length,
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      passedQuestions: passedQuestions,
      failedQuestions: evaluations.length - passedQuestions,
      passRate: Math.round((passedQuestions / evaluations.length) * 100)
    }
  }

  // Get detailed analytics
  getDetailedAnalytics(evaluations) {
    const categories = {}
    const difficulties = {}
    const skills = {}

    evaluations.forEach(evaluation => {
      // Category analysis
      const category = evaluation.questionTitle.split(' ')[0] // Simple category extraction
      if (!categories[category]) {
        categories[category] = { total: 0, passed: 0, averageScore: 0 }
      }
      categories[category].total++
      if (evaluation.score.overall >= 70) categories[category].passed++
      categories[category].averageScore += evaluation.score.overall

      // Difficulty analysis
      const difficulty = evaluation.difficulty || 'unknown'
      if (!difficulties[difficulty]) {
        difficulties[difficulty] = { total: 0, passed: 0, averageScore: 0 }
      }
      difficulties[difficulty].total++
      if (evaluation.score.overall >= 70) difficulties[difficulty].passed++
      difficulties[difficulty].averageScore += evaluation.score.overall
    })

    // Calculate averages
    Object.keys(categories).forEach(cat => {
      categories[cat].averageScore = Math.round(categories[cat].averageScore / categories[cat].total)
      categories[cat].passRate = Math.round((categories[cat].passed / categories[cat].total) * 100)
    })

    Object.keys(difficulties).forEach(diff => {
      difficulties[diff].averageScore = Math.round(difficulties[diff].averageScore / difficulties[diff].total)
      difficulties[diff].passRate = Math.round((difficulties[diff].passed / difficulties[diff].total) * 100)
    })

    return {
      categories,
      difficulties,
      skills,
      summary: this.getEvaluationSummary(evaluations)
    }
  }
}

export const evaluationService = new EvaluationService()
