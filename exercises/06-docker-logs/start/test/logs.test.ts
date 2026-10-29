import { describe, expect, it } from 'vitest'
import { compose, script } from '../../../../scripts/lib/files.ts'

const dir = `${import.meta.dirname}/..`
const { services } = compose(dir)
const logs = script(dir, 'logs.sh')

// Entferne .skip, wenn du loslegst.
describe.skip('06 Logs', () => {
  it('nutzt für jeden Service den Driver local mit Rotation', () => {
    for (const name of ['api', 'db']) {
      expect(services[name]?.logging?.driver).toBe('local')
      expect(services[name]?.logging?.options).toMatchObject({ 'max-size': '10m', 'max-file': '3' })
    }
  })

  it('liest die Logs aller Services und einzeln mit Zeitstempel', () => {
    expect(logs).toMatch(/docker compose logs --tail \d+/)
    expect(logs).toMatch(/docker compose logs -t --since \S+ api/)
  })

  it('filtert JSON-Zeilen mit jq nach Feldern', () => {
    expect(logs).toMatch(/docker compose logs --no-log-prefix api \| jq/)
  })

  it('prüft die LogConfig des Containers', () => {
    expect(logs).toContain('.HostConfig.LogConfig')
  })
})
