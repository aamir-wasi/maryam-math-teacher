import { getTopicById } from '../data/lessons'
import './LessonView.css'

export default function LessonView({ topicId, currentSlide, setCurrentSlide, onComplete, onBack, childName }) {
  const topic = getTopicById(topicId)
  if (!topic) return null

  const slides = topic.slides
  const totalSlides = slides.length
  const slide = slides[currentSlide]
  const progress = ((currentSlide + 1) / totalSlides) * 100

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onComplete()
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    } else {
      onBack()
    }
  }

  return (
    <div className="lesson-view" style={{ '--topic-gradient': topic.bgGradient }}>
      {/* Top bar */}
      <div className="lesson-topbar">
        <button className="btn-secondary back-btn" onClick={handlePrev}>
          ← Back
        </button>
        <div className="lesson-topic-label">
          <span>{topic.icon}</span>
          <span>{topic.title}</span>
        </div>
        <div className="lesson-slide-count">
          {currentSlide + 1} / {totalSlides}
        </div>
      </div>

      {/* Progress bar */}
      <div className="lesson-progress-bar">
        <div className="lesson-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Main content */}
      <div className="lesson-content">
        <div className="lesson-card" key={currentSlide}>
          {/* Slide header */}
          <div className="lesson-slide-header" style={{ background: topic.bgGradient }}>
            <div className="lesson-mascot-row">
              <span className="mascot-small">🦉</span>
              <div className="lesson-speech-bubble">
                <p>Hi {childName}! Let&apos;s learn something amazing today! 🌟</p>
              </div>
            </div>
            <h2 className="lesson-slide-title">{slide.title}</h2>
          </div>

          {/* Story */}
          <div className="lesson-section">
            <div className="lesson-section-label">📖 Story Time</div>
            <div className="lesson-story-box">
              {slide.story}
            </div>
          </div>

          {/* Visual */}
          {slide.visual && (
            <div className="lesson-section">
              <div className="lesson-section-label">👀 Let&apos;s See!</div>
              <div className="lesson-visual-box">
                <pre className="lesson-visual-text">{slide.visual}</pre>
              </div>
            </div>
          )}

          {/* Explanation */}
          <div className="lesson-section">
            <div className="lesson-section-label">💡 Remember This!</div>
            <div className="lesson-explanation-box">
              {slide.explanation}
            </div>
          </div>

          {/* Tip */}
          {slide.tip && (
            <div className="lesson-tip-box">
              {slide.tip}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="lesson-nav">
          {/* Dot indicators */}
          <div className="slide-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`slide-dot ${i === currentSlide ? 'slide-dot-active' : ''}`}
                onClick={() => setCurrentSlide(i)}
              />
            ))}
          </div>

          <button
            className="btn-primary lesson-next-btn"
            onClick={handleNext}
          >
            {currentSlide < totalSlides - 1 ? 'Next Slide ➡️' : 'Start Practice! 🎯'}
          </button>
        </div>
      </div>
    </div>
  )
}
