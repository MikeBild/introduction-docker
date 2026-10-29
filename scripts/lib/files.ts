import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'

// Kleine Helfer für die Tests der Übungen: Dockerfile, Compose-Datei und Shell-Skripte lesen.

export type Instruction = { cmd: string; args: string }
export type Stage = { from: string; name?: string; instructions: Instruction[] }

export const read = (dir: string, file: string): string => {
  const path = join(dir, file)
  if (!existsSync(path)) throw new Error(`${file} fehlt in ${dir}`)
  return readFileSync(path, 'utf8')
}

// Zerlegt ein Dockerfile in Anweisungen: Kommentare raus, Zeilenfortsetzungen zusammenziehen.
export const parseDockerfile = (text: string): Instruction[] =>
  text
    .replace(/\\\r?\n/g, ' ')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [cmd = '', ...rest] = line.split(/\s+/)
      return { cmd: cmd.toUpperCase(), args: rest.join(' ') }
    })

export const stages = (instructions: Instruction[]): Stage[] => {
  const result: Stage[] = []
  for (const instruction of instructions) {
    if (instruction.cmd === 'FROM') {
      const [from = '', as, name] = instruction.args.split(/\s+/)
      result.push({ from, name: as?.toUpperCase() === 'AS' ? name : undefined, instructions: [] })
    } else {
      result.at(-1)?.instructions.push(instruction)
    }
  }
  return result
}

export const dockerfile = (dir: string, file = 'Dockerfile') => {
  const all = parseDockerfile(read(dir, file))
  const allStages = stages(all)
  const final = allStages.at(-1)
  if (!final) throw new Error('Dockerfile ohne FROM')
  return { all, stages: allStages, final }
}

export const dockerignore = (dir: string): string[] =>
  read(dir, '.dockerignore')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))

// Compose-Datei als Objekt. Die Typen bleiben bewusst locker, die Tests prüfen Felder einzeln.
export type Service = {
  image?: string
  build?: string | { context?: string; dockerfile?: string; args?: Record<string, string> }
  ports?: string[]
  environment?: Record<string, string> | string[]
  env_file?: string | string[]
  volumes?: string[]
  networks?: string[] | Record<string, unknown>
  depends_on?: string[] | Record<string, { condition?: string; restart?: boolean }>
  healthcheck?: { test?: string[] | string; interval?: string; timeout?: string; retries?: number; start_period?: string }
  logging?: { driver?: string; options?: Record<string, string> }
  read_only?: boolean
  cap_drop?: string[]
  security_opt?: string[]
  user?: string
  restart?: string
  tmpfs?: string[]
}
export type Compose = {
  services: Record<string, Service>
  volumes?: Record<string, unknown>
  networks?: Record<string, unknown>
  version?: string
}

export const compose = (dir: string, file = 'compose.yaml'): Compose => parse(read(dir, file)) as Compose

// Shell-Skript ohne Kommentare und mit zusammengezogenen Zeilenfortsetzungen.
export const script = (dir: string, file: string): string =>
  read(dir, file)
    .replace(/\\\r?\n/g, ' ')
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith('#'))
    .join('\n')
