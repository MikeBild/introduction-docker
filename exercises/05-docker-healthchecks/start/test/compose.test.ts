import { describe, expect, it } from 'vitest'
import { compose } from '../../../../scripts/lib/files.ts'

const { services } = compose(`${import.meta.dirname}/..`)
const testOf = (name: string) => [services[name]?.healthcheck?.test ?? []].flat().join(' ')

// Entferne .skip, sobald du mit der Übung beginnst.
describe.skip('05 Healthchecks', () => {
  it('prüft Postgres mit pg_isready', () => {
    expect(testOf('db')).toMatch(/pg_isready/)
  })

  it('prüft die API über /readyz, ohne curl', () => {
    expect(testOf('api')).toContain('/readyz')
    expect(testOf('api')).not.toMatch(/curl|wget/)
  })

  it('setzt Intervall und Wiederholungen', () => {
    expect(services.db?.healthcheck?.interval).toBeDefined()
    expect(services.db?.healthcheck?.retries).toBeGreaterThan(1)
  })

  it('startet die API erst, wenn Postgres healthy ist', () => {
    const dependsOn = services.api?.depends_on
    expect(Array.isArray(dependsOn)).toBe(false)
    expect((dependsOn as Record<string, { condition?: string }>).db?.condition).toBe('service_healthy')
  })
})
