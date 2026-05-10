import { useState } from 'react'
import './WelcomeScreen.css'

const GRADE_OPTIONS = [
  { value: 1, label: 'Grade 1', emoji: '🌱', desc: 'Just starting!' },
  { value: 2, label: 'Grade 2', emoji: '🌿', desc: 'Getting better!' },
  { value: 3, label: 'Grade 3', emoji: '🌳', desc: 'Growing strong!' },
  { value: 4, label: 'Grade 4', emoji: '⭐', desc: 'Leveling up!' },
  { value: 5, label: 'Grade 5', emoji: '🌟', desc: 'Almost pro!' },
  { value: 6, label: 'Grade 6+', emoji: '🏆', desc: 'Math champion!' },
]

export default function WelcomeScreen({ onStart }) {
  const [name, setName] = useState('')
  const [grade, setGrade] = useState(null)
  const [step, setStep] = useState(1) // 1: name, 2: grade
  const [nameError, setNameError] = useState('')

  const handleNameNext = () => {
    if (!name.trim()) {
      setNameError('Please enter your name! 😊')
      return
    }
    setNameError('')
    setStep(2)
  }

  const handleGradeSelect = (g) => {
    setGrade(g)
  }

  const handleStart = () => {
    if (!grade) return
    onStart(name.trim(), grade)
  }

  return (
    <div className="welcome-screen">
      {/* Floating background shapes */}
      <div className="bg-shapes">
        {['🌟','⭐','✨','💫','🎈','🎉','🌈','🦋','🌸'].map((emoji, i) => (
          <span key={i} className={`bg-shape bg-shape-${i}`}>{emoji}</span>
        ))}
      </div>

      <div className="welcome-content">
        {/* Header */}
        <div className="welcome-header">
          <div className="mascot">🦉</div>
          <h1 className="welcome-title">
            Maryam<br />
            <span className="title-highlight">Math Teacher</span>
          </h1>
          <p className="welcome-tagline">✨ Learn Math. Love Math. Live Math! ✨</p>
        </div>

        {/* Card */}
        <div className="welcome-card">
          {step === 1 && (
            <div className="step-content" key="step1">
              <h2 className="step-title">🦉 Hello there, superstar!</h2>
              <p className="step-desc">What\'s your name? I\'m Mia, your math owl! 🌟</p>
              <input
                type="text"
                className="name-input"
                placeholder="Type your name here... 😊"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNameNext()}
                maxLength={30}
                autoFocus
              />
              {nameError && <p className="input-error">{nameError}</p>}
              <button className="btn-primary welcome-btn" onClick={handleNameNext}>
                Next ➡️
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="step-content" key="step2">
              <h2 className="step-title">🎒 Hi, {name}! What grade are you in?</h2>
              <p className="step-desc">Pick your grade so I can teach you the right things!</p>
              <div className="grade-grid">
                {GRADE_OPTIONS.map((g) => (
                  <button
                    key={g.value}
                    className={`grade-btn ${grade === g.value ? 'grade-btn-selected' : ''}`}
                    onClick={() => handleGradeSelect(g.value)}
                  >
                    <span className="grade-emoji">{g.emoji}</span>
                    <span className="grade-label">{g.label}</span>
                    <span className="grade-desc">{g.desc}</span>
                  </button>
                ))}
              </div>
              <div className="step-actions">
                <button className="btn-secondary" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button
                  className="btn-primary welcome-btn"
                  onClick={handleStart}
                  disabled={!grade}
                  style={{ opacity: grade ? 1 : 0.5 }}
                >
                  Let\'s Start! 🚀
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="features-row">
          {[
            { emoji: '🎮', text: 'Fun Games' },
            { emoji: '🏆', text: 'Win Stars' },
            { emoji: '📚', text: '6 Topics' },
            { emoji: '💡', text: 'Smart Hints' },
          ].map((f) => (
            <div key={f.text} className="feature-badge">
              <span>{f.emoji}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
