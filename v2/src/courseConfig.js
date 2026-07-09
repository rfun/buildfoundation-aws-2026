import raw from '../course.config.json'

// Weeks that have enabled: true
export const enabledWeekIds = new Set(
  raw.weeks.filter((w) => w.enabled).map((w) => w.id)
)

// Labs section — top-level toggle + per-pillar filter
export const labsEnabled = raw.labs.enabled
export const enabledPillarIds = new Set(
  raw.labs.pillars.filter((p) => p.enabled).map((p) => p.id)
)

// Assignments section — top-level toggle + per-item filter
export const assignmentsEnabled = raw.assignments.enabled
export const enabledAssignmentWeeks = new Set(
  raw.assignments.items.filter((a) => a.enabled).map((a) => a.week)
)
