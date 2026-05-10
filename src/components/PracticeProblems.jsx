import { useState } from 'react'
import { getTopicById } from '../data/lessons'
import { getCorrectMessage, getWrongMessage, playSound } from '../utils/helpers'
import './PracticeProblems.css'

export default function PracticeProblems({ topicId, onComplete, onBack, childName }) {
  const topic = getTopicById(topicId)
  const problems = topic?.practice || []

  const [currentIdx, setCurrentIdx] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)
  const [feedback, setFeedback] = useState(null) // null | 'correct' | 'wrong'
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [animKey, setAnimKey] = useState(0)

  const problem = problems[currentIdx]
  const progress = ((currentIdx) / problems.length) * 100

  const checkAnswer = () => {
    if (!problem) return
    const userAnswer = problem.type === 'multiple-choice' ? selectedOption : inputValue.trim()
    if (!userAnswer) return

    setAttempts(a => a + 1)
    const isCorrect = userAnswer.toLowerCase() === problem.answer.toLowerCase()

    if (isCorrect) {
      setFeedback('correct')
      setFeedbackMsg(getCorrectMessage())
      setCorrectCount(c => c + 1)
      playSound('correct')
      setShowExplanation(true)
    } else {
      setFeedback('wrong')
      setFeedbackMsg(getWrongMessage())
      playSound('wrong')
    }
  }

  const handleNext = () => {
    if (currentIdx < problems.length - 1) {
      setCurrentIdx(i => i + 1)
      setInputValue('')
      setSelectedOption(null)
      setFeedback(null)
      setFeedbackMsg('')
      setShowHint(false)
      setShowExplanation(false)
      setAttempts(0)
      setAnimKey(k => k + 1)
    } else {
      onComplete()
    }
  }

  if (!problem) return null

  return (
    <div className="practice-view">
      {/* Feedback toast */}
      {feedback && (
        <div className={`feedback-toast ${feedback}`} key={feedbackMsg}>
          {feedbackMsg}
        </div>
      )}

      {/* Top bar */}
      <div className="practice-topbar">
        <button className="btn-secondary back-btn" onClick={onBack}>
          ← Lesson
        </button>
        <div className="practice-topic-label">
          <span>{topic.icon}</span>
          <span>Practice Time! 🎯</span>
        </div>
        <div className="practice-score">
          ✅ {correctCount} / {problems.length}
        </div>
      </div>

      {/* Progress */}
      <div className="lesson-progress-bar">
        <div className="lesson-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Main content */}
      <div className="practice-content">
        {/* Mascot encouragement */}
        <div className="practice-mascot-row">
          <span className="mascot-small">🦉</span>
          <div className="practice-speech">
            {feedback === 'correct'
              ? `Amazing ${childName}! You got it! 🎉`
              : feedback === 'wrong'
              ? `Don't give up ${childName}! You can do it! 💪`
              : `Problem ${currentIdx + 1} of ${problems.length} — Let's go ${childName}! 🚀`}
          </div>
        </div>

        {/* Problem card */}
        <div className="problem-card" key={animKey}>
          <div className="problem-number">Problem {currentIdx + 1} / {problems.length}</div>
          <h3 className="problem-question">{problem.question}</h3>

          {/* Visual */}
          {problem.visual && (
            <div className="problem-visual">
              <pre className="problem-visual-text">{problem.visual}</pre>
            </div>
          )}

          {/* Answer area */}
          {problem.type === 'multiple-choice' && !showExplanation && (
            <div className="options-grid">
              {problem.options.map((opt) => (
                <button
                  key={opt}
                  className={`option-btn 
                    ${selectedOption === opt ? 'option-selected' : ''}
                    ${feedback === 'correct' && opt === problem.answer ? 'option-correct' : ''}
                    ${feedback === 'wrong' && selectedOption === opt ? 'option-wrong' : ''}
                  `}
                  onClick={() => {
                    if (!feedback) {
                      setSelectedOption(opt)
                    }
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {problem.type === 'number-input' && !showExplanation && (
            <div className="input-answer-area">
              <input
                type="number"
                className="answer-input"
                placeholder="Type your answer..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !feedback && checkAnswer()}
                disabled={!!feedback}
                autoFocus
              />
            </div>
          )}

          {/* Hint */}
          {!feedback && (
            <button
              className="hint-btn"
              onClick={() => setShowHint(h => !h)}
            >
              {showHint ? '🔒 Hide Hint' : '💡 Need a Hint?'}
            </button>
          )}

          {showHint && !feedback && (
            <div className="hint-box">
              <strong>🦉 Mia&apos;s Hint:</strong> {problem.hint}
            </div>
          )}

          {/* Explanation after correct */}
          {showExplanation && (
            <div className="explanation-box">
              <strong>✅ Explanation:</strong> {problem.explanation}
            </div>
          )}

          {/* Action buttons */}
          <div className="problem-actions">
            {!feedback ? (
              <button
                className="btn-primary check-btn"
                onClick={checkAnswer}
                disabled={problem.type === 'multiple-choice' ? !selectedOption : !inputValue.trim()}
              >
                Check Answer ✅
              </button>
            ) : (
              <button className="btn-success next-problem-btn" onClick={handleNext}>
                {currentIdx < problems.length - 1 ? 'Next Problem ➡️' : 'Take the Quiz! 🏆'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
