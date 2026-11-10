import { describe, expect, it } from 'vitest'
import { compose, script } from '../../../../scripts/lib/files.ts'

const dir = `${import.meta.dirname}/..`
const registry = script(dir, 'registry.sh')
const { services } = compose(dir)

// Remove .skip as soon as you start the exercise.
describe.skip('07 Registry', () => {
  it('starts registry:3 with a volume and a restart policy', () => {
    expect(registry).toMatch(/docker run -d --name registry --restart=always/)
    expect(registry).toMatch(/-v registry-data:\/var\/lib\/registry/)
    expect(registry).toMatch(/registry:3\b/)
  })

  it('publishes the registry only on localhost', () => {
    expect(registry).toMatch(/-p 127\.0\.0\.1:5001:5000/)
  })

  it('tags, pushes and pulls with the registry host in the name', () => {
    expect(registry).toMatch(/docker tag shop-api:1\.0\.0 localhost:5001\/shop-api:1\.0\.0/)
    expect(registry).toMatch(/docker push localhost:5001\/shop-api:1\.0\.0/)
    expect(registry).toMatch(/docker pull localhost:5001\/shop-api:1\.0\.0/)
  })

  it('queries the registry API', () => {
    expect(registry).toContain('/v2/_catalog')
    expect(registry).toContain('/v2/shop-api/tags/list')
  })

  it('pulls the API in the stack from the registry', () => {
    expect(services.api?.image).toBe('localhost:5001/shop-api:1.0.0')
  })
})
