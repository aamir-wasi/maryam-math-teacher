import { useState } from 'react'
import { getTopicById } from '../data/lessons'
import { playSound } from '../utils/helpers'
import './QuizScreen.css'

export default function QuizScreen({ topicId, onComplete, onBack, childName }) {
  const topic = getTopicById(topicId)
  const questions = topic?.quiz || []

  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [answers, setAnswers] = useState([])
  const [animKey, setAnimKey] = useState(0)

  const question = questions[currentIdx]
  const progress = ((currentIdx) / questions.length) * 100
  const isLastQuestion = currentIdx === questions.length - 1

  const handleSelect = (opt) => {
    if (answered) return
    setSelected(opt)
  }

  const handleSubmit = () => {
    if (!selected || answered) return
    const isCorrect = selected.toLowerCase() === question.answer.toLowerCase()
    setAnswered(true)
    const updatedAnswers = [...answers, { question: question.question, selected, correct: question.answer, isCorrect }]
    setAnswers(updatedAnswers)
    if (isCorrect) {
      setCorrectAnswers(c => c + 1)
      playSound('correct')
    } else {
      playSound('wrong')
    }
  }

  const handleNext = () => {
    if (isLastQuestion) {
      const finalScore = Math.round(((correctAnswers + (selected === question.answer ? 1 : 0)) / questions.length) * 100)
      const finalCorrect = correctAnswers + (answers[answers.length - 1]?.isCorrect ? 0 : 0)
      const score = Math.round((correctAnswers / questions.length) * 100)
      playSound('complete')
      onComplete(score, answers)
    } else {
      setCurrentIdx(i => i + 1)
      setSelected(null)
      setAnswered(false)
      setAnimKey(k => k + 1)
    }
  }

  if (!question) return null

  return (
    <div className="quiz-view">
      {/* Top bar */}
      <div className="quiz-topbar">
        <button className="btn-secondary back-btn" onClick={onBack}>
          ← Practice
        </button>
        <div className="quiz-label">
          <span>🏆</span>
          <span>Quiz Time!</span>
        </div>
        <div className="quiz-score-badge">
          ✅ {correctAnswers} / {questions.length}
        </div>
      </div>

      {/* Progress */}
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Content */}
      <div className="quiz-content">
        {/* Header */}
        <div className="quiz-header">
          <div className="quiz-q-counter">
            Question {currentIdx + 1} of {questions.length}
          </div>
          <div className="quiz-encouragement">
            {answered
              ? (selected === question.answer ? '🎉 Correct! Well done!' : '💪 Keep going!')
              : `You\'ve got this, ${childName}! 🌟`}
          </div>
        </div>

        {/* Question card */}
        <div className="quiz-card" key={animKey}>
          <div className="quiz-mascot-row">
            <span className="mascot-small">🦉</span>
            <div className="quiz-q-number">Q{currentIdx + 1}</div>
          </div>
          <h3 className="quiz-question">{question.question}</h3>

          {/* Visual */}
          {question.visual && (
            <div className="quiz-visual">
              <pre className="quiz-visual-text">{question.visual}</pre>
            </div>
          )}

          {/* Options */}
          <div className="quiz-options-grid">
            {question.options.map((opt, i) => {
              let optClass = 'quiz-option'
              if (answered) {
                if (opt === question.answer) optClass += ' quiz-option-correct'
                else if (opt === selected && opt !== question.answer) optClass += ' quiz-option-wrong'
                else optClass += ' quiz-option-disabled'
              } else if (selected === opt) {
                optClass += ' quiz-option-selected'
              }
              return (
                <button
                  key={opt}
                  className={optClass}
                  onClick={() => handleSelect(opt)}
                >
                  <span className="quiz-option-letter">{String.fromCharCode(65 + i)}</span>
                  <span className="quiz-option-text">{opt}</span>
                  {answered && opt === question.answer && <span className="quiz-option-check">✅</span>}
                  {answered && opt === selected && opt !== question.answer && <span className="quiz-option-x">❌</span>}
                </button>
              )
            })}
          </div>

          {/* Answer feedback */}
          {answered && (
            <div className={`quiz-answer-feedback ${selected === question.answer ? 'correct-fb' : 'wrong-fb'}`}>
              {selected === question.answer
                ? `🌟 Correct! The answer is "${question.answer}"!`
                : `The correct answer is "${question.answer}". Don't worry, keep learning! 💪`}
            </div>
          )}

          {/* Actions */}
          <div className="quiz-actions">
            {!answered ? (
              <button
                className="btn-primary quiz-submit-btn"
                onClick={handleSubmit}
                disabled={!selected}
                style={{ opacity: selected ? 1 : 0.5 }}
              >
                Submit Answer ✅
              </button>
            ) : (
              <button className="btn-success quiz-next-btn" onClick={handleNext}>
                {isLastQuestion ? 'See My Results! 🏆' : 'Next Question ➡️'}
              </button>
            )}
          </div>
        </div>

        {/* Progress dots */}
        <div className="quiz-dots">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`quiz-dot ${i < currentIdx ? 'quiz-dot-done' : i === currentIdx ? 'quiz-dot-current' : 'quiz-dot-pending'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
