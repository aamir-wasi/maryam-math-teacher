import { TOPICS } from '../data/lessons'
import './Dashboard.css'

export default function Dashboard({ childName, grade, topicStars, totalStars, onSelectTopic, onReset }) {
  const totalPossibleStars = TOPICS.length * 3

  return (
    <div className="dashboard">
      {/* Top bar */}
      <div className="dash-topbar">
        <div className="dash-greeting">
          <span className="mascot-small">🦉</span>
          <div>
            <div className="dash-hello">Hello, {childName}! 👋</div>
            <div className="dash-subtitle">Ready to learn math today?</div>
          </div>
        </div>
        <div className="dash-stars-total">
          <span className="stars-icon">⭐</span>
          <span className="stars-count">{totalStars} / {totalPossibleStars}</span>
          <button className="reset-btn" onClick={onReset} title="Switch user">
            🔄
          </button>
        </div>
      </div>

      {/* Progress strip */}
      <div className="dash-progress-strip">
        <div className="progress-label">Overall Progress</div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${(totalStars / totalPossibleStars) * 100}%` }}
          />
        </div>
        <div className="progress-percent">{Math.round((totalStars / totalPossibleStars) * 100)}%</div>
      </div>

      {/* Topic grid */}
      <div className="dash-content">
        <h2 className="dash-section-title">📚 Choose Your Lesson</h2>
        <div className="topics-grid">
          {TOPICS.map((topic, index) => {
            const stars = topicStars[topic.id] || 0
            const isCompleted = stars > 0
            const isLocked = false // Allow all topics

            return (
              <button
                key={topic.id}
                className={`topic-card ${isCompleted ? 'topic-completed' : ''} ${isLocked ? 'topic-locked' : ''}`}
                style={{ '--topic-gradient': topic.bgGradient }}
                onClick={() => !isLocked && onSelectTopic(topic.id)}
                disabled={isLocked}
              >
                <div className="topic-number">#{index + 1}</div>
                <div className="topic-icon">{topic.icon}</div>
                <div className="topic-info">
                  <div className="topic-title">{topic.title}</div>
                  <div className="topic-subtitle">{topic.subtitle}</div>
                  <div className="topic-grade">Grade {topic.grade}+</div>
                </div>
                <div className="topic-stars">
                  {[1, 2, 3].map((s) => (
                    <span key={s} className={`star ${s <= stars ? 'earned' : 'empty'}`}>
                      {s <= stars ? '⭐' : '☆'}
                    </span>
                  ))}
                </div>
                {isCompleted && <div className="topic-badge">✅</div>}
                <div className="topic-arrow">➡️</div>
              </button>
            )
          })}
        </div>

        {/* Fun fact banner */}
        <div className="fun-fact-banner">
          <span className="mascot-small">🦉</span>
          <p>
            <strong>Mia says:</strong> &quot;Math is like a superpower! The more you practice, the stronger you get! 💪&quot;
          </p>
        </div>
      </div>
    </div>
  )
}
