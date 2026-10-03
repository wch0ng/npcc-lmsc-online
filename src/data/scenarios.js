// Scenario activities from the LMSC deck (Leadership “Activity Time”,
// “How to debrief — now you try!” and Self-reflection).
// `consider` holds facilitator-style talking points written for this app —
// the deck itself leaves these open for discussion.

const LEADERSHIP_PROMPTS = [
  { id: 'style', label: 'What leadership style will you use?', options: ['Autocratic', 'Bureaucratic', 'Charismatic', 'Democratic'] },
  { id: 'do', label: 'What will you do?' },
]

const WSW = [
  { id: 'what', label: 'What?', hint: 'What happened? What did you see/do? How did you feel? What is the impact? How does it affect our goal?' },
  { id: 'sowhat', label: 'So What?', hint: 'What have you learned from this experience?' },
  { id: 'nowwhat', label: 'Now What?', hint: 'What should you do in future situations?' },
]

export const SCENARIO_GROUPS = [
  {
    id: 'leadership',
    title: 'Which leadership style?',
    blurb: 'Guess which type of leadership suits each situation — and why.',
    module: 'leadership',
    scenarios: [
      {
        id: 'ls1', title: 'Situation 1 · The scolding CL',
        text: 'During one of the trainings, one of the Cadet Leaders, who is your squad mate, has been scolding one of the cadets for being unable to execute drills properly. This has been going on for the past few trainings.',
        prompts: LEADERSHIP_PROMPTS,
        consider: ['Speak to your squad mate privately first — protect their dignity as a fellow leader.', 'Seek to understand before being understood: why is the cadet struggling, and why is the CL frustrated?', 'A democratic approach lets you agree together on a better way to coach the cadet.'],
      },
      {
        id: 'ls2', title: 'Situation 2 · Recruitment surge',
        text: 'During Sec 1 Recruitment, the various CLs are stationed at their respective locations. However, as the IC, you received information that the Sec 1s will be coming in groups of 80 instead of the original 20.',
        prompts: LEADERSHIP_PROMPTS,
        consider: ['Time is short and many people must move fast — clear, decisive direction (autocratic) can work best here.', 'Communicate changes precisely and concisely to every station.', 'Debrief afterwards so CLs can share what worked.'],
      },
      {
        id: 'ls3', title: 'Situation 3 · A different UATC',
        text: 'The Unit Annual Training Camp is coming up in 3 months’ time. The Officers have suggested that this upcoming UATC be different from any in the past.',
        prompts: LEADERSHIP_PROMPTS,
        consider: ['There is time and a need for fresh ideas — democratic leadership encourages creativity.', 'Gather input from CLs and cadets, but retain the final say.', 'Set SMART goals for what “different” should achieve.'],
      },
      {
        id: 'ls4', title: 'Situation 4 · Drills in the sun',
        text: 'During the training, you noticed that the cadets have been training for drills out in the sun for an hour without any breaks. The cadets’ drills are still not up to standard.',
        prompts: LEADERSHIP_PROMPTS,
        consider: ['Safety first: call a water break and move to shade — this is a safety rule (bureaucratic) as much as a choice.', 'Check the formation: avoid facing the sun, ensure ventilation (MOI).', 'Re-teach with demonstration by numbers, then practise in shorter blocks.'],
      },
    ],
  },
  {
    id: 'debrief',
    title: 'Conduct a debrief',
    blurb: 'Plan a debrief with What? So What? Now What? — then wrap up with the Sandwich Method.',
    module: 'reflection',
    scenarios: [
      {
        id: 'db0', title: 'Example · Campfire songs',
        text: 'You are a Cadet Leader teaching the Secondary 1 squad new campfire songs. During the session, you noticed two cadets chatting away and disturbing other cadets who are trying their best to learn the songs. You decide to address the incident after the session.',
        prompts: WSW,
        consider: ['What? — “What happened during the session? How did others feel when they couldn’t hear?”', 'So What? — “How does chatting affect the squad’s goal of learning the songs?”', 'Now What? — “What will we do in the next session?” End with the Sandwich Method.'],
      },
      {
        id: 'db1', title: 'Scenario 1 · First Full Uniform',
        text: 'You are a Cadet Leader taking the Secondary 1 squad for drills. It was their first time wearing the Full Uniform and many of their uniforms were not well prepared. In addition, many of them were not attentive during the training. You decide to address the incidents after training.',
        prompts: WSW,
        consider: ['Choose a seated, quiet, cooling spot and sit within the group.', 'Acknowledge it was their first time in Full Uniform before raising the standard.', 'Agree on concrete Now-What actions, e.g. uniform check the night before.'],
      },
      {
        id: 'db2', title: 'Scenario 2 · Late with a burger',
        text: 'You are a Cadet Leader in charge of the Secondary 1 squad. When taking attendance at the start of training, three of your cadets came late. One of them was still munching on a burger. You decide to address the squad regarding the incident after the day’s training.',
        prompts: WSW,
        consider: ['Address the squad, not just the three — punctuality affects everyone’s goal.', 'Keep your tone firm but respectful; set ground rules for the discussion.', 'Close with positive feedback on what the squad did well that day.'],
      },
    ],
  },
  {
    id: 'self',
    title: 'Self-reflection',
    blurb: 'Debrief yourself — who else will help you learn?',
    module: 'reflection',
    scenarios: [
      {
        id: 'sr0', title: 'Example · Tent pitching',
        text: 'You are a Cadet Leader taking the Secondary 1 squad for campcraft training. After teaching them how to pitch a tent, you realised that many of them are still unsure. When a cadet asked you a question regarding tent pitching, you realised that you were unable to answer it. You decide to do some self-reflection after training.',
        prompts: WSW,
        consider: ['Be honest about what you did not know — it is an opportunity, not a failure.', 'Did your MOI include demonstration by numbers and enough practice?', 'Now What? — revise the skill, prepare for likely questions, consider a partner to assist.'],
      },
      {
        id: 'sr1', title: 'Now you try · Your LMSC journey',
        text: 'We have learned more about leadership and mentoring skills throughout LMSC. Based on what we have learned, do a self-reflection and draw out as many learning points as possible across all the modules.',
        prompts: WSW,
        consider: ['Go module by module: Leadership & Mentoring, Teamwork, Communication, Reflection, MOI, Lesson Planning.', 'Include your VAK learning style and your 2½ Minutes Test result.', 'Write at least one Now-What action you can start at the next training.'],
      },
    ],
  },
]

export const ALL_SCENARIOS = SCENARIO_GROUPS.flatMap((g) => g.scenarios.map((s) => ({ ...s, group: g.id })))
