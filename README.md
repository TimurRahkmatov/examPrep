# ExamPrep

Exam practice website: pick a subject, take the test, see your score and review every answer.
Built with Next.js 15 (App Router), React 19, TypeScript and Tailwind CSS 4. Progress is saved in the browser (localStorage).

## Run it

Requires Node.js 18.18 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build: `npm run build && npm start`. Checks: `npx tsc --noEmit` and `npm run lint`.

## Routes

| Route | Page |
| --- | --- |
| `/` | Dashboard with the subject cards and progress |
| `/subject/[subjectId]` | The test |
| `/results/[subjectId]` | Score, statistics and answer review |

## Editing questions and subjects

- `questions/subject1.ts` … `subject4.ts` hold one subject each. Every question looks like:

  ```ts
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris", // must match one option exactly
  }
  ```

  Any number of questions and options works; counts in the UI come from the data. Options are shuffled for each attempt, so the correct answer can be listed in any position.
- `questions/index.ts` holds subject names and descriptions. To add a subject, create a file and add an entry there.
- `config/site.ts` holds the site name and the student name shown in the header.
- While `npm run dev` is running, a `correctAnswer` that doesn't match its options, or a repeated id, is reported in the terminal.

## Project layout

```
app/          routes (dashboard, subject, results), layout, global styles
components/   Header, SubjectCard, ProgressBar, QuestionCard, AnswerOption, QuestionNavigator,
              ConfirmDialog, ResultSummary, ResultCard, ResultCircle, AnswerReview, FilterTabs, ...
lib/          types, scoring, option shuffling, localStorage progress store
questions/    question data, one file per subject
config/       site name and student name
```
