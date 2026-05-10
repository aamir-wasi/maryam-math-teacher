const STORAGE_KEY = 'mathTeacherProgress'

export const saveProgress = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage not available
  }
}

export const loadProgress = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const ENCOURAGEMENTS_CORRECT = [
  '🎉 Amazing! You got it right!',
  '⭐ You\'re a Math Star!',
  '🏆 Brilliant! Keep it up!',
  '🌟 Fantastic work!',
  '🎊 Correct! You\'re incredible!',
  '🦉 Mia is so proud of you!',
  '🔥 You\'re on fire! Perfect!',
  '💫 Outstanding! Well done!',
]

const ENCOURAGEMENTS_WRONG = [
  '🤔 Almost! Let\'s try again!',
  '💪 Don\'t give up! You can do it!',
  '🦉 Mia says: every mistake helps you learn!',
  '✨ Good try! Let\'s think again...',
  '🌈 No worries! Try reading the hint!',
  '💡 So close! Check the hint below!',
]

const ENCOURAGEMENTS_HINT = [
  '💡 Here\'s a little secret...',
  '🦉 Mia whispers a hint for you...',
  '🔍 Let\'s look more carefully...',
  '✨ Here\'s a clue to help you!',
]

export const getCorrectMessage = () =>
  ENCOURAGEMENTS_CORRECT[Math.floor(Math.random() * ENCOURAGEMENTS_CORRECT.length)]

export const getWrongMessage = () =>
  ENCOURAGEMENTS_WRONG[Math.floor(Math.random() * ENCOURAGEMENTS_WRONG.length)]

export const getHintMessage = () =>
  ENCOURAGEMENTS_HINT[Math.floor(Math.random() * ENCOURAGEMENTS_HINT.length)]

export const calculateStars = (score) => {
  if (score >= 80) return 3
  if (score >= 50) return 2
  return 1
}

export const playSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    if (type === 'correct') {
      oscillator.frequency.setValueAtTime(523, ctx.currentTime)
      oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.2)
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.5)
    } else if (type === 'wrong') {
      oscillator.frequency.setValueAtTime(220, ctx.currentTime)
      oscillator.frequency.setValueAtTime(180, ctx.currentTime + 0.15)
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.3)
    } else if (type === 'complete') {
      const notes = [523, 659, 784, 1047]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15)
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.3)
        osc.start(ctx.currentTime + i * 0.15)
        osc.stop(ctx.currentTime + i * 0.15 + 0.3)
      })
    }
  } catch {
    // Audio not available
  }
}
