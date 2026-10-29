import { describe, expect, it } from 'vitest'
import { compose } from '../../../../scripts/lib/files.ts'

const { services, volumes, version } = compose(`${import.meta.dirname}/..`)

describe('04 Compose', () => {
  it('beschreibt die Services api und db ohne version', () => {
    expect(Object.keys(services).sort()).toEqual(['api', 'db'])
    expect(version).toBeUndefined()
  })

  it('baut die API selbst und nimmt Postgres als fertiges Image', () => {
    expect(services.api?.build).toBe('.')
    expect(services.db?.image).toBe('postgres:18')
  })

  it('verbindet die API über den Servicenamen db', () => {
    expect(JSON.stringify(services.api?.environment)).toContain('@db:5432/shop')
  })

  it('veröffentlicht nur die API', () => {
    expect(services.api?.ports).toEqual(['3000:3000'])
    expect(services.db?.ports).toBeUndefined()
  })

  it('legt die Daten in ein Named Volume', () => {
    expect(services.db?.volumes).toContain('db-data:/var/lib/postgresql')
    expect(volumes).toHaveProperty('db-data')
  })

  it('startet db vor api', () => {
    const dependsOn = services.api?.depends_on
    expect(Array.isArray(dependsOn) ? dependsOn : Object.keys(dependsOn ?? {})).toContain('db')
  })
})
