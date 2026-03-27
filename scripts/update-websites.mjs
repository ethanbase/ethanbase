import fs from 'node:fs/promises'

const HUB_URL = 'https://hub.ethanbase.com/api/public/websites?isActive=true&limit=100'
const README_PATH = new URL('../README.md', import.meta.url)

async function main() {
  const res = await fetch(HUB_URL)
  if (!res.ok) {
    throw new Error(`Failed to fetch websites: ${res.status}`)
  }

  const json = await res.json()
  const websites = json?.data?.websites ?? []

  const lines = websites.length
    ? websites.map((site) => `- [${site.name}](${site.url}) — ${site.valueProposition || site.description || site.domain}`)
    : ['_No active products yet._']

  const readme = await fs.readFile(README_PATH, 'utf8')
  const start = '<!-- websites:start -->'
  const end = '<!-- websites:end -->'
  const next = readme.replace(
    new RegExp(`${start}[\\s\\S]*?${end}`, 'm'),
    `${start}\n${lines.join('\n')}\n${end}`
  )

  await fs.writeFile(README_PATH, next)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
