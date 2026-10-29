// Konfiguration kommt aus der Umgebung. Ohne gültige Config kein Start.
export type Config = { port: number; databaseUrl: string; version: string }

export const readConfig = (env: NodeJS.ProcessEnv = process.env): Config => {
  const port = Number(env.PORT ?? 3000)
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error(`PORT ist ungültig: ${env.PORT}`)
  const databaseUrl = env.DATABASE_URL
  if (!databaseUrl) throw new Error('DATABASE_URL fehlt')
  return { port, databaseUrl, version: env.APP_VERSION ?? 'dev' }
}
