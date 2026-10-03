// Course modules — condensed from reference/2026 LMSC.pptx (Hougang Secondary NPCC).
// Section blocks: { type: 'text' | 'points' | 'terms' | 'steps' | 'quote' | 'compare' | 'acrostic' | 'table' }

export const MODULES = [
  {
    id: 'leadership',
    num: 1,
    title: 'Leadership',
    tagline: 'Styles of leadership and when to use them',
    icon: 'Flag',
    objectives: [
      'Discover more about the different leadership styles',
      'Understand how to be an effective and nurturing leader',
    ],
    sections: [
      { type: 'quote', text: 'The task of the leader is to get his people from where they are to where they have not been.', by: 'Henry Kissinger, 56th US Secretary of State' },
      { type: 'text', heading: 'Definition of leadership', text: 'Leadership is a process whereby an individual influences a group of individuals to achieve a common goal.' },
      {
        type: 'compare',
        heading: 'Which leader are you?',
        left: 'Leader (1)',
        right: 'Leader (2)',
        rows: [
          ['Develops', 'Maintains'],
          ['Inspires trust', 'Relies on control'],
          ['Motivates and inspires', 'Controls and solves problems'],
          ['Has FOLLOWERS', 'Has SUBORDINATES'],
          ['Facilitates decisions', 'Makes decisions'],
          ['Says “Let’s go!”', 'Says “Go!”'],
        ],
      },
      {
        type: 'terms',
        heading: 'Four types of leadership',
        items: [
          { term: 'Autocratic', def: ['Leader makes decisions independently', 'Little or no input opportunities from group members', 'Leader decides all work methods and processes'] },
          { term: 'Bureaucratic', def: ['Leader follows a set of rules', 'Little or no input opportunities from group members', 'Leader decides all work methods and processes based on the set of rules'] },
          { term: 'Charismatic', def: ['Leadership based on personality and charm', 'Seldom relies on authority'] },
          { term: 'Democratic', def: ['Leader offers guidance to group members', 'Encourages members to participate, but retains the final say', 'Members feel more engaged in the process', 'Creativity is encouraged and rewarded'] },
        ],
      },
      {
        type: 'points',
        heading: 'Situational leadership',
        points: [
          'A unique style — not a combination of all the leadership styles.',
          'The leader is flexible, adapting the style to the context of the situation the others are in.',
          'There is no best leadership style for every situation; different followers require different styles.',
          'Recognise different situations and use the style each one calls for.',
        ],
      },
      { type: 'quote', text: 'You may be one person to this world… but you can mean the world to one person, and make a world of difference to many more.' },
      {
        type: 'points',
        heading: 'Leadership extends beyond NPCC: social media',
        points: [
          'What you post on social media is a reflection of who you are.',
          'You decide how you want to be perceived on every platform — take your online presence seriously.',
          'A leader is a role model, responsible for what is said, including posts. Think carefully before posting.',
        ],
      },
    ],
  },
  {
    id: 'mentoring',
    num: 2,
    title: 'Mentoring',
    tagline: 'What makes an effective mentor',
    icon: 'HeartHandshake',
    objectives: ['Have a basic understanding of mentoring'],
    sections: [
      {
        type: 'acrostic',
        heading: 'Being an effective MENTOR',
        intro: 'An effective mentor has been described as one who:',
        items: [
          ['M', 'Manages the relationship'],
          ['E', 'Encourages'],
          ['N', 'Nurtures'],
          ['T', 'Teaches'],
          ['O', 'Offers mutual respect'],
          ['R', 'Responds to the mentee’s needs'],
        ],
      },
      {
        type: 'points',
        heading: 'How to mentor',
        points: [
          'Desire for development towards learning',
          'Voluntary and non-reporting relationship',
          'Exploring options together (instead of providing solutions)',
          'Open to feedback',
          'Passing on what you have learned',
          'Being approachable',
          'Ability to listen',
          'Willingness to communicate',
          'Motivating the mentee(s)',
          'Improving your competencies',
          'Setting goals and checking progress',
        ],
      },
      {
        type: 'chips',
        heading: 'Qualities of a good mentor',
        items: ['Mutual respect', 'Mutual trust', 'Patience', 'Humble', 'Objective', 'Genuine', 'Compassionate', 'Committed', 'Setting the example (role model)'],
      },
      { type: 'quote', text: 'Mentoring is an indispensable requirement for an artist’s growth. Not only are skills and experience shared, but there is value in the essential re-examination of one’s own work and techniques.', by: 'Jim Norman' },
    ],
  },
  {
    id: 'teamwork',
    num: 3,
    title: 'Basic Teamwork',
    tagline: 'Team stages and SMART goals',
    icon: 'Users',
    objectives: ['Understand why we work in teams and how teams develop'],
    sections: [
      { type: 'text', heading: 'What is a team?', text: 'A group of people working together to achieve a common goal.' },
      {
        type: 'terms',
        heading: 'Why work in teams?',
        items: [
          { term: 'Increased productivity', def: ['Getting more tasks done'] },
          { term: 'Increased creativity', def: ['More ideas being shared'] },
          { term: 'Improved problem solving', def: ['More people to work on a problem'] },
          { term: 'Higher morale', def: ['Members support each other as they work to achieve the goal'] },
        ],
      },
      {
        type: 'table',
        heading: 'Team dynamics: stages & measures for effective teamwork',
        cols: ['Stage', 'Measures for effective teamwork'],
        rows: [
          ['Forming', 'Goal-setting (SMART) · Planning & role allocation · Effective communication (voice variation, non-verbal communication, body language)'],
          ['Storming', 'Conflict resolution'],
          ['Norming', 'Strong commitment · Feedback channel · Understanding strengths & weaknesses'],
          ['Performing', '—'],
          ['Adjourning', '—'],
        ],
      },
      {
        type: 'text',
        heading: 'Case study: Campcraft Competition',
        text: 'Volunteers form two teams and meet their Cadet Inspectors to discuss goals (Forming). There is dispute over who should be captain and about strategy, settled after a long discussion (Storming). With more trainings, members understand each other’s strengths and help one another (Norming). On the day, the team competes motivated and confident (Performing). Weeks later they learn they improved by 10 positions — a moment worth celebrating (Adjourning).',
      },
      {
        type: 'table',
        heading: 'The S.M.A.R.T. way',
        cols: ['', 'Description & questions', 'Example'],
        rows: [
          ['Specific', 'State what you want to achieve. Who, what, where, why, how?', 'We want to participate in the Campcraft Competition, practising every week'],
          ['Measurable', 'Comparable and can be measured. Time, things, target', '40th placing and above'],
          ['Achievable', 'Can be achieved and is realistic. Is the goal achievable?', 'Good: improve 10 placings from 50th last year. Bad: be number 1 immediately'],
          ['Relevant', 'Directly linked to the objective. Does the approach relate to the overall objective?', 'Campcraft trainings to gain the competencies needed for the competition'],
          ['Time-bound', 'Duration. Do we have enough time?', 'We have 3 months to the actual competition'],
        ],
      },
    ],
  },
  {
    id: 'communication',
    num: 4,
    title: 'Effective Communication',
    tagline: 'Sending, receiving and understanding',
    icon: 'MessagesSquare',
    objectives: ['What communication is', 'What makes communication effective', 'Elements of communication', 'Being an effective communicator'],
    activity: { to: '/activities/comm-test', label: 'Try the 2½ Minutes Test' },
    sections: [
      {
        type: 'points',
        heading: 'Communication is…',
        points: ['A process of exchanging ideas, information and feelings.', 'Involves giving and receiving.', 'A two-way, dynamic process!'],
      },
      {
        type: 'flow',
        heading: 'What makes communication effective?',
        steps: ['Sender (transmit)', 'Channels of communication', 'Recipient (interpret)'],
        text: 'Messages are sent out clearly, received and understood by both parties. Tip: establish a shared understanding of intention and meaning — there is more likelihood of shared agreement between parties.',
      },
      {
        type: 'terms',
        heading: 'Elements of communication',
        items: [
          { term: 'Verbal', def: ['Communicating through words', 'Written: expressing yourself through writing or typing', 'Spoken: expressing yourself through speaking'] },
          { term: 'Non-verbal', def: ['Communicating through actions — body language', 'Gives clues to your attitude and feelings', 'Usually reinforces verbal communication, but can be used on its own', '“Actions speak louder than words.”'] },
        ],
      },
      {
        type: 'points',
        heading: 'Why do we communicate?',
        points: [
          'To have others understand us — but first, we have to understand others.',
          'Empathise with your peers: know their thoughts, feelings and perspectives.',
          'Helps forge mutual respect, as others reciprocate the act.',
          '“Seek to understand before being understood.”',
        ],
      },
      {
        type: 'terms',
        heading: 'An effective communicator…',
        items: [
          { term: '1. Writes well', def: ['Be Precise (relevant information), Accurate (correct information), Concise (short and sweet)', 'Punctuation, italics, CAPITALS and emoticons change meaning: “You can do it.” vs “YOU CAN DO IT!”'] },
          { term: '2. Speaks well', def: ['Mind your pitch, volume, emphasis, rhythm and tone', 'Use eye contact, facial expression, gesture and upright posture', 'Observe the listener’s body language too'] },
          { term: '3. Displays appropriate body language', def: ['Demonstrate active listening'] },
        ],
      },
      {
        type: 'steps',
        heading: 'Writing an email',
        steps: ['Make your subject line simple', 'Start by greeting the recipient', 'Clearly state the reason you’re emailing', 'Keep the body text clear and concise', 'Come to a conclusion', 'Wrap up and signature', 'Double-check everything'],
      },
      {
        type: 'points',
        heading: 'Active listening',
        points: [
          'Shows that you care.',
          'Paying attention, interpreting and making sense of messages received — then acknowledging and/or seeking clarification.',
          'Improves the quality of communication.',
          'Benefits: mutual empathy and understanding, and overcoming assumptions.',
        ],
      },
      {
        type: 'points',
        heading: 'Before you speak, make sure you…',
        points: [
          'Know your PURPOSE — to instruct, teach, motivate or share? It influences how you communicate (e.g. tone when displaying authority vs gathering juniors for discussion).',
          'Believe in yourself — you CAN do it!',
          'Are audience-centric — attune to their needs to benefit them.',
        ],
      },
    ],
  },
  {
    id: 'reflection',
    num: 5,
    title: 'Reflection & Debriefing',
    tagline: 'Learning from experience — for others and for self',
    icon: 'RefreshCcw',
    objectives: ['Conduct a debrief (reflection for others)', 'Conduct a self-reflection (reflection for self)'],
    sections: [
      { type: 'text', heading: 'What is reflection?', text: 'Reflection is an intentional thinking process to help us learn from our past experiences. (Cambridge Dictionary: “serious and careful thought”.) It comes in two forms: Debriefing — reflection for others, and Self-Reflection — reflection for self.' },
      { type: 'text', heading: 'Debriefing', text: 'A semi-structured, two-way discussion between you and the participants to help them reflect on the prior activity. Usually conducted at the end of an activity at a comfortable location — but you may conduct it halfway through to address urgent issues. Short and simple, but when done properly it can be very impactful.' },
      {
        type: 'terms',
        heading: 'How to debrief: Ready… Set… Go!',
        items: [
          { term: 'Ready — Rationale / objective', def: ['Strengths: what went well? Why? How to keep it that way?', 'Areas for improvement: what did not go so well? Why? How to improve?', 'Takeaways: participants’ personal learning points'] },
          { term: 'Set — Setting / environment', def: ['Physical environment: sitting down, quiet, cooling', 'Placement: within the group rather than in front of it', 'Set ground rules to gain trust', 'Watch your body language, tone and word choice'] },
          { term: 'Go — Guiding questions / techniques', def: ['Use What? → So What? → Now What?', 'Wrap up with the Sandwich Method'] },
        ],
      },
      {
        type: 'table',
        heading: 'Guiding questions',
        cols: ['', 'Purpose', 'Questions'],
        rows: [
          ['What?', 'Establish what has happened', 'What happened? What did you see/do? How did you feel? What is the impact? How does it affect our goal?'],
          ['So What?', 'Draw out learning points', 'What have you learned from this experience?'],
          ['Now What?', 'Future-proofing', 'What should you do in future situations?'],
        ],
      },
      {
        type: 'steps',
        heading: 'Wrapping up: the Sandwich Method',
        steps: ['Positive feedback — “Today, we’ve done well in…”', 'Constructive feedback — “However, as we discussed earlier, we can certainly work on…”', 'Positive feedback — “Nonetheless, it was a great effort and I look forward to seeing your improvements!”'],
      },
      { type: 'text', heading: 'Self-reflection', text: 'As a Cadet Leader I debrief my cadets — but who debriefs me? YOU can debrief yourself. Self-reflection is a personal thinking process to learn from past experiences: identify what went well and the opportunities for improvement after every training. It isn’t only for Cadet Leaders — cadets can self-reflect too. Use the same Ready, Set, Go and What / So What / Now What.' },
    ],
  },
  {
    id: 'moi',
    num: 6,
    title: 'Method of Instruction',
    tagline: 'The 5 steps of teaching a lesson',
    icon: 'Presentation',
    objectives: ['Introduction to MOI', 'The 5 steps of MOI', 'Conducting Q&A'],
    sections: [
      { type: 'text', heading: 'What is MOI?', text: 'Method of Instruction (MOI) is how an instructor teaches a topic. There are five main steps, and a good instructor should be aware of the proper MOI for the activity. It is only a guide — a good instructor develops their own effective style, and commands and times all drills sharply and accurately.' },
      {
        type: 'terms',
        heading: 'The 5 steps (sample topic: drills)',
        numbered: true,
        items: [
          { term: 'Introduction', def: ['Introduce the command you are going to teach', 'Introduce yourself (and your partner)', 'Share what you will be teaching today', 'Highlight the importance of their attention', 'Inform any “class rules”'] },
          { term: 'Formation', def: ['Comfort of the squad: find the most suitable place to teach', 'Formation style for fast learning (e.g. straight, semi-circle, three ranks)', 'Clear, unobstructed view; avoid facing the sun; good ventilation; safe environment'] },
          { term: 'Explanation', def: ['Explain what you are teaching and its importance', 'Explain in parts where applicable', 'Elaborate on common mistakes', 'Share possible alternatives'] },
          { term: 'Demonstration', def: ['Complete 1st demonstration, shouting out the command', 'Demonstration by numbers, pointing out important details', 'Another complete demonstration', 'Optionally, a Q&A session'] },
          { term: 'Practice', def: ['Conduct the drill to check for mistakes; then check timing', 'Allow continuous practice → muscle memory', 'Constantly check for and correct mistakes', 'Give time and space for each participant to learn'] },
        ],
      },
      {
        type: 'terms',
        heading: 'Conducting Q&A',
        items: [
          { term: 'When', def: ['As and when', 'In between check-points during the lesson', 'At the end of the lesson'] },
          { term: 'How', def: ['Answer questions confidently', 'Have a partner to assist', 'Allow participants time to think', 'Don’t cut in when someone is sharing', 'Ask questions if participants have none'] },
        ],
      },
    ],
  },
  {
    id: 'lesson-planning',
    num: 7,
    title: 'Lesson Planning',
    tagline: 'Planning so anyone can conduct the lesson',
    icon: 'ClipboardList',
    objectives: ['Importance of lesson planning', 'Components of a lesson plan', 'Useful tips', 'Understanding learning behaviour (VAK test)'],
    activity: { to: '/activities/vak', label: 'Take the VAK questionnaire' },
    sections: [
      {
        type: 'points',
        heading: 'Why plan a lesson?',
        points: [
          'Provides structure and clear direction for a lesson.',
          'Allows monitoring of learning, using objectives set across lesson plans over time.',
          'Allows third parties to execute the plan — even without the lesson planner.',
        ],
      },
      {
        type: 'terms',
        heading: 'Components of a lesson plan',
        items: [
          { term: 'Lesson title', def: ['Title of the lesson'] },
          { term: 'Lesson objectives', def: ['Guide what content to cover and how'] },
          { term: 'Prior knowledge', def: ['What your audience must know before attending'] },
          { term: 'Stages & time allocation', def: ['Brief stages of the lesson and durations'] },
          { term: 'Attire · Target audience · Location', def: ['What to wear, who the lesson is for, where it is held'] },
          { term: 'Training personnel', def: ['Roles and particulars — or at least the number of conductors needed'] },
          { term: 'Equipment & logistics', def: ['All items required, with a breakdown of each'] },
          { term: 'Method of instruction', def: ['Breakdown of the activities with sufficient detail'] },
          { term: 'Administration', def: ['Budget, transport/rations, medical declarations (skip if not applicable)'] },
          { term: 'Safety precautions', def: ['Take note of the safety of participants'] },
          { term: 'Contingency plans', def: ['Back-up plans, e.g. what if it rains?'] },
          { term: 'References · Authentication', def: ['Sources used; name and rank of the planner for queries'] },
        ],
      },
      {
        type: 'points',
        heading: 'Tips for a good lesson plan',
        points: [
          'Always refer back to the lesson objective when in doubt.',
          'Ask yourself the 5W1H questions to make sure the plan is well covered.',
          'Document it well for future reference — hand over to future batches.',
          'Information must be PRECISE, CONCISE and ACCURATE.',
          'Understand the learning behaviour of your audience (e.g. some learn faster with more demonstration or practice).',
          'Give a clear breakdown so any conductor can understand it — a lesson planner is not necessarily the lesson conductor!',
        ],
      },
      {
        type: 'text',
        heading: 'Understanding learning behaviour (VAK)',
        text: 'The VAK model suggests most people can be divided into one of three preferred styles of learning — Visual (by seeing), Auditory (by listening) and Kinesthetic (by touching / hands-on). There is no right or wrong learning style. Take the VAK questionnaire to understand your own.',
      },
    ],
  },
]

export const moduleById = Object.fromEntries(MODULES.map((m) => [m.id, m]))
