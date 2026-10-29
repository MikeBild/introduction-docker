import { describe, expect, it } from 'vitest'
import { script } from '../../../../scripts/lib/files.ts'

const run = script(`${import.meta.dirname}/..`, 'run.sh')

// Entferne .skip, wenn du loslegst.
describe.skip('01 Container statt VM', () => {
  it('startet node:26-slim und räumt mit --rm auf', () => {
    expect(run).toMatch(/docker run --rm .*node:26-slim/)
  })

  it('zeigt PID und Kernel des Containers', () => {
    expect(run).toContain('process.pid')
    expect(run).toContain('uname -r')
  })

  it('begrenzt Speicher und CPU und liest die cgroup-Grenzen', () => {
    expect(run).toMatch(/--memory 256m/)
    expect(run).toMatch(/--cpus 0\.5/)
    expect(run).toContain('/sys/fs/cgroup/memory.max')
  })

  it('prüft den User im Container', () => {
    expect(run).toMatch(/node:26-slim\s+id\b/)
  })
})
