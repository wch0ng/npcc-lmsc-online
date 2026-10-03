import { useState, useCallback } from 'react'
import Header from '../components/layout/Header'
import QuizTimer from '../components/quiz/QuizTimer'
import QuizExplanation from '../components/quiz/QuizExplanation'
import MCQ from '../components/quiz/types/MCQ'
import SortOrder from '../components/quiz/types/SortOrder'
import Matching from '../components/quiz/types/Matching'
import DragDrop from '../components/quiz/types/DragDrop'
import { useTimer } from '../hooks/useTimer'
import allQuestions from '../data/quiz.json'

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function checkCorrect(question, answer) {
  if (question.type === 'mcq') return answer === question.answer
  if (question.type === 'sort_order') return answer === question.answer[0]
  if (question.type === 'matching') return answer === question.pairs[0].term
  if (question.type === 'drag_drop') return answer === question.items[0].label
  return false
}

const TYPE_LABELS = {
  mcq: 'Multiple Choice',
  sort_order: 'Sort in Order',
  matching: 'Matching',
  drag_drop: 'Drag & Drop',
}

// ── Timer display (needs its own component so the hook re-mounts on new question) ──
function QuestionTimer({ timeLimit, onExpire, stopped }) {
  const { timeLeft } = useTimer(timeLimit, stopped ? undefined : onExpire)
  return <QuizTimer timeLeft={stopped ? 0 : timeLeft} total={timeLimit} />
}

// ── Score screen ──
function ScoreScreen({ questions, answers, onRestart }) {
  const score = answers.filter((a) => a.correct).length
  const pct = Math.round((score / questions.length) * 100)

  return (
    <div>
      <Header title="Results" />
      <div className="p-4 space-y-5">
        <div className="bg-[#1e3a5f] rounded-2xl p-6 text-center text-white">
          <p className="text-5xl font-bold">{pct}%</p>
          <p className="text-blue-200 mt-1">{score} out of {questions.length} correct</p>
          <p className="text-sm mt-2 text-[#f0c94d] font-semibold">
            {pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good effort!' : 'Keep practising!'}
          </p>
        </div>

        <div className="space-y-2">
          {questions.map((q, i) => (
            <div
              key={q.id}
              className={`flex items-start gap-3 bg-white rounded-xl p-3 shadow-sm border-l-4 ${
                answers[i]?.correct ? 'border-green-400' : 'border-red-400'
              }`}
            >
              <span>{answers[i]?.correct ? '✅' : '❌'}</span>
              <p className="text-sm text-gray-700 flex-1">{q.question}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onRestart}
          className="w-full py-4 rounded-2xl bg-[#1e3a5f] text-white font-bold"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

// ── Active quiz session ──
function QuizSession({ questions, onComplete }) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [answered, setAnswered] = useState(null)
  const [timerKey, setTimerKey] = useState(0)

  const question = questions[current]
  const isLast = current + 1 >= questions.length

  const handleAnswer = useCallback((value) => {
    if (answered) return
    const correct = checkCorrect(question, value)
    setAnswered({ value, correct })
  }, [answered, question])

  const handleExpire = useCallback(() => {
    if (!answered) handleAnswer('__timeout__')
  }, [answered, handleAnswer])

  function handleNext() {
    const newAnswers = [...answers, answered]
    if (isLast) {
      onComplete(newAnswers)
      return
    }
    setAnswers(newAnswers)
    setCurrent((c) => c + 1)
    setAnswered(null)
    setTimerKey((k) => k + 1)
  }

  const QuestionComponent = { mcq: MCQ, sort_order: SortOrder, matching: Matching, drag_drop: DragDrop }[question.type]

  return (
    <div>
      <Header title="Quiz" subtitle={`Question ${current + 1} of ${questions.length}`} />
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#c9a227] uppercase tracking-wider bg-amber-50 px-2 py-1 rounded-full">
            {TYPE_LABELS[question.type]}
          </span>
          <QuestionTimer
            key={timerKey}
            timeLimit={question.timeLimit}
            onExpire={handleExpire}
            stopped={!!answered}
          />
        </div>

        <p className="text-base font-semibold text-gray-800 leading-snug">{question.question}</p>

        <QuestionComponent question={question} onAnswer={handleAnswer} disabled={!!answered} />

        {answered && (
          <QuizExplanation
            correct={answered.correct}
            explanation={answered.value === '__timeout__'
              ? `Time's up! ${question.explanation}`
              : question.explanation}
            onNext={handleNext}
            isLast={isLast}
          />
        )}
      </div>
    </div>
  )
}

// ── Top-level Quiz page ──
export default function Quiz({ progressApi }) {
  const { recordQuizResult, progress } = progressApi
  const [questions, setQuestions] = useState(null)
  const [finalAnswers, setFinalAnswers] = useState(null)

  function startQuiz() {
    setQuestions(shuffle(allQuestions).slice(0, 10))
    setFinalAnswers(null)
  }

  function handleComplete(answers) {
    const score = answers.filter((a) => a.correct).length
    recordQuizResult(score, questions.length)
    setFinalAnswers(answers)
  }

  if (finalAnswers) {
    return (
      <ScoreScreen
        questions={questions}
        answers={finalAnswers}
        onRestart={() => { setQuestions(null); setFinalAnswers(null) }}
      />
    )
  }

  if (questions) {
    return <QuizSession questions={questions} onComplete={handleComplete} />
  }

  const avg = progress.quiz.length
    ? Math.round(progress.quiz.reduce((s, r) => s + r.score / r.total, 0) / progress.quiz.length * 100)
    : null
  const recent = progress.quiz[0]

  return (
    <div>
      <Header title="Quiz" subtitle="Test your knowledge" />
      <div className="p-4 space-y-5">
        {avg !== null && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Average score</p>
            <p className="text-4xl font-bold text-[#1e3a5f]">{avg}%</p>
            <p className="text-xs text-gray-400 mt-1">
              Last: {recent.score}/{recent.total} · {progress.quiz.length} attempt{progress.quiz.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
          <h2 className="font-semibold text-[#1e3a5f]">What to expect</h2>
          {Object.values(TYPE_LABELS).map((t) => (
            <div key={t} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-2 h-2 rounded-full bg-[#c9a227] flex-shrink-0" />
              {t}
            </div>
          ))}
          <p className="text-xs text-gray-400">10 questions · countdown timer per question</p>
        </div>

        <button
          onClick={startQuiz}
          className="w-full py-4 rounded-2xl bg-[#1e3a5f] text-white font-bold text-base"
        >
          Start Quiz
        </button>
      </div>
    </div>
  )
}
