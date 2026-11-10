import { describe, expect, it } from 'vitest'
import { compose } from '../../../../scripts/lib/files.ts'

const { services, volumes, version } = compose(`${import.meta.dirname}/..`)

describe('04 Compose', () => {
  it('describes the services api and db without version', () => {
    expect(Object.keys(services).sort()).toEqual(['api', 'db'])
    expect(version).toBeUndefined()
  })

  it('builds the API itself and takes Postgres as a ready-made image', () => {
    expect(services.api?.build).toBe('.')
    expect(services.db?.image).toBe('postgres:18')
  })

  it('connects the API through the service name db', () => {
    expect(JSON.stringify(services.api?.environment)).toContain('@db:5432/shop')
  })

  it('publishes only the API', () => {
    expect(services.api?.ports).toEqual(['3000:3000'])
    expect(services.db?.ports).toBeUndefined()
  })

  it('puts the data in a named volume', () => {
    expect(services.db?.volumes).toContain('db-data:/var/lib/postgresql')
    expect(volumes).toHaveProperty('db-data')
  })

  it('starts db before api', () => {
    const dependsOn = services.api?.depends_on
    expect(Array.isArray(dependsOn) ? dependsOn : Object.keys(dependsOn ?? {})).toContain('db')
  })
})
