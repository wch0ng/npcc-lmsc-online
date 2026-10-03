// VAK Learning Styles Self-Assessment Questionnaire — transcribed from
// reference/VAK (Questionaire).pdf. Option a = Visual, b = Auditory, c = Kinaesthetic.

export const VAK_QUESTIONS = [
  { q: 'When I operate new equipment I generally:', a: 'read the instructions first', b: 'listen to an explanation from someone who has used it before', c: 'go ahead and have a go, I can figure it out as I use it' },
  { q: 'When I need directions for travelling I usually:', a: 'look at a map', b: 'ask for spoken directions', c: 'follow my nose and maybe use a compass' },
  { q: 'When I cook a new dish, I like to:', a: 'follow a written recipe', b: 'call a friend for an explanation', c: 'follow my instincts, testing as I cook' },
  { q: 'If I am teaching someone something new, I tend to:', a: 'write instructions down for them', b: 'give them a verbal explanation', c: 'demonstrate first and then let them have a go' },
  { q: 'I tend to say:', a: 'watch how I do it', b: 'listen to me explain', c: 'you have a go' },
  { q: 'During my free time I most enjoy:', a: 'going to museums and galleries', b: 'listening to music and talking to my friends', c: 'playing sport or doing DIY' },
  { q: 'When I go shopping for clothes, I tend to:', a: 'imagine what they would look like on', b: 'discuss them with the shop staff', c: 'try them on and test them out' },
  { q: 'When I am choosing a holiday I usually:', a: 'read lots of brochures', b: 'listen to recommendations from friends', c: 'imagine what it would be like to be there' },
  { q: 'If I was buying a new car, I would:', a: 'read reviews in newspapers and magazines', b: 'discuss what I need with my friends', c: 'test-drive lots of different types' },
  { q: 'When I am learning a new skill, I am most comfortable:', a: 'watching what the teacher is doing', b: 'talking through with the teacher exactly what I’m supposed to do', c: 'giving it a try myself and work it out as I go' },
  { q: 'If I am choosing food off a menu, I tend to:', a: 'imagine what the food will look like', b: 'talk through the options in my head or with my partner', c: 'imagine what the food will taste like' },
  { q: 'When I listen to a band, I can’t help:', a: 'watching the band members and other people in the audience', b: 'listening to the lyrics and the beats', c: 'moving in time with the music' },
  { q: 'When I concentrate, I most often:', a: 'focus on the words or the pictures in front of me', b: 'discuss the problem and the possible solutions in my head', c: 'move around a lot, fiddle with pens and pencils and touch things' },
  { q: 'I choose household furnishings because I like:', a: 'their colours and how they look', b: 'the descriptions the sales-people give me', c: 'their textures and what it feels like to touch them' },
  { q: 'My first memory is of:', a: 'looking at something', b: 'being spoken to', c: 'doing something' },
  { q: 'When I am anxious, I:', a: 'visualise the worst-case scenarios', b: 'talk over in my head what worries me most', c: 'can’t sit still, fiddle and move around constantly' },
  { q: 'I feel especially connected to other people because of:', a: 'how they look', b: 'what they say to me', c: 'how they make me feel' },
  { q: 'When I have to revise for an exam, I generally:', a: 'write lots of revision notes and diagrams', b: 'talk over my notes, alone or with other people', c: 'imagine making the movement or creating the formula' },
  { q: 'If I am explaining to someone I tend to:', a: 'show them what I mean', b: 'explain to them in different ways until they understand', c: 'encourage them to try and talk them through my idea as they do it' },
  { q: 'I really love:', a: 'watching films, photography, looking at art or people watching', b: 'listening to music, the radio or talking to friends', c: 'taking part in sporting activities, eating fine foods and wines or dancing' },
  { q: 'Most of my free time is spent:', a: 'watching television', b: 'talking to friends', c: 'doing physical activity or making things' },
  { q: 'When I first contact a new person, I usually:', a: 'arrange a face to face meeting', b: 'talk to them on the telephone', c: 'try to get together whilst doing something else, such as an activity or a meal' },
  { q: 'I first notice how people:', a: 'look and dress', b: 'sound and speak', c: 'stand and move' },
  { q: 'If I am angry, I tend to:', a: 'keep replaying in my mind what it is that has upset me', b: 'raise my voice and tell people how I feel', c: 'stamp about, slam doors and physically demonstrate my anger' },
  { q: 'I find it easiest to remember:', a: 'faces', b: 'names', c: 'things I have done' },
  { q: 'I think that you can tell if someone is lying if:', a: 'they avoid looking at you', b: 'their voice changes', c: 'they give me funny vibes' },
  { q: 'When I meet an old friend:', a: 'I say “it’s great to see you!”', b: 'I say “it’s great to hear from you!”', c: 'I give them a hug or a handshake' },
  { q: 'I remember things best by:', a: 'writing notes or keeping printed details', b: 'saying them aloud or repeating words and key points in my head', c: 'doing and practising the activity or imagining it being done' },
  { q: 'If I have to complain about faulty goods, I am most comfortable:', a: 'writing a letter', b: 'complaining over the phone', c: 'taking the item back to the store or posting it to head office' },
  { q: 'I tend to say:', a: 'I see what you mean', b: 'I hear what you are saying', c: 'I know how you feel' },
]

export const OPTION_STYLE = { a: 'v', b: 'a', c: 'k' }

// Style descriptions — wording from reference/VAK (Guide).pdf.
// `asLeader` adds a course link: slide 127 asks lesson planners to understand
// the learning behaviour of their audience.
export const VAK_STYLES = {
  v: {
    key: 'v',
    letter: 'V',
    option: 'A',
    name: 'Visual',
    by: 'by seeing',
    color: 'vis',
    phrases: ['Show me', 'Let’s have a look at that'],
    guide:
      'Someone with a Visual learning style has a preference for seen or observed things, including pictures, diagrams, demonstrations, displays, handouts, films, flip-chart, etc. These people will use phrases such as ‘show me’, ‘let’s have a look at that’ and will be best able to perform a new task after reading the instructions or watching someone else do it first. These are the people who will work from lists and written directions and instructions.',
    learnsBest: ['Pictures and diagrams', 'Demonstrations', 'Displays and handouts', 'Films and flip-charts', 'Lists and written instructions'],
    tips: [
      'Turn notes into diagrams, mind-maps and colour-coded lists.',
      'Ask the instructor to demonstrate before you try.',
      'Read the written instructions or lesson plan first.',
    ],
    asLeader: 'Cadets like you learn from seeing. When you teach, prepare a clear demonstration (MOI step 4), visuals or a written breakdown.',
  },
  a: {
    key: 'a',
    letter: 'A',
    option: 'B',
    name: 'Auditory',
    by: 'by listening',
    color: 'aud',
    phrases: ['Tell me', 'Let’s talk it over'],
    guide:
      'Someone with an Auditory learning style has a preference for the transfer of information through listening: to the spoken word, of self or others, of sounds and noises. These people will use phrases such as ‘tell me’, ‘let’s talk it over’ and will be best able to perform a new task after listening to instructions from an expert. These are the people who are happy being given spoken instructions over the telephone, and can remember all the words to songs that they hear!',
    learnsBest: ['Spoken explanations', 'Discussion', 'Listening to an expert', 'Instructions over the phone', 'Songs, rhythm and repetition'],
    tips: [
      'Talk your notes through, alone or with a study buddy.',
      'Repeat key points aloud, or turn them into a chant or rhyme.',
      'Ask questions during Q&A and talk through each step with the instructor.',
    ],
    asLeader: 'Cadets like you learn from listening. When you teach, give a clear verbal explanation (MOI step 3) and leave time for Q&A.',
  },
  k: {
    key: 'k',
    letter: 'K',
    option: 'C',
    name: 'Kinaesthetic',
    by: 'by touching / hands-on',
    color: 'kin',
    phrases: ['Let me try', 'How do you feel?'],
    guide:
      'Someone with a Kinaesthetic learning style has a preference for physical experience – touching, feeling, holding, doing, practical hands-on experiences. These people will use phrases such as ‘let me try’, ‘how do you feel?’ and will be best able to perform a new task by going ahead and trying it out, learning as they go. These are the people who like to experiment, hands-on, and never look at the instructions first!',
    learnsBest: ['Hands-on practice', 'Trying it out', 'Experimenting', 'Movement and role-play', 'Learning as they go'],
    tips: [
      'Practise the movement or skill early and often (muscle memory).',
      'Walk through drills step by step, or act out scenarios.',
      'Use objects, models or flash cards you can handle and sort.',
    ],
    asLeader: 'Cadets like you learn by doing. When you teach, give plenty of practical session time (MOI step 5) and correct mistakes as they practise.',
  },
}

export const VAK_GUIDE_INTRO = [
  'If you chose mostly A’s you have a VISUAL learning style.',
  'If you chose mostly B’s you have an AUDITORY learning style.',
  'If you chose mostly C’s you have a KINAESTHETIC learning style.',
]

export const VAK_GUIDE_NOTES = {
  blend:
    'People commonly have a main preferred learning style, but this will be part of a blend of all three. Some people have a very strong preference; other people have a more even mixture of two or less commonly, three styles.',
  why:
    'When you know your preferred learning style(s) you understand the type of learning that best suits you. This enables you to choose the types of learning that work best for you.',
  noRightOrWrong:
    'There is no right or wrong learning style. The point is that there are types of learning that are right for your own preferred learning style.',
  disclaimer:
    'This is not a scientifically validated testing instrument – it is a free assessment tool designed to give a broad indication of preferred learning style(s).',
}

// Turn counts into a profile. A style counts as part of a blend when it is
// within 3 answers (10% of 30) of the top score.
export function analyseVak(counts) {
  const order = ['v', 'a', 'k'].sort((x, y) => counts[y] - counts[x])
  const top = counts[order[0]]
  const blend = order.filter((s) => top - counts[s] <= 3)
  let strength
  const gap = top - counts[order[1]]
  if (blend.length === 3) strength = 'even'
  else if (blend.length === 2) strength = 'blend'
  else if (gap >= 8) strength = 'strong'
  else strength = 'clear'
  return { order, primary: order[0], blend, strength }
}
