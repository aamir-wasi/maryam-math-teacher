import { useEffect, useState } from 'react'
import { getTopicById, TOPICS } from '../data/lessons'
import { calculateStars } from '../utils/helpers'
import './ResultsScreen.css'

const CONFETTI_COLORS = ['#FFD93D', '#FF6B6B', '#6BCB77', '#6C63FF', '#FF8E53', '#4EA8DE', '#a29bfe', '#fd79a8']

function Confetti({ count = 60 }) {
  const pieces = Array.from({ length: count }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    size: 8 + Math.random() * 10,
    rotate: Math.random() * 360,
  }))

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}

const MESSAGES = {
  3: [
    '🏆 PERFECT SCORE! You\'re a Math Champion!',
    '🌟 Outstanding! You nailed every question!',
    '🎊 Incredible! You\'re a true math genius!',
  ],
  2: [
    '🌟 Great job! You\'re almost there!',
    '💪 Well done! Keep practicing to get 3 stars!',
    '🎉 Good work! You\'re getting better every day!',
  ],
  1: [
    '💪 Good try! Review the lesson and try again!',
    '🤗 Don\'t give up! Every champion started as a beginner!',
    '🌱 Great start! Practice makes perfect!',
  ],
}

export default function ResultsScreen({ topicId, score, topicStars, totalStars, childName, onBackToDashboard, onRetry }) {
  const topic = getTopicById(topicId)
  const stars = calculateStars(score)
  const [starsVisible, setStarsVisible] = useState(0)
  const messages = MESSAGES[stars]
  const message = messages[Math.floor(Math.random() * messages.length)]

  useEffect(() => {
    const timers = [
      setTimeout(() => setStarsVisible(1), 400),
      setTimeout(() => setStarsVisible(2), 700),
      setTimeout(() => setStarsVisible(3), 1000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const currentTopicIndex = TOPICS.findIndex(t => t.id === topicId)
  const nextTopic = TOPICS[currentTopicIndex + 1]

  return (
    <div className="results-view">
      {stars === 3 && <Confetti count={80} />}
      {stars === 2 && <Confetti count={40} />}

      <div className="results-content">
        {/* Header card */}
        <div className="results-header-card">
          <div className="results-mascot">🦉</div>
          <h2 className="results-title">
            {stars === 3 ? 'Woohoo!' : stars === 2 ? 'Well Done!' : 'Good Try!'}
          </h2>
          <p className="results-message">{message}</p>
        </div>

        {/* Stars card */}
        <div className="results-stars-card">
          <div className="results-topic-label">
            <span>{topic?.icon}</span>
            <span>{topic?.title}</span>
          </div>
          <div className="results-stars-row">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`results-star ${s <= starsVisible ? 'results-star-visible' : 'results-star-hidden'}`}
              >
                ⭐
              </span>
            ))}
          </div>
          <div className="results-score-display">
            <div className="results-score-number">{score}%</div>
            <div className="results-score-label">Score</div>
          </div>
          <div className="results-score-breakdown">
            {score >= 80 && '✅ Excellent — 3 Stars earned!'}
            {score >= 50 && score < 80 && '✅ Good — 2 Stars earned!'}
            {score < 50 && '⭐ 1 Star earned — Keep practicing!'}
          </div>
        </div>

        {/* Total stars card */}
        <div className="results-total-card">
          <div className="results-total-label">Your Total Stars</div>
          <div className="results-total-stars">⭐ {totalStars} Stars</div>
          <div className="results-total-bar">
            <div
              className="results-total-fill"
              style={{ width: `${(totalStars / (TOPICS.length * 3)) * 100}%` }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="results-actions">
          <button className="results-retry-btn" onClick={onRetry}>
            🔄 Try Again
          </button>
          <button className="results-dashboard-btn" onClick={onBackToDashboard}>
            🏠 Dashboard
          </button>
          {nextTopic && (
            <button
              className="results-next-btn"
              onClick={() => {
                onBackToDashboard()
                setTimeout(() => {}, 100)
              }}
            >
              Next: {nextTopic.icon} {nextTopic.title} ➡️
            </button>
          )}
        </div>

        {/* Mia's message */}
        <div className="results-mia-message">
          <span className="mascot-small">🦉</span>
          <p>
            {stars >= 2
              ? `"${childName}, you are making me so proud! Keep up the amazing work! 🌟"`
              : `"${childName}, every great mathematician started exactly where you are! Keep going! 💪"`}
          </p>
        </div>
      </div>
    </div>
  )
}
