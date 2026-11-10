import { describe, expect, it } from 'vitest'
import { script } from '../../../../scripts/lib/files.ts'

const run = script(`${import.meta.dirname}/..`, 'run.sh')

// Remove .skip as soon as you start the exercise.
describe.skip('01 Container instead of VM', () => {
  it('starts node:26-slim and cleans up with --rm', () => {
    expect(run).toMatch(/docker run --rm .*node:26-slim/)
  })

  it('shows the PID and kernel of the container', () => {
    expect(run).toContain('process.pid')
    expect(run).toContain('uname -r')
  })

  it('limits memory and CPU and reads the cgroup limits', () => {
    expect(run).toMatch(/--memory 256m/)
    expect(run).toMatch(/--cpus 0\.5/)
    expect(run).toContain('/sys/fs/cgroup/memory.max')
  })

  it('checks the user inside the container', () => {
    expect(run).toMatch(/node:26-slim\s+id\b/)
  })
})
