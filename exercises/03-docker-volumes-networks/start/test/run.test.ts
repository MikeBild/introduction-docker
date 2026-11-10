import { describe, expect, it } from 'vitest'
import { script } from '../../../../scripts/lib/files.ts'

const run = script(`${import.meta.dirname}/..`, 'run.sh')

// Remove .skip as soon as you start the exercise.
describe.skip('03 Volumes and networks', () => {
  it('creates a network of its own and a named volume', () => {
    expect(run).toMatch(/docker network create shop-net/)
    expect(run).toMatch(/docker volume create shop-db/)
  })

  it('starts Postgres 18 in the network with the volume at /var/lib/postgresql', () => {
    expect(run).toMatch(/--name db --network shop-net/)
    expect(run).toMatch(/-v shop-db:\/var\/lib\/postgresql\s/)
    expect(run).toContain('postgres:18')
  })

  it('publishes no port for Postgres', () => {
    const db = run.split('\n').filter((line) => line.includes('--name db'))
    expect(db.length).toBeGreaterThan(0)
    for (const line of db) expect(line).not.toMatch(/\s-p\s/)
  })

  it('connects the API through the container name db', () => {
    expect(run).toMatch(/--name api --network shop-net -p 3000:3000/)
    expect(run).toContain('@db:5432/shop')
  })

  it('restarts Postgres with the same volume', () => {
    expect(run).toMatch(/docker rm -f db/)
    expect(run.match(/-v shop-db:\/var\/lib\/postgresql/g)?.length).toBeGreaterThanOrEqual(2)
  })
})
