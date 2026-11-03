import { readdir, readFile, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { join } from 'node:path'

// cf beta currently aborts when a Worker was last changed through the script
// API, while also not exposing the suggested --strict=false option. Patch only
// that generated deployment input until the CLI exposes the flag itself.
const distDirectory = join(process.cwd(), 'node_modules', 'cf', 'dist')
const candidates = (await readdir(distDirectory)).filter(
  (name) => name.startsWith('deploy-input-') && name.endsWith('.mjs'),
)

if (candidates.length !== 1) {
  throw new Error(`Expected one cf deploy input module; found ${candidates.length}.`)
}

const deployInputPath = join(distDirectory, candidates[0])
const source = await readFile(deployInputPath, 'utf8')
const strictMatches = source.match(/strict:!0/g) ?? []

if (strictMatches.length === 0) {
  throw new Error(
    'The cf strict-deploy implementation changed. Remove this workaround and use the supported CLI option.',
  )
}

await writeFile(deployInputPath, source.replaceAll('strict:!0', 'strict:!1'))

const executable = join(
  process.cwd(),
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'cf.cmd' : 'cf',
)
const child = spawn(executable, ['deploy', '--prebuilt', '--mode', 'production'], {
  stdio: 'inherit',
})

child.once('error', (error) => {
  throw error
})

const exitCode = await new Promise((resolve) => {
  child.once('exit', (code) => resolve(code ?? 1))
})

process.exitCode = exitCode
