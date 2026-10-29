import { describe, expect, it } from 'vitest'
import { compose, dockerfile, script } from '../../../../scripts/lib/files.ts'

const dir = `${import.meta.dirname}/..`
const { stages, final } = dockerfile(dir)
const { services } = compose(dir)
const scan = script(dir, 'scan.sh')

describe('08 Image-Sicherheit', () => {
  it('installiert mit node:26-slim und läuft auf Distroless als nonroot', () => {
    expect(stages[0]?.from).toBe('node:26-slim')
    expect(final.from).toBe('gcr.io/distroless/nodejs26-debian13:nonroot')
  })

  it('übergibt nur das Skript, weil node schon der Entrypoint ist', () => {
    const cmd = final.instructions.filter((i) => i.cmd === 'CMD').at(-1)
    expect(JSON.parse(cmd!.args)).toEqual(['src/main.ts'])
  })

  it('härtet den Container der API', () => {
    const api = services.api!
    expect(api.image).toBe('shop-api:1.1.0')
    expect(api.read_only).toBe(true)
    expect(api.cap_drop).toEqual(['ALL'])
    expect(api.security_opt).toContain('no-new-privileges:true')
  })

  it('prüft die Gesundheit ohne Shell', () => {
    expect([services.api?.healthcheck?.test].flat()[1]).toBe('/nodejs/bin/node')
  })

  it('scannt beide Images und bricht bei kritischen Lücken mit Fix ab', () => {
    expect(scan).toMatch(/trivy image .*node:26-slim/)
    expect(scan).toMatch(/trivy image .*--exit-code 1 .*--severity CRITICAL .*--ignore-unfixed shop-api:1\.1\.0/)
  })

  it('prüft, dass im Image keine Shell steckt', () => {
    expect(scan).toMatch(/--entrypoint sh shop-api:1\.1\.0/)
  })
})
