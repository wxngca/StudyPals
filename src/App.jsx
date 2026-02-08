import { useState } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'

function ResultsPage({ match }) {
  const location = useLocation()
  const stateMatch = location.state?.match
  const finalMatch = stateMatch || match

  return (
    <section className="result-page">
      <div className="container result-card">
        {finalMatch ? (
          <div className="match-card">
            <div className="match-header">
              <div className="match-avatar">🐨</div>
              <div>
                <h3>It&apos;s a Match!</h3>
                <p className="match-subtitle">Session ready</p>
              </div>
            </div>
            <div className="match-details">
              <p>
                <strong>Buddy:</strong> {finalMatch.name}
              </p>
              <p>
                <strong>Class:</strong> {finalMatch.course}
              </p>
              <p>
                <strong>Common Slot:</strong> {finalMatch.time}
              </p>
              <p className="vibe-tag">{finalMatch.vibe}</p>
            </div>
            <button className="chat-btn">Send a hello</button>
          </div>
        ) : (
          <div className="empty-state">
            <p className="search-title">No match yet</p>
            <p className="search-subtitle">
              Submit your preferences to see results here.
            </p>
          </div>
        )}
        <Link className="secondary-btn" to="/">
          Back to home
        </Link>
      </div>
    </section>
  )
}

function HomePage({
  isSearching,
  showQuestions,
  step,
  name,
  schedule,
  courses,
  groupSize,
  difficulty,
  error,
  onFindBuddy,
  onNext,
  onBack,
  onSubmit,
  onNameChange,
  onScheduleChange,
  onCoursesChange,
  onGroupSizeChange,
  onDifficultyChange
}) {
  return (
    <>
      <section className="hero">
        <div className="container hero-simple">
          <div className="hero-copy">
            <span className="eyebrow">Simple matching</span>
            <h1>
              Find your next
              <span className="accent"> study pal</span>.
            </h1>
            <p className="lead">
              A clean home page and a short set of questions when you ask for a
              match.
            </p>
            <button
              className={`primary-btn ${isSearching ? 'loading' : ''}`}
              onClick={onFindBuddy}
              disabled={isSearching}
            >
              {isSearching ? 'Finding a match...' : 'Find study pal'}
            </button>
            <p className="hint">Takes under 30 seconds.</p>
          </div>
        </div>
      </section>

      {showQuestions && (
        <section className="questions">
          <div className="container questions-card">
            <div className="questions-header">
              <h2>Quick match questions</h2>
              <p>We only ask what we need to match you well.</p>
            </div>

            <div className="steps">
              <span className={step === 1 ? 'active' : ''}>1</span>
              <span className={step === 2 ? 'active' : ''}>2</span>
              <span className={step === 3 ? 'active' : ''}>3</span>
              <span className={step === 4 ? 'active' : ''}>4</span>
              <span className={step === 5 ? 'active' : ''}>5</span>
            </div>

            {step === 1 && (
              <div className="question">
                <label>Your name</label>
                <input
                  type="text"
                  placeholder="e.g., Alex"
                  value={name}
                  onChange={onNameChange}
                />
              </div>
            )}

            {step === 2 && (
              <div className="question">
                <label>Free time schedule</label>
                <input
                  type="text"
                  placeholder="e.g., Tue/Thu 4-7pm"
                  value={schedule}
                  onChange={onScheduleChange}
                />
              </div>
            )}

            {step === 3 && (
              <div className="question">
                <label>Target courses</label>
                <input
                  type="text"
                  placeholder="e.g., Psych 101, Stats 202"
                  value={courses}
                  onChange={onCoursesChange}
                />
              </div>
            )}

            {step === 4 && (
              <div className="question">
                <label>Target number of people</label>
                <select value={groupSize} onChange={onGroupSizeChange}>
                  <option value="1">1 person</option>
                  <option value="2">2 people</option>
                  <option value="3">3 people</option>
                  <option value="4">4 people</option>
                </select>
              </div>
            )}

            {step === 5 && (
              <div className="question">
                <label>Difficulty level</label>
                <select value={difficulty} onChange={onDifficultyChange}>
                  <option value="intro">Intro</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            )}

            {error && <p className="error-text">{error}</p>}

            <div className="question-actions">
              <button
                className="secondary-btn"
                onClick={onBack}
                disabled={step === 1}
              >
                Back
              </button>
              {step < 5 ? (
                <button className="primary-btn" onClick={onNext}>
                  Next
                </button>
              ) : (
                <button className="primary-btn" onClick={onSubmit}>
                  Find matches
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {isSearching && (
        <section className="result">
          <div className="container result-card">
            <span className="spinner" />
            <div>
              <p className="search-title">Finding your match</p>
              <p className="search-subtitle">
                Comparing availability, courses, and difficulty level.
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function App() {
  const [isSearching, setIsSearching] = useState(false)
  const [foundMatch, setFoundMatch] = useState(null)
  const [showQuestions, setShowQuestions] = useState(false)
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [schedule, setSchedule] = useState('')
  const [courses, setCourses] = useState('')
  const [groupSize, setGroupSize] = useState('2')
  const [difficulty, setDifficulty] = useState('intro')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleFindBuddy = () => {
    setShowQuestions(true)
    setFoundMatch(null)
    setIsSearching(false)
    setStep(1)
    setError('')
  }

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 5))
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    setIsSearching(true)
    setShowQuestions(false)
    setError('')
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          schedule,
          courses,
          group_size: groupSize,
          difficulty
        })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to find a match right now.')
      }
      setFoundMatch(data.match)
      navigate('/results', { state: { match: data.match } })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSearching(false)
      setStep(1)
    }
  }

  return (
    <div className="app">
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                isSearching={isSearching}
                showQuestions={showQuestions}
                step={step}
                name={name}
                schedule={schedule}
                courses={courses}
                groupSize={groupSize}
                difficulty={difficulty}
                error={error}
                onFindBuddy={handleFindBuddy}
                onNext={handleNext}
                onBack={handleBack}
                onSubmit={handleSubmit}
                onNameChange={(event) => setName(event.target.value)}
                onScheduleChange={(event) => setSchedule(event.target.value)}
                onCoursesChange={(event) => setCourses(event.target.value)}
                onGroupSizeChange={(event) => setGroupSize(event.target.value)}
                onDifficultyChange={(event) => setDifficulty(event.target.value)}
              />
            }
          />
          <Route
            path="/results"
            element={<ResultsPage match={foundMatch} />}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
