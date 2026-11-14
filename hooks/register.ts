import type { Register } from 'claude-code'

const k = (n?: number) => (n === undefined ? '?' : `${Math.round(n / 1000)}k`)

export const register: Register = on => {
  on('prompt.submit', async ($, e, next) => {
    const { context: c, rateLimits } = await $.session.usage()
    // Before the first API response the context figures are unknown: leave them out.
    const known = c.tokens !== undefined && c.percent !== undefined
    const top = [...rateLimits].sort((a, b) => b.percentUsed - a.percentUsed)[0]
    const limits = rateLimits
      .map(r => `${r.kind} ${r.percentUsed}% used${r.resetsAt ? ` (resets ${r.resetsAt})` : ''}`)
      .join('; ')

    const parts = [
      known && `context ${c.percent}% used (${k(c.tokens)}/${k(c.window)} tokens)`,
      limits && `limits: ${limits}`,
    ].filter(Boolean)
    if (!parts.length) return next(e)

    const note =
      `[budget] ${parts.join('; ')}` +
      ((c.percent ?? 0) >= 80 ? '. Context nearly full: be concise, avoid large reads, suggest /compact.' : '') +
      (top && top.percentUsed >= 90 ? ' Rate limit nearly exhausted: prefer small, cheap steps.' : '')

    $.ui.status([known && `ctx ${c.percent}%`, top && `${top.kind} ${top.percentUsed}%`].filter(Boolean).join(' · '))

    return next({ ...e, context: [...(e.context ?? []), note] })
  })
}
