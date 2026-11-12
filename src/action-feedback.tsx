export type ActionFeedbackTone = 'info' | 'warning' | 'error' | 'success'

/** The host supplies localized copy. Unknown machine identifiers never become user-facing text. */
export function resolveActionFeedback(identifier: unknown, messages: Readonly<Record<string, string>>, fallback: string): string {
  return typeof identifier === 'string' && Object.hasOwn(messages, identifier) ? messages[identifier] ?? fallback : fallback
}

/** Place this controlled feedback beside the action that produced it. No transport or error diagnostics are rendered here. */
export function ActionFeedback({message, tone = 'info', id, className = ''}: Readonly<{
  message?: string
  tone?: ActionFeedbackTone
  id?: string
  className?: string
}>) {
  if (!message) return null
  return <p id={id} role={tone === 'error' ? 'alert' : 'status'} className={`afcc-action-feedback afcc-action-feedback-${tone} ${className}`.trim()}>{message}</p>
}
