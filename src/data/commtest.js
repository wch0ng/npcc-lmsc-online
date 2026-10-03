// “2 ½ Minutes Test — Are you a good receiver?”
// Transcribed from reference/Communications Test.pdf.
// kind: how the instruction is carried out on paper
//   'read'   – nothing to do yet          'write' – pen on the paper
//   'say'    – speak / shout aloud        'move'  – physical action
export const COMM_TEST = {
  title: '2 ½ Minutes Test',
  subtitle: 'Are you a good receiver?',
  seconds: 150,
  instructions: [
    { n: 1, text: 'Read everything before doing anything.', kind: 'read' },
    { n: 2, text: 'Write your name and squad name in the top right-hand corner of this paper.', kind: 'write' },
    { n: 3, text: 'Circle the word ‘of’ in sentence two.', kind: 'write' },
    { n: 4, text: 'Draw 8 circles in the top left-hand corner of this paper.', kind: 'write' },
    { n: 5, text: 'Punch your fist in the air, shout a CI’s name. (He or she must be in the room.)', kind: 'say' },
    { n: 6, text: 'Write your name again under the second title of this paper.', kind: 'write' },
    { n: 7, text: 'Draw a circle around sentence three.', kind: 'write' },
    { n: 8, text: 'Underline the first fraction you see in the test.', kind: 'write' },
    { n: 9, text: 'Put a smiley face in the lower-right hand corner of this paper.', kind: 'write' },
    { n: 10, text: 'If you are enjoying this test, say ‘Yes’ if not say ‘No’.', kind: 'say' },
    { n: 11, text: 'Shout your name when you reach this point in the test.', kind: 'say' },
    { n: 12, text: 'On the right margin of this paper, multiply 69 by 8.', kind: 'write' },
    { n: 13, text: 'Draw a triangle around the word ‘hand’ in sentence two.', kind: 'write' },
    { n: 14, text: 'If you think you have followed directions carefully to this point, call ‘I have’.', kind: 'say' },
    { n: 15, text: 'Draw a square around the school logo found on this paper.', kind: 'write' },
    { n: 16, text: 'Stand up, turn around once and sit down.', kind: 'move' },
    { n: 17, text: 'Draw an ‘X’ across this paper.', kind: 'write' },
    { n: 18, text: 'Stand up, turn to the instructor and shout ‘I am nearly finished, I have followed directions’. Wait for the instructor reply: “Hurray” then, sit down.', kind: 'move' },
    { n: 19, text: 'If you are the first to reach this point say, “I am the leader in following instructions”.', kind: 'say' },
    { n: 20, text: 'Now that you have finished reading carefully, as instructed in sentence 1, do only sentence number 2.', kind: 'read' },
  ],
}

// Debrief prompts follow the course's What? / So What? / Now What? model
// (Reflection & Debriefing module, slide 90).
export const COMM_DEBRIEF = [
  { id: 'what', label: 'What?', hint: 'What happened? What did you do when the timer started? How did you feel at instruction 20?' },
  { id: 'sowhat', label: 'So what?', hint: 'What did you learn about yourself as a receiver of instructions?' },
  { id: 'nowwhat', label: 'Now what?', hint: 'What will you do differently the next time you receive a briefing or written instructions?' },
]
