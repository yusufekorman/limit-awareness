# limit-awareness

Claude Code mod: on every prompt, tells the agent how much context window and rate limit is left, and nudges it to be frugal near 80% context or 90% of a rate-limit window.

## What it does

Each prompt gets a one-line note the agent can see:

```
[budget] context 8% used (78k/1000k tokens); limits: five_hour 34% used (resets 2026-11-14T12:50:00.000Z); seven_day 78% used (resets 2026-11-17T11:00:00.000Z)
```

- At 80% context or more, the note adds: be concise, avoid large reads, suggest `/compact`.
- When any rate-limit window is at 90% or more, it adds: prefer small, cheap steps.
- The status line shows context use and the fullest rate-limit window, e.g. `ctx 8% · seven_day 78%`.
- On the first prompt of a session the context figures are not known yet, so the note carries the limits only.
- Rate-limit figures appear on subscription accounts only. With neither figure available, no note is added.

## Install

At the prompt of a terminal session:

```
/plugin install limit-awareness --marketplace yusufekorman/limit-awareness
```

From a shell:

```
claude plugin install limit-awareness --marketplace yusufekorman/limit-awareness
```

## Update

```
claude plugin marketplace update limit-awareness
claude plugin update limit-awareness@limit-awareness
```

Restart Claude Code to apply.
