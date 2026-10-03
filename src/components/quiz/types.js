import { MCQ, Order, Match, SortGroups } from './QuestionTypes'

export const TYPES = {
  mcq: { label: 'Multiple choice', C: MCQ },
  order: { label: 'Put in order', C: Order },
  match: { label: 'Match up', C: Match },
  sort: { label: 'Sort into groups', C: SortGroups },
}
