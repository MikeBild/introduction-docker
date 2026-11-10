import { defineConfig } from 'vitest/config'

// Tests of the app, all solutions and all starting points.
// The starting points use describe.skip and count as skipped until you remove .skip.
export default defineConfig({
  test: {
    include: ['app/test/**/*.test.ts', 'exercises/*/{start,solution}/test/**/*.test.ts'],
  },
})
