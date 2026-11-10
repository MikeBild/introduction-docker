import { describe, expect, it } from 'vitest'
import { compose } from '../../../../scripts/lib/files.ts'

const { services } = compose(`${import.meta.dirname}/..`)
const testOf = (name: string) => [services[name]?.healthcheck?.test ?? []].flat().join(' ')

describe('05 Healthchecks', () => {
  it('checks Postgres with pg_isready', () => {
    expect(testOf('db')).toMatch(/pg_isready/)
  })

  it('checks the API through /readyz, without curl', () => {
    expect(testOf('api')).toContain('/readyz')
    expect(testOf('api')).not.toMatch(/curl|wget/)
  })

  it('sets interval and retries', () => {
    expect(services.db?.healthcheck?.interval).toBeDefined()
    expect(services.db?.healthcheck?.retries).toBeGreaterThan(1)
  })

  it('starts the API only when Postgres is healthy', () => {
    const dependsOn = services.api?.depends_on
    expect(Array.isArray(dependsOn)).toBe(false)
    expect((dependsOn as Record<string, { condition?: string }>).db?.condition).toBe('service_healthy')
  })
})
