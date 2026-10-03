// SMART goal-setting practice — Basic Teamwork module, slides 53–54
// (“The S.M.A.R.T. way” and “The SMART goal — Let’s try!”).
// Descriptions, questions and squad examples come from the deck; the personal
// examples are written for this app in the same style.

export const GOAL_TYPES = {
  personal: {
    id: 'personal',
    label: 'Personal goal',
    blurb: 'Something you would like to achieve in life.',
    prompt: 'What would you like to achieve?',
    placeholder: 'e.g. Get fitter so I can do well in my NAPFA test',
  },
  squad: {
    id: 'squad',
    label: 'Squad goal',
    blurb: 'Something your squad would like to achieve together in NPCC before you P.O.P.',
    prompt: 'What does your squad want to achieve?',
    placeholder: 'e.g. Do better at the Campcraft Competition',
  },
}

export const SMART_STEPS = [
  {
    key: 's',
    letter: 'S',
    name: 'Specific',
    desc: 'State what you want to achieve.',
    question: 'Who, what, where, why, how?',
    checks: ['It says exactly what will be done', 'It says who is involved', 'It says how it will be done'],
    examples: {
      squad: 'We want to participate in the Campcraft Competition, and practise every week.',
      personal: 'I want to improve my 2.4 km run by training three times a week after school.',
    },
  },
  {
    key: 'm',
    letter: 'M',
    name: 'Measurable',
    desc: 'Comparable and can be measured.',
    question: 'Time, things, target: how will you know you have achieved it?',
    checks: ['It has a number, score or target', 'Someone else could check whether it was achieved'],
    examples: {
      squad: '40th placing and above.',
      personal: 'Run 2.4 km in under 12 minutes.',
    },
  },
  {
    key: 'a',
    letter: 'A',
    name: 'Achievable',
    desc: 'Can be achieved and is realistic.',
    question: 'Is the goal achievable? Why do you think so?',
    checks: ['It stretches me / us, but is realistic', 'It is based on where I am / we are now'],
    examples: {
      squad: 'Good: improve 10 placings from 50th last year. Bad: be number 1 immediately.',
      personal: 'Good: cut 1 minute from my current 13 minutes. Bad: break the school record next week.',
    },
  },
  {
    key: 'r',
    letter: 'R',
    name: 'Relevant',
    desc: 'Directly linked to the objective.',
    question: 'Does the approach relate to the overall objective?',
    checks: ['The actions lead directly to the goal', 'It matters to me / the squad'],
    examples: {
      squad: 'Campcraft trainings to gain the competencies needed for the competition.',
      personal: 'Running training builds the stamina I need for NAPFA and NPCC activities.',
    },
  },
  {
    key: 't',
    letter: 'T',
    name: 'Time-bound',
    desc: 'Duration.',
    question: 'Do we have enough time? When is the deadline?',
    checks: ['It has a deadline', 'There is enough time to prepare'],
    examples: {
      squad: 'We have 3 months to the actual competition.',
      personal: '10 weeks, before the NAPFA test in Term 3.',
    },
  },
]

export const GOAL_STATUS = [
  { id: 'planned', label: 'Planned' },
  { id: 'progress', label: 'In progress' },
  { id: 'achieved', label: 'Achieved' },
]

// One readable paragraph, used on the goal card and when copying to share.
export function goalStatement(g) {
  const lines = [
    `${g.type === 'squad' ? 'SQUAD' : 'PERSONAL'} SMART GOAL${g.squad ? ` (${g.squad})` : ''}`,
    g.title,
    '',
    `S: ${g.s}`,
    `M: ${g.m}`,
    `A: ${g.a}`,
    `R: ${g.r}`,
    `T: ${g.t}${g.deadline ? ` (by ${formatDate(g.deadline)})` : ''}`,
  ]
  if (g.type === 'squad' && g.roles?.trim()) lines.push('', `Plan & roles: ${g.roles}`)
  return lines.join('\n')
}

export function formatDate(iso) {
  return new Date(iso + (iso.length === 10 ? 'T00:00' : '')).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}
