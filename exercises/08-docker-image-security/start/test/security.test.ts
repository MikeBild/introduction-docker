import { describe, expect, it } from 'vitest'
import { compose, dockerfile, script } from '../../../../scripts/lib/files.ts'

const dir = `${import.meta.dirname}/..`
const { stages, final } = dockerfile(dir)
const { services } = compose(dir)
const scan = script(dir, 'scan.sh')

// Remove .skip as soon as you start the exercise.
describe.skip('08 Image security', () => {
  it('installs with node:26-slim and runs on Distroless as nonroot', () => {
    expect(stages[0]?.from).toBe('node:26-slim')
    expect(final.from).toBe('gcr.io/distroless/nodejs26-debian13:nonroot')
  })

  it('passes only the script because node is already the entrypoint', () => {
    const cmd = final.instructions.filter((i) => i.cmd === 'CMD').at(-1)
    expect(JSON.parse(cmd!.args)).toEqual(['src/main.ts'])
  })

  it('hardens the API container', () => {
    const api = services.api!
    expect(api.image).toBe('shop-api:1.1.0')
    expect(api.read_only).toBe(true)
    expect(api.cap_drop).toEqual(['ALL'])
    expect(api.security_opt).toContain('no-new-privileges:true')
  })

  it('checks health without a shell', () => {
    expect([services.api?.healthcheck?.test].flat()[1]).toBe('/nodejs/bin/node')
  })

  it('scans both images and fails on critical vulnerabilities with a fix', () => {
    expect(scan).toMatch(/trivy image .*node:26-slim/)
    expect(scan).toMatch(/trivy image .*--exit-code 1 .*--severity CRITICAL .*--ignore-unfixed shop-api:1\.1\.0/)
  })

  it('checks that there is no shell in the image', () => {
    expect(scan).toMatch(/--entrypoint sh shop-api:1\.1\.0/)
  })
})
