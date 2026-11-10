import { describe, expect, it } from 'vitest'
import { dockerfile, dockerignore } from '../../../../scripts/lib/files.ts'

const dir = `${import.meta.dirname}/..`
const { stages, final } = dockerfile(dir)

// Remove .skip as soon as you start the exercise.
describe.skip('02 Image build', () => {
  it('uses at least two stages', () => {
    expect(stages.length).toBeGreaterThanOrEqual(2)
  })

  it('pins every base image to node:26-slim', () => {
    for (const stage of stages) expect(stage.from).toBe('node:26-slim')
  })

  it('installs only the production dependencies from the lockfile', () => {
    const runs = stages.flatMap((stage) => stage.instructions.filter((i) => i.cmd === 'RUN').map((i) => i.args))
    expect(runs.some((args) => args.includes('npm ci --omit=dev'))).toBe(true)
  })

  it('copies the lockfile before the source code', () => {
    const deps = stages[0]!.instructions
    const lock = deps.findIndex((i) => i.cmd === 'COPY' && i.args.includes('package-lock.json'))
    const install = deps.findIndex((i) => i.cmd === 'RUN' && i.args.includes('npm ci'))
    expect(lock).toBeGreaterThanOrEqual(0)
    expect(lock).toBeLessThan(install)
  })

  it('does not copy the whole build context into the final image', () => {
    expect(final.instructions.some((i) => i.cmd === 'COPY' && /^\.\s+\./.test(i.args))).toBe(false)
    expect(final.instructions.some((i) => i.cmd === 'COPY' && i.args.startsWith('--from='))).toBe(true)
  })

  it('runs as user node', () => {
    const users = final.instructions.filter((i) => i.cmd === 'USER')
    expect(users.at(-1)?.args).toBe('node')
  })

  it('starts node directly in exec form', () => {
    const cmd = final.instructions.filter((i) => i.cmd === 'CMD').at(-1)
    expect(JSON.parse(cmd!.args)).toEqual(['node', 'src/main.ts'])
  })

  it('keeps node_modules, tests, Git and .env out of the build context', () => {
    expect(dockerignore(dir)).toEqual(expect.arrayContaining(['node_modules', 'test', '.git', '.env*']))
  })
})
