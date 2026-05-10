import { useState, useEffect } from 'react'
import './App.css'
import WelcomeScreen from './components/WelcomeScreen'
import Dashboard from './components/Dashboard'
import LessonView from './components/LessonView'
import PracticeProblems from './components/PracticeProblems'
import QuizScreen from './components/QuizScreen'
import ResultsScreen from './components/ResultsScreen'
import { loadProgress, saveProgress } from './utils/helpers'

function App() {
  const [screen, setScreen] = useState('welcome')
  const [childName, setChildName] = useState('')
  const [grade, setGrade] = useState(1)
  const [currentTopicId, setCurrentTopicId] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [score, setScore] = useState(0)
  const [totalStars, setTotalStars] = useState(0)
  const [topicStars, setTopicStars] = useState({})
  const [quizAnswers, setQuizAnswers] = useState([])

  useEffect(() => {
    const progress = loadProgress()
    if (progress) {
      setChildName(progress.childName || '')
      setGrade(progress.grade || 1)
      setTopicStars(progress.topicStars || {})
      setTotalStars(progress.totalStars || 0)
      if (progress.childName) setScreen('dashboard')
    }
  }, [])

  const handleStart = (name, selectedGrade) => {
    setChildName(name)
    setGrade(selectedGrade)
    setScreen('dashboard')
    saveProgress({ childName: name, grade: selectedGrade, topicStars, totalStars })
  }

  const handleSelectTopic = (topicId) => {
    setCurrentTopicId(topicId)
    setCurrentSlide(0)
    setScreen('lesson')
  }

  const handleLessonComplete = () => {
    setScreen('practice')
    setCurrentSlide(0)
  }

  const handlePracticeComplete = () => {
    setScore(0)
    setQuizAnswers([])
    setScreen('quiz')
  }

  const handleQuizComplete = (finalScore, answers) => {
    setScore(finalScore)
    setQuizAnswers(answers)
    const stars = finalScore >= 80 ? 3 : finalScore >= 50 ? 2 : 1
    const newTopicStars = { ...topicStars, [currentTopicId]: Math.max(topicStars[currentTopicId] || 0, stars) }
    const newTotal = Object.values(newTopicStars).reduce((a, b) => a + b, 0)
    setTopicStars(newTopicStars)
    setTotalStars(newTotal)
    saveProgress({ childName, grade, topicStars: newTopicStars, totalStars: newTotal })
    setScreen('results')
  }

  const handleBackToDashboard = () => {
    setCurrentTopicId(null)
    setCurrentSlide(0)
    setScore(0)
    setScreen('dashboard')
  }

  const handleRetryTopic = () => {
    setCurrentSlide(0)
    setScore(0)
    setScreen('lesson')
  }

  const handleResetProgress = () => {
    setChildName('')
    setGrade(1)
    setTopicStars({})
    setTotalStars(0)
    localStorage.removeItem('mathTeacherProgress')
    setScreen('welcome')
  }

  return (
    <div className="app">
      {screen === 'welcome' && (
        <WelcomeScreen onStart={handleStart} />
      )}
      {screen === 'dashboard' && (
        <Dashboard
          childName={childName}
          grade={grade}
          topicStars={topicStars}
          totalStars={totalStars}
          onSelectTopic={handleSelectTopic}
          onReset={handleResetProgress}
        />
      )}
      {screen === 'lesson' && (
        <LessonView
          topicId={currentTopicId}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          onComplete={handleLessonComplete}
          onBack={handleBackToDashboard}
          childName={childName}
        />
      )}
      {screen === 'practice' && (
        <PracticeProblems
          topicId={currentTopicId}
          onComplete={handlePracticeComplete}
          onBack={() => setScreen('lesson')}
          childName={childName}
        />
      )}
      {screen === 'quiz' && (
        <QuizScreen
          topicId={currentTopicId}
          onComplete={handleQuizComplete}
          onBack={() => setScreen('practice')}
          childName={childName}
        />
      )}
      {screen === 'results' && (
        <ResultsScreen
          topicId={currentTopicId}
          score={score}
          topicStars={topicStars}
          totalStars={totalStars}
          childName={childName}
          onBackToDashboard={handleBackToDashboard}
          onRetry={handleRetryTopic}
        />
      )}
    </div>
  )
}

export default App
