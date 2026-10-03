// In-progress VAK answers survive closing the app mid-questionnaire.
const KEY = 'npcc_lmsc_v2_vak_draft'

export function loadDraft() {
  try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null }
}
export function saveDraft(answers) {
  try { localStorage.setItem(KEY, JSON.stringify(answers)) } catch { /* ignore */ }
}
export function clearDraft() {
  try { localStorage.removeItem(KEY) } catch { /* ignore */ }
}
