class InterviewQuestionsService {
  constructor() {
    this.dsaQuestions = this.initializeDSAQuestions()
    this.hrQuestions = this.initializeHRQuestions()
    this.technicalQuestions = this.initializeTechnicalQuestions()
  }

  initializeDSAQuestions() {
    return [
      // Easy Questions
      {
        id: 'dsa_001',
        title: 'Two Sum',
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
        difficulty: 'easy',
        category: 'array',
        timeLimit: 20,
        testCases: [
          { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
          { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
          { input: { nums: [3, 3], target: 6 }, expected: [0, 1] },
          { input: { nums: [1, 2, 3, 4, 5], target: 8 }, expected: [2, 4] },
          { input: { nums: [-1, -2, -3, -4, -5], target: -8 }, expected: [2, 4] }
        ],
        hints: [
          'Use a hash map to store numbers and their indices',
          'For each number, check if target - current number exists in the map',
          'Time complexity: O(n), Space complexity: O(n)'
        ],
        expectedSkills: ['Hash Map', 'Array Traversal', 'Two Pointers']
      },

      {
        id: 'dsa_002',
        title: 'Valid Parentheses',
        description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Example:
Input: s = "()"
Output: true

Input: s = "()[]{}"
Output: true

Input: s = "(]"
Output: false`,
        difficulty: 'easy',
        category: 'stack',
        timeLimit: 15,
        testCases: [
          { input: { s: "()" }, expected: true },
          { input: { s: "()[]{}" }, expected: true },
          { input: { s: "(]" }, expected: false },
          { input: { s: "([)]" }, expected: false },
          { input: { s: "{[]}" }, expected: true },
          { input: { s: "" }, expected: true }
        ],
        hints: [
          'Use a stack to keep track of opening brackets',
          'When you encounter a closing bracket, check if it matches the most recent opening bracket',
          'Time complexity: O(n), Space complexity: O(n)'
        ],
        expectedSkills: ['Stack', 'String Processing', 'Matching']
      },

      {
        id: 'dsa_003',
        title: 'Maximum Subarray',
        description: `Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

Example:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: [4,-1,2,1] has the largest sum = 6.

Follow up: If you have figured out the O(n) solution, try coding another solution using the divide and conquer approach, which is more subtle.`,
        difficulty: 'easy',
        category: 'array',
        timeLimit: 25,
        testCases: [
          { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expected: 6 },
          { input: { nums: [1] }, expected: 1 },
          { input: { nums: [5, 4, -1, 7, 8] }, expected: 23 },
          { input: { nums: [-1] }, expected: -1 },
          { input: { nums: [-2, -1] }, expected: -1 }
        ],
        hints: [
          'Use Kadane\'s algorithm',
          'Keep track of current sum and maximum sum',
          'If current sum becomes negative, reset it to 0',
          'Time complexity: O(n), Space complexity: O(1)'
        ],
        expectedSkills: ['Dynamic Programming', 'Array Processing', 'Kadane\'s Algorithm']
      },

      // Medium Questions
      {
        id: 'dsa_004',
        title: 'Add Two Numbers',
        description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

Example:
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.`,
        difficulty: 'medium',
        category: 'linkedlist',
        timeLimit: 30,
        testCases: [
          { input: { l1: [2, 4, 3], l2: [5, 6, 4] }, expected: [7, 0, 8] },
          { input: { l1: [0], l2: [0] }, expected: [0] },
          { input: { l1: [9, 9, 9, 9, 9, 9, 9], l2: [9, 9, 9, 9] }, expected: [8, 9, 9, 9, 0, 0, 0, 1] },
          { input: { l1: [1, 8], l2: [0] }, expected: [1, 8] }
        ],
        hints: [
          'Handle carry-over from addition',
          'Create a dummy head node for the result',
          'Process both lists until both are null and no carry remains',
          'Time complexity: O(max(m,n)), Space complexity: O(max(m,n))'
        ],
        expectedSkills: ['Linked List', 'Mathematical Operations', 'Carry Handling']
      },

      {
        id: 'dsa_005',
        title: 'Longest Substring Without Repeating Characters',
        description: `Given a string s, find the length of the longest substring without repeating characters.

Example:
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.

Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.`,
        difficulty: 'medium',
        category: 'string',
        timeLimit: 25,
        testCases: [
          { input: { s: "abcabcbb" }, expected: 3 },
          { input: { s: "bbbbb" }, expected: 1 },
          { input: { s: "pwwkew" }, expected: 3 },
          { input: { s: "" }, expected: 0 },
          { input: { s: "dvdf" }, expected: 3 }
        ],
        hints: [
          'Use sliding window technique',
          'Keep track of characters in current window using a set or map',
          'Move left pointer when duplicate character is found',
          'Time complexity: O(n), Space complexity: O(min(m,n))'
        ],
        expectedSkills: ['Sliding Window', 'Hash Set', 'String Processing']
      },

      {
        id: 'dsa_006',
        title: 'Binary Tree Level Order Traversal',
        description: `Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).

Example:
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]

Input: root = [1]
Output: [[1]]

Input: root = []
Output: []`,
        difficulty: 'medium',
        category: 'tree',
        timeLimit: 30,
        testCases: [
          { input: { root: [3, 9, 20, null, null, 15, 7] }, expected: [[3], [9, 20], [15, 7]] },
          { input: { root: [1] }, expected: [[1]] },
          { input: { root: [] }, expected: [] },
          { input: { root: [1, 2, 3, 4, 5, 6, 7] }, expected: [[1], [2, 3], [4, 5, 6, 7]] }
        ],
        hints: [
          'Use BFS (Breadth-First Search) with a queue',
          'Process nodes level by level',
          'Keep track of current level size',
          'Time complexity: O(n), Space complexity: O(w) where w is maximum width'
        ],
        expectedSkills: ['BFS', 'Queue', 'Tree Traversal', 'Level Processing']
      },

      {
        id: 'dsa_007',
        title: 'Product of Array Except Self',
        description: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in O(n) time and without using the division operator.

Example:
Input: nums = [1,2,3,4]
Output: [24,12,8,6]

Input: nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]`,
        difficulty: 'medium',
        category: 'array',
        timeLimit: 25,
        testCases: [
          { input: { nums: [1, 2, 3, 4] }, expected: [24, 12, 8, 6] },
          { input: { nums: [-1, 1, 0, -3, 3] }, expected: [0, 0, 9, 0, 0] },
          { input: { nums: [2, 3, 4, 5] }, expected: [60, 40, 30, 24] },
          { input: { nums: [1, 0] }, expected: [0, 1] }
        ],
        hints: [
          'Use two passes: left products and right products',
          'First pass: calculate products of all elements to the left',
          'Second pass: calculate products of all elements to the right',
          'Time complexity: O(n), Space complexity: O(1) excluding output array'
        ],
        expectedSkills: ['Array Processing', 'Prefix/Suffix Products', 'Two Pass Algorithm']
      },

      {
        id: 'dsa_008',
        title: '3Sum',
        description: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.

Example:
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]

Input: nums = [0,1,1]
Output: []

Input: nums = [0,0,0]
Output: [[0,0,0]]`,
        difficulty: 'medium',
        category: 'array',
        timeLimit: 35,
        testCases: [
          { input: { nums: [-1, 0, 1, 2, -1, -4] }, expected: [[-1, -1, 2], [-1, 0, 1]] },
          { input: { nums: [0, 1, 1] }, expected: [] },
          { input: { nums: [0, 0, 0] }, expected: [[0, 0, 0]] },
          { input: { nums: [-2, 0, 1, 1, 2] }, expected: [[-2, 0, 2], [-2, 1, 1]] }
        ],
        hints: [
          'Sort the array first',
          'Use three pointers: one fixed, two moving',
          'Skip duplicates to avoid duplicate triplets',
          'Time complexity: O(n²), Space complexity: O(1)'
        ],
        expectedSkills: ['Two Pointers', 'Sorting', 'Duplicate Handling', 'Three Sum']
      },

      // Hard Questions
      {
        id: 'dsa_009',
        title: 'Merge k Sorted Lists',
        description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

Example:
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]

Input: lists = []
Output: []

Input: lists = [[]]
Output: []`,
        difficulty: 'hard',
        category: 'linkedlist',
        timeLimit: 40,
        testCases: [
          { input: { lists: [[1, 4, 5], [1, 3, 4], [2, 6]] }, expected: [1, 1, 2, 3, 4, 4, 5, 6] },
          { input: { lists: [] }, expected: [] },
          { input: { lists: [[]] }, expected: [] },
          { input: { lists: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }, expected: [1, 2, 3, 4, 5, 6, 7, 8, 9] }
        ],
        hints: [
          'Use divide and conquer approach',
          'Merge lists in pairs recursively',
          'Or use a min-heap to always get the smallest element',
          'Time complexity: O(n log k), Space complexity: O(log k)'
        ],
        expectedSkills: ['Divide and Conquer', 'Merge Sort', 'Heap', 'Linked List Merging']
      },

      {
        id: 'dsa_010',
        title: 'Word Ladder',
        description: `A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:

- Every adjacent pair of words differs by a single letter.
- Every si for 1 <= i <= k is in wordList. Note that beginWord does not need to be in wordList.
- sk == endWord

Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.

Example:
Input: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
Output: 5
Explanation: One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.`,
        difficulty: 'hard',
        category: 'graph',
        timeLimit: 45,
        testCases: [
          { input: { beginWord: "hit", endWord: "cog", wordList: ["hot", "dot", "dog", "lot", "log", "cog"] }, expected: 5 },
          { input: { beginWord: "hit", endWord: "cog", wordList: ["hot", "dot", "dog", "lot", "log"] }, expected: 0 },
          { input: { beginWord: "a", endWord: "c", wordList: ["a", "b", "c"] }, expected: 2 }
        ],
        hints: [
          'Use BFS to find shortest path',
          'Build a graph where words differ by one character',
          'Use bidirectional BFS for optimization',
          'Time complexity: O(M²×N), Space complexity: O(M²×N)'
        ],
        expectedSkills: ['BFS', 'Graph Construction', 'Shortest Path', 'String Manipulation']
      },

      {
        id: 'dsa_011',
        title: 'Serialize and Deserialize Binary Tree',
        description: `Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.

Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.

Example:
Input: root = [1,2,3,null,null,4,5]
Output: [1,2,3,null,null,4,5]`,
        difficulty: 'hard',
        category: 'tree',
        timeLimit: 50,
        testCases: [
          { input: { root: [1, 2, 3, null, null, 4, 5] }, expected: [1, 2, 3, null, null, 4, 5] },
          { input: { root: [] }, expected: [] },
          { input: { root: [1] }, expected: [1] },
          { input: { root: [1, 2] }, expected: [1, 2] }
        ],
        hints: [
          'Use preorder traversal for serialization',
          'Use recursion for deserialization',
          'Handle null values properly',
          'Time complexity: O(n), Space complexity: O(n)'
        ],
        expectedSkills: ['Tree Traversal', 'Serialization', 'Recursion', 'String Processing']
      },

      {
        id: 'dsa_012',
        title: 'Sliding Window Maximum',
        description: `You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window.

Example:
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]

Input: nums = [1], k = 1
Output: [1]`,
        difficulty: 'hard',
        category: 'array',
        timeLimit: 40,
        testCases: [
          { input: { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 }, expected: [3, 3, 5, 5, 6, 7] },
          { input: { nums: [1], k: 1 }, expected: [1] },
          { input: { nums: [1, -1], k: 1 }, expected: [1, -1] },
          { input: { nums: [9, 11], k: 2 }, expected: [11] }
        ],
        hints: [
          'Use a deque to maintain indices of elements in decreasing order',
          'Remove indices of elements outside current window',
          'The front of deque always contains index of maximum element',
          'Time complexity: O(n), Space complexity: O(k)'
        ],
        expectedSkills: ['Deque', 'Sliding Window', 'Monotonic Queue', 'Array Processing']
      }
    ]
  }

  initializeHRQuestions() {
    return [
      {
        id: 'hr_001',
        title: 'Tell me about yourself',
        description: 'Walk me through your professional background, key achievements, and what drives you in your career.',
        difficulty: 'easy',
        category: 'hr',
        timeLimit: 5,
        testCases: [],
        hints: [
          'Start with your current role and work backwards',
          'Highlight relevant experience for the position',
          'Include key achievements with metrics',
          'Keep it concise (2-3 minutes)'
        ],
        expectedSkills: ['Communication', 'Self-awareness', 'Professional Storytelling']
      },
      {
        id: 'hr_002',
        title: 'Why do you want to work here?',
        description: 'What attracts you to our company and this specific role? How do you see yourself contributing?',
        difficulty: 'easy',
        category: 'hr',
        timeLimit: 3,
        testCases: [],
        hints: [
          'Research the company culture and values',
          'Connect your skills to their needs',
          'Show genuine interest in their mission',
          'Mention specific aspects that excite you'
        ],
        expectedSkills: ['Research', 'Motivation', 'Cultural Fit']
      },
      {
        id: 'hr_003',
        title: 'Describe a challenging project',
        description: 'Tell me about a difficult project you worked on. What made it challenging and how did you overcome the obstacles?',
        difficulty: 'medium',
        category: 'hr',
        timeLimit: 5,
        testCases: [],
        hints: [
          'Use the STAR method (Situation, Task, Action, Result)',
          'Focus on your problem-solving approach',
          'Highlight leadership and teamwork',
          'Quantify the impact when possible'
        ],
        expectedSkills: ['Problem Solving', 'Leadership', 'Communication', 'Project Management']
      },
      {
        id: 'hr_004',
        title: 'How do you handle failure?',
        description: 'Can you share an example of when you failed at something important? How did you respond and what did you learn?',
        difficulty: 'medium',
        category: 'hr',
        timeLimit: 4,
        testCases: [],
        hints: [
          'Choose a real but not catastrophic failure',
          'Focus on the learning and growth',
          'Show resilience and adaptability',
          'Demonstrate how you applied lessons learned'
        ],
        expectedSkills: ['Resilience', 'Self-reflection', 'Growth Mindset']
      },
      {
        id: 'hr_005',
        title: 'Where do you see yourself in 5 years?',
        description: 'What are your career goals and how does this role fit into your long-term plans?',
        difficulty: 'medium',
        category: 'hr',
        timeLimit: 3,
        testCases: [],
        hints: [
          'Show ambition but be realistic',
          'Connect to the role and company growth',
          'Mention skill development goals',
          'Show commitment to the field'
        ],
        expectedSkills: ['Career Planning', 'Goal Setting', 'Vision']
      },
      {
        id: 'hr_006',
        title: 'Describe your ideal work environment',
        description: 'What type of work environment brings out your best performance? How do you prefer to collaborate?',
        difficulty: 'easy',
        category: 'hr',
        timeLimit: 3,
        testCases: [],
        hints: [
          'Be honest about your preferences',
          'Mention both collaborative and independent work',
          'Show adaptability to different environments',
          'Connect to company culture if possible'
        ],
        expectedSkills: ['Self-awareness', 'Cultural Fit', 'Communication']
      }
    ]
  }

  initializeTechnicalQuestions() {
    return [
      {
        id: 'tech_001',
        title: 'Explain RESTful APIs',
        description: 'What are RESTful APIs? Explain the principles, HTTP methods, and how you would design a RESTful service.',
        difficulty: 'medium',
        category: 'technical',
        timeLimit: 10,
        testCases: [],
        hints: [
          'REST = Representational State Transfer',
          'Stateless, client-server architecture',
          'HTTP methods: GET, POST, PUT, DELETE',
          'Resource-based URLs'
        ],
        expectedSkills: ['API Design', 'Web Services', 'HTTP Protocol']
      },
      {
        id: 'tech_002',
        title: 'Database Normalization',
        description: 'Explain database normalization. What are the different normal forms and why are they important?',
        difficulty: 'medium',
        category: 'technical',
        timeLimit: 8,
        testCases: [],
        hints: [
          '1NF: Atomic values, no repeating groups',
          '2NF: No partial dependencies',
          '3NF: No transitive dependencies',
          'Reduces redundancy and improves data integrity'
        ],
        expectedSkills: ['Database Design', 'Data Modeling', 'SQL']
      },
      {
        id: 'tech_003',
        title: 'System Design: URL Shortener',
        description: 'Design a URL shortener service like bit.ly. Consider scalability, database design, and API endpoints.',
        difficulty: 'hard',
        category: 'technical',
        timeLimit: 20,
        testCases: [],
        hints: [
          'Start with basic requirements',
          'Consider hash functions for short URLs',
          'Database schema for URL mapping',
          'Caching and load balancing for scale'
        ],
        expectedSkills: ['System Design', 'Scalability', 'Database Design', 'Caching']
      },
      {
        id: 'tech_004',
        title: 'Explain OOP Principles',
        description: 'What are the four pillars of Object-Oriented Programming? Provide examples of each.',
        difficulty: 'easy',
        category: 'technical',
        timeLimit: 8,
        testCases: [],
        hints: [
          'Encapsulation: Data hiding',
          'Inheritance: Code reuse',
          'Polymorphism: Multiple forms',
          'Abstraction: Simplifying complexity'
        ],
        expectedSkills: ['OOP', 'Programming Concepts', 'Software Design']
      },
      {
        id: 'tech_005',
        title: 'Microservices vs Monolith',
        description: 'Compare microservices and monolithic architectures. What are the trade-offs and when would you use each?',
        difficulty: 'medium',
        category: 'technical',
        timeLimit: 10,
        testCases: [],
        hints: [
          'Monolith: Single deployable unit',
          'Microservices: Independent services',
          'Consider team size, complexity, deployment',
          'Trade-offs: complexity vs scalability'
        ],
        expectedSkills: ['Architecture', 'System Design', 'Scalability']
      },
      {
        id: 'tech_006',
        title: 'Security Best Practices',
        description: 'What are the most important security practices for web applications? How would you prevent common vulnerabilities?',
        difficulty: 'medium',
        category: 'technical',
        timeLimit: 12,
        testCases: [],
        hints: [
          'Input validation and sanitization',
          'Authentication and authorization',
          'HTTPS, secure headers',
          'OWASP Top 10 vulnerabilities'
        ],
        expectedSkills: ['Security', 'Web Development', 'Best Practices']
      },
      {
        id: 'tech_007',
        title: 'Caching Strategies',
        description: 'Explain different caching strategies. When would you use each type and what are the trade-offs?',
        difficulty: 'medium',
        category: 'technical',
        timeLimit: 10,
        testCases: [],
        hints: [
          'Browser caching, CDN, application cache',
          'Cache-aside, write-through, write-behind',
          'Consider consistency vs performance',
          'Cache invalidation strategies'
        ],
        expectedSkills: ['Caching', 'Performance', 'System Design']
      },
      {
        id: 'tech_008',
        title: 'Load Balancing',
        description: 'How does load balancing work? Explain different algorithms and when to use each.',
        difficulty: 'hard',
        category: 'technical',
        timeLimit: 12,
        testCases: [],
        hints: [
          'Round-robin, weighted, least connections',
          'Layer 4 vs Layer 7 load balancing',
          'Health checks and failover',
          'Session affinity considerations'
        ],
        expectedSkills: ['Load Balancing', 'Networking', 'Scalability']
      }
    ]
  }

  // Get all questions by type
  getDSAQuestions() {
    return this.dsaQuestions
  }

  getHRQuestions() {
    return this.hrQuestions
  }

  getTechnicalQuestions() {
    return this.technicalQuestions
  }

  // Get mixed questions from all categories
  getMixedQuestions(count = 15) {
    const dsaCount = Math.ceil(count * 0.5) // 50% DSA
    const hrCount = Math.ceil(count * 0.25) // 25% HR
    const techCount = count - dsaCount - hrCount // 25% Technical

    const dsaQuestions = this.getRandomQuestions(this.dsaQuestions, dsaCount)
    const hrQuestions = this.getRandomQuestions(this.hrQuestions, hrCount)
    const techQuestions = this.getRandomQuestions(this.technicalQuestions, techCount)

    return [...dsaQuestions, ...hrQuestions, ...techQuestions].sort(() => 0.5 - Math.random())
  }

  // Helper method to get random questions from a category
  getRandomQuestions(questions, count) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  // Get questions by difficulty
  getQuestionsByDifficulty(difficulty) {
    const allQuestions = [...this.dsaQuestions, ...this.hrQuestions, ...this.technicalQuestions]
    return allQuestions.filter(q => q.difficulty === difficulty)
  }

  // Get questions by category
  getQuestionsByCategory(category) {
    const allQuestions = [...this.dsaQuestions, ...this.hrQuestions, ...this.technicalQuestions]
    return allQuestions.filter(q => q.category === category)
  }

  // Get question by ID
  getQuestionById(id) {
    const allQuestions = [...this.dsaQuestions, ...this.hrQuestions, ...this.technicalQuestions]
    return allQuestions.find(q => q.id === id)
  }

  // Get all questions
  getAllQuestions() {
    return [...this.dsaQuestions, ...this.hrQuestions, ...this.technicalQuestions]
  }

  // Get question count by difficulty
  getQuestionStats() {
    const allQuestions = this.getAllQuestions()
    return {
      total: allQuestions.length,
      dsa: this.dsaQuestions.length,
      hr: this.hrQuestions.length,
      technical: this.technicalQuestions.length,
      easy: this.getQuestionsByDifficulty('easy').length,
      medium: this.getQuestionsByDifficulty('medium').length,
      hard: this.getQuestionsByDifficulty('hard').length,
      categories: {
        dsa: this.dsaQuestions.length,
        hr: this.hrQuestions.length,
        technical: this.technicalQuestions.length,
        array: this.getQuestionsByCategory('array').length,
        linkedlist: this.getQuestionsByCategory('linkedlist').length,
        tree: this.getQuestionsByCategory('tree').length,
        graph: this.getQuestionsByCategory('graph').length,
        string: this.getQuestionsByCategory('string').length,
        stack: this.getQuestionsByCategory('stack').length
      }
    }
  }
}

export const interviewQuestionsService = new InterviewQuestionsService()
