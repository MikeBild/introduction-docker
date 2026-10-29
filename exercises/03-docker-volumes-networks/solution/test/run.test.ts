import { describe, expect, it } from 'vitest'
import { script } from '../../../../scripts/lib/files.ts'

const run = script(`${import.meta.dirname}/..`, 'run.sh')

describe('03 Volumes und Netze', () => {
  it('legt ein eigenes Netz und ein Named Volume an', () => {
    expect(run).toMatch(/docker network create shop-net/)
    expect(run).toMatch(/docker volume create shop-db/)
  })

  it('startet Postgres 18 im Netz mit dem Volume unter /var/lib/postgresql', () => {
    expect(run).toMatch(/--name db --network shop-net/)
    expect(run).toMatch(/-v shop-db:\/var\/lib\/postgresql\s/)
    expect(run).toContain('postgres:18')
  })

  it('veröffentlicht keinen Port für Postgres', () => {
    const db = run.split('\n').filter((line) => line.includes('--name db'))
    expect(db.length).toBeGreaterThan(0)
    for (const line of db) expect(line).not.toMatch(/\s-p\s/)
  })

  it('verbindet die API über den Containernamen db', () => {
    expect(run).toMatch(/--name api --network shop-net -p 3000:3000/)
    expect(run).toContain('@db:5432/shop')
  })

  it('startet Postgres mit demselben Volume neu', () => {
    expect(run).toMatch(/docker rm -f db/)
    expect(run.match(/-v shop-db:\/var\/lib\/postgresql/g)?.length).toBeGreaterThanOrEqual(2)
  })
})
