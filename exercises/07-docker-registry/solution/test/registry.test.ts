import { describe, expect, it } from 'vitest'
import { compose, script } from '../../../../scripts/lib/files.ts'

const dir = `${import.meta.dirname}/..`
const registry = script(dir, 'registry.sh')
const { services } = compose(dir)

describe('07 Registry', () => {
  it('startet registry:3 mit Volume und Neustart-Regel', () => {
    expect(registry).toMatch(/docker run -d --name registry --restart=always/)
    expect(registry).toMatch(/-v registry-data:\/var\/lib\/registry/)
    expect(registry).toMatch(/registry:3\b/)
  })

  it('veröffentlicht die Registry nur auf localhost', () => {
    expect(registry).toMatch(/-p 127\.0\.0\.1:5001:5000/)
  })

  it('taggt, pusht und pullt über den Registry-Host im Namen', () => {
    expect(registry).toMatch(/docker tag shop-api:1\.0\.0 localhost:5001\/shop-api:1\.0\.0/)
    expect(registry).toMatch(/docker push localhost:5001\/shop-api:1\.0\.0/)
    expect(registry).toMatch(/docker pull localhost:5001\/shop-api:1\.0\.0/)
  })

  it('fragt die Registry-API ab', () => {
    expect(registry).toContain('/v2/_catalog')
    expect(registry).toContain('/v2/shop-api/tags/list')
  })

  it('bezieht die API im Stack aus der Registry', () => {
    expect(services.api?.image).toBe('localhost:5001/shop-api:1.0.0')
  })
})
