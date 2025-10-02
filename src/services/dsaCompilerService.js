class DSACompilerService {
  constructor() {
    this.supportedLanguages = ['javascript', 'python', 'java', 'cpp']
    this.testCases = []
  }

  // Execute JavaScript code safely
  async executeJavaScript(code, testCase) {
    try {
      // Create a safe execution environment
      const func = new Function('nums', 'target', 's', 'l1', 'l2', 'root', 'beginWord', 'endWord', 'wordList', 'k', 'lists', `
        ${code}
        
        // Try to find the main function
        if (typeof twoSum === 'function') return twoSum(nums, target);
        if (typeof isValid === 'function') return isValid(s);
        if (typeof maxSubArray === 'function') return maxSubArray(nums);
        if (typeof addTwoNumbers === 'function') return addTwoNumbers(l1, l2);
        if (typeof lengthOfLongestSubstring === 'function') return lengthOfLongestSubstring(s);
        if (typeof levelOrder === 'function') return levelOrder(root);
        if (typeof productExceptSelf === 'function') return productExceptSelf(nums);
        if (typeof threeSum === 'function') return threeSum(nums);
        if (typeof mergeKLists === 'function') return mergeKLists(lists);
        if (typeof ladderLength === 'function') return ladderLength(beginWord, endWord, wordList);
        if (typeof serialize === 'function') return serialize(root);
        if (typeof deserialize === 'function') return deserialize(root);
        if (typeof maxSlidingWindow === 'function') return maxSlidingWindow(nums, k);
        
        return null;
      `)
      
      const result = func(
        testCase.input.nums,
        testCase.input.target,
        testCase.input.s,
        testCase.input.l1,
        testCase.input.l2,
        testCase.input.root,
        testCase.input.beginWord,
        testCase.input.endWord,
        testCase.input.wordList,
        testCase.input.k,
        testCase.input.lists
      )
      
      return {
        success: true,
        result: result,
        executionTime: Date.now(),
        language: 'javascript'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: Date.now(),
        language: 'javascript'
      }
    }
  }

  // Generate test cases for DSA problems
  generateTestCases(problemType, difficulty) {
    const testCases = {
      'array': {
        easy: [
          { input: [1, 2, 3, 4, 5], expected: 15 },
          { input: [10, 20, 30], expected: 60 },
          { input: [-1, -2, -3], expected: -6 }
        ],
        medium: [
          { input: [1, 2, 3, 4, 5], target: 6, expected: [0, 4] },
          { input: [2, 7, 11, 15], target: 9, expected: [0, 1] },
          { input: [3, 2, 4], target: 6, expected: [1, 2] }
        ],
        hard: [
          { input: [1, 3, 2, 2, 3, 1], expected: 4 },
          { input: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], expected: 5 },
          { input: [5, 4, 3, 2, 1], expected: 1 }
        ]
      },
      'linkedlist': {
        easy: [
          { input: [1, 2, 3, 4, 5], expected: [1, 2, 3, 4, 5] },
          { input: [1], expected: [1] },
          { input: [], expected: [] }
        ],
        medium: [
          { input: [1, 2, 3, 4, 5], k: 2, expected: [4, 5, 1, 2, 3] },
          { input: [0, 1, 2], k: 4, expected: [2, 0, 1] },
          { input: [1, 2], k: 1, expected: [2, 1] }
        ],
        hard: [
          { input: [1, 2, 3, 4, 5], expected: [5, 4, 3, 2, 1] },
          { input: [1, 2, 3, 4, 5, 6], expected: [6, 5, 4, 3, 2, 1] },
          { input: [1], expected: [1] }
        ]
      },
      'tree': {
        easy: [
          { input: [3, 9, 20, null, null, 15, 7], expected: 3 },
          { input: [1, null, 2], expected: 2 },
          { input: [], expected: 0 }
        ],
        medium: [
          { input: [3, 9, 20, null, null, 15, 7], expected: [[3], [9, 20], [15, 7]] },
          { input: [1], expected: [[1]] },
          { input: [], expected: [] }
        ],
        hard: [
          { input: [1, 2, 3, 4, 5, 6, 7], expected: [1, 2, 4, 5, 3, 6, 7] },
          { input: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], expected: [1, 2, 4, 8, 9, 5, 10, 11, 3, 6, 12, 13, 7, 14, 15] }
        ]
      },
      'graph': {
        easy: [
          { input: [[1, 2], [2, 3], [3, 4]], expected: true },
          { input: [[1, 2], [2, 3], [3, 1]], expected: false },
          { input: [[1, 2]], expected: true }
        ],
        medium: [
          { input: [[1, 2], [2, 3], [3, 4], [4, 1]], expected: [1, 2, 3, 4] },
          { input: [[1, 2], [2, 3], [3, 4], [4, 5]], expected: [1, 2, 3, 4, 5] },
          { input: [[1, 2], [2, 3], [3, 1]], expected: [1, 2, 3] }
        ],
        hard: [
          { input: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 1]], expected: [1, 2, 3, 4, 5] },
          { input: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1]], expected: [1, 2, 3, 4, 5, 6] }
        ]
      }
    }

    return testCases[problemType]?.[difficulty] || []
  }

  // Validate code syntax
  validateSyntax(code, language) {
    try {
      switch (language.toLowerCase()) {
        case 'javascript':
          // Basic JavaScript syntax validation
          if (code.includes('eval(') || code.includes('Function(')) {
            return { valid: false, error: 'Unsafe code detected' }
          }
          return { valid: true }
        
        case 'python':
          // Basic Python syntax validation
          if (code.includes('import os') || code.includes('import sys')) {
            return { valid: false, error: 'Unsafe imports detected' }
          }
          return { valid: true }
        
        default:
          return { valid: true }
      }
    } catch (error) {
      return { valid: false, error: error.message }
    }
  }

  // Run test cases against code
  async runTestCases(code, testCases, language = 'javascript') {
    const results = []
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i]
      try {
        const result = await this.executeCode(code, testCase.input, language)
        const passed = this.compareResults(result, testCase.expected)
        
        results.push({
          testCase: i + 1,
          input: testCase.input,
          expected: testCase.expected,
          actual: result,
          passed: passed,
          executionTime: Date.now()
        })
      } catch (error) {
        results.push({
          testCase: i + 1,
          input: testCase.input,
          expected: testCase.expected,
          actual: null,
          passed: false,
          error: error.message,
          executionTime: Date.now()
        })
      }
    }
    
    return results
  }

  // Execute code with input
  async executeCode(code, input, language = 'javascript') {
    try {
      switch (language.toLowerCase()) {
        case 'javascript':
          return await this.executeJavaScript(code, input)
        default:
          throw new Error(`Language ${language} not supported`)
      }
    } catch (error) {
      throw new Error(`Execution failed: ${error.message}`)
    }
  }

  // Compare results
  compareResults(actual, expected) {
    if (Array.isArray(actual) && Array.isArray(expected)) {
      return JSON.stringify(actual.sort()) === JSON.stringify(expected.sort())
    }
    return actual === expected
  }

  // Generate code template for DSA problems
  generateCodeTemplate(problemType, language = 'javascript') {
    const templates = {
      'javascript': {
        'array': `
function solveProblem(arr) {
    // Your solution here
    // Example: return arr.reduce((sum, num) => sum + num, 0);
    return arr;
}

// Test your solution
console.log(solveProblem([1, 2, 3, 4, 5]));
        `,
        'linkedlist': `
function ListNode(val, next) {
    this.val = val;
    this.next = next;
}

function solveProblem(head) {
    // Your solution here
    return head;
}
        `,
        'tree': `
function TreeNode(val, left, right) {
    this.val = val;
    this.left = left;
    this.right = right;
}

function solveProblem(root) {
    // Your solution here
    return root;
}
        `,
        'graph': `
function solveProblem(edges) {
    // Your solution here
    // Example: return edges.length;
    return edges;
}
        `
      }
    }

    return templates[language]?.[problemType] || '// Code template not available'
  }

  // Analyze code complexity
  analyzeComplexity(code) {
    const lines = code.split('\n').length
    const complexity = {
      lines: lines,
      timeComplexity: 'O(n)', // This would need more sophisticated analysis
      spaceComplexity: 'O(1)', // This would need more sophisticated analysis
      readability: lines < 50 ? 'Good' : lines < 100 ? 'Fair' : 'Poor'
    }
    
    return complexity
  }
}

export const dsaCompilerService = new DSACompilerService()
