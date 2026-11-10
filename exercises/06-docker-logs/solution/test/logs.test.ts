import { describe, expect, it } from 'vitest'
import { compose, script } from '../../../../scripts/lib/files.ts'

const dir = `${import.meta.dirname}/..`
const { services } = compose(dir)
const logs = script(dir, 'logs.sh')

describe('06 Logs', () => {
  it('uses the driver local with rotation for every service', () => {
    for (const name of ['api', 'db']) {
      expect(services[name]?.logging?.driver).toBe('local')
      expect(services[name]?.logging?.options).toMatchObject({ 'max-size': '10m', 'max-file': '3' })
    }
  })

  it('reads the logs of all services and of a single one with timestamps', () => {
    expect(logs).toMatch(/docker compose logs --tail \d+/)
    expect(logs).toMatch(/docker compose logs -t --since \S+ api/)
  })

  it('filters JSON lines by fields with jq', () => {
    expect(logs).toMatch(/docker compose logs --no-log-prefix api \| jq/)
  })

  it('checks the LogConfig of the container', () => {
    expect(logs).toContain('.HostConfig.LogConfig')
  })
})
