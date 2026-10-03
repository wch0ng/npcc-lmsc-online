// Final Quiz: 14 questions written only for the final, plus a random draw
// from the practice bank so every attempt covers all six modules.
import { QUIZ } from './quiz'
import { MODULES } from './modules'
import { SCENARIO_GROUPS } from './scenarios'

export const FINAL_ONLY = [
  {
    id: 'f1', module: 'leadership', type: 'mcq',
    question: 'Leadership is a process whereby an individual ______ a group of individuals to achieve a common goal.',
    options: ['influences', 'controls', 'commands', 'supervises'], answer: 'influences',
    explanation: 'Definition of leadership from the course.',
  },
  {
    id: 'f2', module: 'leadership', type: 'mcq',
    question: 'Which leadership style is based on personality and charm, and seldom relies on authority?',
    options: ['Autocratic', 'Bureaucratic', 'Charismatic', 'Democratic'], answer: 'Charismatic',
    explanation: 'Charismatic leaders lead through personality and charm.',
  },
  {
    id: 'f3', module: 'leadership', type: 'mcq',
    question: 'Why should a cadet leader think carefully before posting on social media?',
    options: [
      'A leader is a role model, responsible for what is said, including posts',
      'Posts disappear after 24 hours anyway',
      'Only officers can see cadets’ posts',
      'Social media has nothing to do with leadership',
    ],
    answer: 'A leader is a role model, responsible for what is said, including posts',
    explanation: 'Leadership extends beyond NPCC: what you post reflects who you are.',
  },
  {
    id: 'f4', module: 'leadership', type: 'mcq',
    question: 'Which of these is NOT listed as a quality of a good mentor?',
    options: ['Patience', 'Humble', 'Compassionate', 'Strict'], answer: 'Strict',
    explanation: 'Qualities listed: mutual respect, mutual trust, patience, humble, objective, genuine, compassionate, committed, setting the example.',
  },
  {
    id: 'f5', module: 'leadership', type: 'match',
    question: 'Match the letters of MENTOR to what an effective mentor does.',
    pairs: [
      { term: 'M', definition: 'Manages the relationship' },
      { term: 'E', definition: 'Encourages' },
      { term: 'N', definition: 'Nurtures' },
      { term: 'R', definition: 'Responds to the mentee’s needs' },
    ],
    explanation: 'Manages, Encourages, Nurtures, Teaches, Offers mutual respect, Responds.',
  },
  {
    id: 'f6', module: 'teamwork', type: 'mcq',
    question: 'In the Campcraft case study, members began to understand each other’s strengths and help one another. Which stage is this?',
    options: ['Forming', 'Storming', 'Norming', 'Adjourning'], answer: 'Norming',
    explanation: 'Norming: strong commitment, feedback, understanding strengths and weaknesses.',
  },
  {
    id: 'f7', module: 'teamwork', type: 'mcq',
    question: '“We have 3 months to the actual competition” describes which part of a SMART goal?',
    options: ['Specific', 'Measurable', 'Relevant', 'Time-bound'], answer: 'Time-bound',
    explanation: 'Time-bound: duration. Do we have enough time?',
  },
  {
    id: 'f8', module: 'communication', type: 'mcq',
    question: 'In the 2½ Minutes Test, after reading everything, which instruction were you actually meant to carry out?',
    options: ['Instruction 1', 'Instruction 2', 'Instruction 19', 'All 20 instructions'], answer: 'Instruction 2',
    explanation: 'Instruction 20: “do only sentence number 2”. A good receiver takes in the whole message before acting.',
  },
  {
    id: 'f9', module: 'communication', type: 'mcq',
    question: 'Which of these is part of active listening?',
    options: ['Acknowledging and/or seeking clarification', 'Interrupting to share your view', 'Preparing your reply while they talk', 'Assuming you know what they mean'],
    answer: 'Acknowledging and/or seeking clarification',
    explanation: 'Active listening: pay attention, interpret, make sense, then acknowledge or clarify.',
  },
  {
    id: 'f10', module: 'reflection', type: 'mcq',
    question: 'A debrief is best described as…',
    options: [
      'A semi-structured two-way discussion that helps participants reflect',
      'A lecture by the leader on everything that went wrong',
      'A written test at the end of training',
      'A one-to-one disciplinary talk',
    ],
    answer: 'A semi-structured two-way discussion that helps participants reflect',
    explanation: 'Debriefing is reflection for others: a two-way discussion.',
  },
  {
    id: 'f11', module: 'reflection', type: 'order',
    question: 'Arrange the guiding questions of a debrief in order.',
    answer: ['What?', 'So What?', 'Now What?'],
    explanation: 'What? establishes what happened, So What? draws out learning, Now What? future-proofs.',
  },
  {
    id: 'f12', module: 'moi', type: 'mcq',
    question: 'In which MOI step do you choose a place with a clear view for the squad, away from facing the sun?',
    options: ['Introduction', 'Formation', 'Explanation', 'Practice'], answer: 'Formation',
    explanation: 'Formation: comfort of the squad, clear view, avoid the sun, ventilation, safety.',
  },
  {
    id: 'f13', module: 'lesson-planning', type: 'mcq',
    question: 'Why should a lesson plan give a clear breakdown of every activity?',
    options: [
      'So any lesson conductor can carry it out, since the planner may not be the conductor',
      'So the lesson takes longer',
      'Because officers grade the formatting',
      'So participants can skip the lesson',
    ],
    answer: 'So any lesson conductor can carry it out, since the planner may not be the conductor',
    explanation: 'A lesson planner is not necessarily the lesson conductor.',
  },
  {
    id: 'f14', module: 'lesson-planning', type: 'mcq',
    question: 'A cadet often says “Let me try” and learns best by doing. Which learning style is this?',
    options: ['Visual', 'Auditory', 'Kinesthetic', 'Bureaucratic'], answer: 'Kinesthetic',
    explanation: 'Kinesthetic learners prefer hands-on experience and learning as they go.',
  },
]

export const FINAL_FROM_BANK = 6
export const FINAL_LENGTH = FINAL_ONLY.length + FINAL_FROM_BANK

function shuffle(a) {
  const x = [...a]
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]] }
  return x
}

export function buildFinalQuiz() {
  return shuffle([...FINAL_ONLY, ...shuffle(QUIZ).slice(0, FINAL_FROM_BANK)])
}

export const ALL_QUESTIONS = Object.fromEntries([...FINAL_ONLY, ...QUIZ].map((q) => [q.id, q]))

// Snapshot of course completion, stored with each final attempt.
export function completionSnapshot(progress) {
  const goals = progress.goals ?? []
  const modules = MODULES.map((m) => ({ id: m.id, num: m.num, title: m.title, done: !!progress.modules[m.id] }))
  const vak = progress.vak[0]
  const comm = progress.commtest
  const activities = [
    { id: 'vak', title: 'VAK Questionnaire', done: !!vak, detail: vak ? 'Completed' : 'Not done', counts: vak?.counts ?? null },
    { id: 'comm', title: '2½ Minutes Test', done: comm.length > 0, detail: comm.length ? (comm.some((r) => r.passed) ? 'Good receiver' : 'Attempted') : 'Not done' },
    { id: 'goal-personal', title: 'SMART personal goal', done: goals.some((g) => g.type === 'personal'), detail: goals.some((g) => g.type === 'personal') ? 'Set' : 'Not set' },
    { id: 'goal-squad', title: 'SMART squad goal', done: goals.some((g) => g.type === 'squad'), detail: goals.some((g) => g.type === 'squad') ? 'Set' : 'Not set' },
  ]
  const scenarios = SCENARIO_GROUPS.map((g) => ({
    id: g.id, title: g.title, total: g.scenarios.length,
    done: g.scenarios.filter((s) => progress.scenarios[s.id]?.done).length,
  }))
  return { modules, activities, scenarios }
}
