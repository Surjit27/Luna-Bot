# Interview Bot - AI-Powered Technical Interview Assistant

A comprehensive interview bot designed for computer technical interviews, including Data Structures and Algorithms (DSA) and compiler-related questions. The bot generates personalized questions based on resume analysis and provides detailed analytics.

## Features

- 📄 **Resume Upload & Analysis**: Upload PDF/TXT resumes and get AI-powered analysis
- 🎯 **Personalized Questions**: Generate interview questions based on candidate's skills and experience
- 🎤 **Voice Integration**: Voice-readable design with speech synthesis and recognition
- 📊 **Analytics Dashboard**: Comprehensive analytics with charts and insights
- 📥 **CSV Export**: Export interview data and results to CSV
- 🤖 **AI Evaluation**: Automated answer evaluation using Google Gemini
- 🔄 **RAG System**: Retrieval-Augmented Generation for contextual question generation

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Create a `.env` file in the root directory:

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage Flow

1. **Upload Resume**: Upload a candidate's resume (PDF or TXT format)
2. **Resume Analysis**: AI analyzes the resume to extract skills, experience, and qualifications
3. **Generate Questions**: Personalized interview questions are generated based on the analysis
4. **Conduct Interview**: Interactive interview interface with voice support
5. **Evaluation**: AI evaluates answers and provides feedback
6. **Analytics**: View comprehensive analytics and export data

## Components

- **ResumeUpload**: Handles resume upload and analysis
- **InterviewInterface**: Main interview interface with voice support
- **AnalyticsDashboard**: Analytics and data visualization
- **Navigation**: App navigation

## Services

- **geminiService**: Google Gemini AI integration for question generation and evaluation
- **ragService**: Retrieval-Augmented Generation system
- **voiceService**: Voice synthesis and recognition
- **exportService**: CSV export functionality

## Technologies Used

- React 18
- Vite
- Bootstrap/Reactstrap
- Google Gemini AI
- Web Speech API
- Local Storage for data persistence

## API Integration

The application integrates with Google Gemini AI for:
- Resume analysis and skill extraction
- Personalized question generation
- Answer evaluation and feedback
- Hint generation

## Voice Features

- Text-to-speech for questions and feedback
- Speech-to-text for voice input
- Voice commands for navigation
- Configurable voice settings

## Analytics Features

- Session tracking and statistics
- Performance metrics
- Skill-based analysis
- Score distribution
- CSV export functionality

## Browser Support

- Modern browsers with Web Speech API support
- Chrome (recommended for voice features)
- Firefox, Safari, Edge

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

ISC
