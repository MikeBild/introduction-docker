import { describe, expect, it } from 'vitest'
import { dockerfile, dockerignore } from '../../../../scripts/lib/files.ts'

const dir = `${import.meta.dirname}/..`
const { stages, final } = dockerfile(dir)

describe('02 Image bauen', () => {
  it('nutzt mindestens zwei Stages', () => {
    expect(stages.length).toBeGreaterThanOrEqual(2)
  })

  it('legt jedes Base-Image auf node:26-slim fest', () => {
    for (const stage of stages) expect(stage.from).toBe('node:26-slim')
  })

  it('installiert nur die Abhängigkeiten für die Produktion aus dem Lockfile', () => {
    const runs = stages.flatMap((stage) => stage.instructions.filter((i) => i.cmd === 'RUN').map((i) => i.args))
    expect(runs.some((args) => args.includes('npm ci --omit=dev'))).toBe(true)
  })

  it('kopiert das Lockfile vor dem Quellcode', () => {
    const deps = stages[0]!.instructions
    const lock = deps.findIndex((i) => i.cmd === 'COPY' && i.args.includes('package-lock.json'))
    const install = deps.findIndex((i) => i.cmd === 'RUN' && i.args.includes('npm ci'))
    expect(lock).toBeGreaterThanOrEqual(0)
    expect(lock).toBeLessThan(install)
  })

  it('kopiert im fertigen Image nicht den ganzen Build-Context', () => {
    expect(final.instructions.some((i) => i.cmd === 'COPY' && /^\.\s+\./.test(i.args))).toBe(false)
    expect(final.instructions.some((i) => i.cmd === 'COPY' && i.args.startsWith('--from='))).toBe(true)
  })

  it('läuft als User node', () => {
    const users = final.instructions.filter((i) => i.cmd === 'USER')
    expect(users.at(-1)?.args).toBe('node')
  })

  it('startet node direkt in der Exec-Form', () => {
    const cmd = final.instructions.filter((i) => i.cmd === 'CMD').at(-1)
    expect(JSON.parse(cmd!.args)).toEqual(['node', 'src/main.ts'])
  })

  it('hält node_modules, Tests, Git und .env aus dem Build-Context', () => {
    expect(dockerignore(dir)).toEqual(expect.arrayContaining(['node_modules', 'test', '.git', '.env*']))
  })
})
