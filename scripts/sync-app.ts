// Kopiert die Werkstatt-Shop API aus app/ in jede Übung mit Dockerfile
// und erzeugt die Tests im Startpunkt aus den Tests der Lösung.
// Jede Übung bleibt so eigenständig: cd exercises/<nr>/start && docker build .
// Aufruf: npm run sync          kopieren
//         npm run sync -- --check  nur prüfen, ob alle Kopien aktuell sind
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'

const root = join(import.meta.dirname, '..')
const app = join(root, 'app')
const parts = ['package.json', 'package-lock.json', 'src', 'db']
const check = process.argv.includes('--check')

const files = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)],
  )

const targets = readdirSync(join(root, 'exercises'))
  .flatMap((exercise) => ['start', 'solution'].map((variant) => join(root, 'exercises', exercise, variant)))
  .filter((dir) => existsSync(join(dir, 'Dockerfile')))

let stale = 0
const compare = (file: string, expected: string) => {
  if (!existsSync(file) || readFileSync(file, 'utf8') !== expected) {
    console.error(`veraltet: ${relative(root, file)}`)
    stale++
  }
}

// Die Tests im Startpunkt sind die Tests der Lösung, nur mit describe.skip.
for (const exercise of readdirSync(join(root, 'exercises'))) {
  const tests = join(root, 'exercises', exercise, 'solution', 'test')
  if (!existsSync(tests)) continue
  for (const file of readdirSync(tests)) {
    const skipped = readFileSync(join(tests, file), 'utf8').replace(
      /^describe\(/m,
      '// Entferne .skip, wenn du loslegst.\ndescribe.skip(',
    )
    const target = join(root, 'exercises', exercise, 'start', 'test', file)
    if (check) compare(target, skipped)
    else {
      mkdirSync(dirname(target), { recursive: true })
      writeFileSync(target, skipped)
    }
  }
}

for (const target of targets) {
  for (const part of parts) {
    const from = join(app, part)
    const to = join(target, part)
    if (check) {
      for (const file of existsSync(from) && !from.endsWith('.json') ? files(from) : [from]) {
        compare(join(to, relative(from, file)), readFileSync(file, 'utf8'))
      }
    } else {
      rmSync(to, { recursive: true, force: true })
      cpSync(from, to, { recursive: true })
    }
  }
}

if (check && stale > 0) {
  console.error(`${stale} Kopien weichen von app/ ab. Führe npm run sync aus.`)
  process.exit(1)
}
console.log(`${targets.length} Übungsordner ${check ? 'geprüft' : 'aktualisiert'}`)
