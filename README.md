# NPCC LMSC — v2

Interactive companion for the NPCC Leadership & Mentoring Skills Course (React + Vite + Tailwind, installable PWA).

## What's inside
- **Learn** — 7 modules condensed from the course deck: Leadership, Mentoring, Basic Teamwork, Effective Communication, Reflection & Debriefing, Method of Instruction, Lesson Planning.
- **Practice** — 39 flash cards, a 25-question quiz bank (multiple choice / ordering / matching / sorting), and the course scenarios (leadership situations, debriefs, self-reflection).
- **Activities**
  - **VAK Learning Styles Questionnaire** — all 30 questions, tally of A/B/C answers, V/A/K breakdown and feedback from the VAK Guide.
  - **2½ Minutes Test (Are you a good receiver?)** — timed digital worksheet with pen, write and tick tools; reveals the trick, scores the attempt, and runs a What / So What / Now What debrief.

Progress is stored in the browser (localStorage) on each device; there is no server.

## Develop
```sh
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
npm run deploy   # publish dist/ to GitHub Pages (needs a GitHub remote)
```
The build uses a relative base and hash routing, so it works from any hosting path.

Source materials live in `reference/` (git-ignored, not published).
