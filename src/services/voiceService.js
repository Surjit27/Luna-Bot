class VoiceService {
  constructor() {
    this.synthesis = window.speechSynthesis
    this.recognition = null
    this.isListening = false
    this.settings = {
      enabled: false,
      language: 'en-US',
      rate: 1,
      pitch: 1,
      volume: 1
    }
    this.initSpeechRecognition()
  }

  initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition()
    } else if ('SpeechRecognition' in window) {
      this.recognition = new SpeechRecognition()
    }

    if (this.recognition) {
      this.recognition.continuous = false
      this.recognition.interimResults = false
      this.recognition.lang = this.settings.language

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        this.onTranscript(transcript)
      }

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        this.isListening = false
      }

      this.recognition.onend = () => {
        this.isListening = false
      }
    }
  }

  speak(text, options = {}) {
    if (!this.settings.enabled || !this.synthesis) return

    // Cancel any ongoing speech
    this.synthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = options.rate || this.settings.rate
    utterance.pitch = options.pitch || this.settings.pitch
    utterance.volume = options.volume || this.settings.volume
    utterance.lang = options.language || this.settings.language

    // Select a voice
    const voices = this.synthesis.getVoices()
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.includes('Google')
    ) || voices.find(voice => voice.lang.startsWith('en'))
    
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onstart = () => {
      console.log('Speech started')
    }

    utterance.onend = () => {
      console.log('Speech ended')
    }

    utterance.onerror = (event) => {
      console.error('Speech error:', event.error)
    }

    this.synthesis.speak(utterance)
  }

  startListening() {
    if (!this.recognition || this.isListening) return

    this.recognition.lang = this.settings.language
    this.recognition.start()
    this.isListening = true
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings }
    
    if (this.recognition) {
      this.recognition.lang = this.settings.language
    }
  }

  speakQuestion(question) {
    const text = `
      Question: ${question.title}
      ${question.description}
      Time limit: ${question.timeLimit} minutes
    `
    this.speak(text)
  }

  speakFeedback(feedback) {
    this.speak(`Feedback: ${feedback}`)
  }

  speakTimerWarning(timeRemaining) {
    if (timeRemaining === 300) { // 5 minutes
      this.speak("5 minutes remaining")
    } else if (timeRemaining === 60) { // 1 minute
      this.speak("1 minute remaining")
    } else if (timeRemaining === 30) { // 30 seconds
      this.speak("30 seconds remaining")
    }
  }

  speakInstructions() {
    const instructions = `
      Welcome to the Technical Interview Bot. 
      You can use voice commands to navigate.
      Say "start interview" to begin,
      "next question" to move to the next question,
      "submit answer" to submit your response,
      and "end interview" to finish.
    `
    this.speak(instructions)
  }

  onTranscript(transcript) {
    const command = transcript.toLowerCase().trim()
    
    switch (command) {
      case 'start interview':
        this.onCommand('start')
        break
      case 'next question':
        this.onCommand('next')
        break
      case 'submit answer':
        this.onCommand('submit')
        break
      case 'end interview':
        this.onCommand('end')
        break
      case 'speak question':
        this.onCommand('speak')
        break
      default:
        // Handle as text input
        this.onTextInput(transcript)
    }
  }

  onCommand(command) {
    // This will be set by the component using the service
    if (this.commandHandler) {
      this.commandHandler(command)
    }
  }

  onTextInput(text) {
    // This will be set by the component using the service
    if (this.textHandler) {
      this.textHandler(text)
    }
  }

  setCommandHandler(handler) {
    this.commandHandler = handler
  }

  setTextHandler(handler) {
    this.textHandler = handler
  }

  isSupported() {
    return 'speechSynthesis' in window && 
           ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  }

  getAvailableVoices() {
    return this.synthesis.getVoices()
  }

  pause() {
    this.synthesis.pause()
  }

  resume() {
    this.synthesis.resume()
  }

  stop() {
    this.synthesis.cancel()
  }
}

export const voiceService = new VoiceService()
