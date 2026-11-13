import type { Register } from 'claude-code'

const k = (n?: number) => (n === undefined ? '?' : `${Math.round(n / 1000)}k`)

export const register: Register = on => {
  on('prompt.submit', async ($, e, next) => {
    const { context: c, rateLimits } = await $.session.usage()
    const limits = rateLimits
      .map(r => `${r.kind} ${r.percentUsed}% used${r.resetsAt ? ` (resets ${r.resetsAt})` : ''}`)
      .join('; ')
    const note =
      `[budget] context ${c.percent ?? '?'}% used (${k(c.tokens)}/${k(c.window)} tokens)` +
      (limits ? `; limits: ${limits}` : '') +
      ((c.percent ?? 0) >= 80 ? '. Context nearly full: be concise, avoid large reads, suggest /compact.' : '') +
      (rateLimits.some(r => r.percentUsed >= 90) ? ' Rate limit nearly exhausted: prefer small, cheap steps.' : '')

    $.ui.status(`ctx ${c.percent ?? '?'}%${rateLimits[0] ? ` · ${rateLimits[0].kind} ${rateLimits[0].percentUsed}%` : ''}`)

    return next({ ...e, context: [...(e.context ?? []), note] })
  })
}
