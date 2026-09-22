// Inventário local das fontes visuais dos cases. Não copia nem publica mídia.
// Uso: node scripts/portfolio/media-inventory.mjs [raiz-com-capturas]
// Ex.: node scripts/portfolio/media-inventory.mjs /caminho/para/byte-criativo-website
import { createHash } from "node:crypto"
import { readFile, stat } from "node:fs/promises"
import path from "node:path"

const projectRoot = process.cwd()
const sourceRoot = path.resolve(process.argv[2] ?? projectRoot)

const cases = [
  {
    slug: "underground-pb",
    liveUrl: "https://www.undergroundpb.com.br/",
    trackedCover: "src/assets/case-undergroundpb-screenshot.webp",
    captureDir: "docs/research/captures/2026-09-underground-pb",
    expected: ["home-1440.png", "home-390.png"],
    plannedPublicCover: "public/cases/underground-pb/home-1440.avif",
  },
  {
    slug: "festival-alumio",
    liveUrl: "https://www.festivalalumio.com.br/",
    trackedCover: "src/assets/case-festival-alumio-screenshot.webp",
    captureDir: "docs/research/captures/2026-09-alumio",
    expected: [
      "home-1440.png",
      "home-390.png",
      "programacao-1440.png",
      "programacao-390.png",
      "circuito-1440.png",
      "circuito-390.png",
      "memoria-1440.png",
      "memoria-390.png",
    ],
    plannedPublicCover: "public/cases/festival-alumio/home-1440.avif",
  },
]

function imageDimensions(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
  }
  if (
    bytes.toString("ascii", 0, 4) !== "RIFF" ||
    bytes.toString("ascii", 8, 12) !== "WEBP"
  ) {
    return undefined
  }
  const chunk = bytes.toString("ascii", 12, 16)
  if (chunk === "VP8X") {
    return {
      width: 1 + bytes.readUIntLE(24, 3),
      height: 1 + bytes.readUIntLE(27, 3),
    }
  }
  if (chunk === "VP8 ") {
    return {
      width: bytes.readUInt16LE(26) & 0x3fff,
      height: bytes.readUInt16LE(28) & 0x3fff,
    }
  }
  if (chunk === "VP8L") {
    return {
      width: 1 + (bytes[21] | ((bytes[22] & 0x3f) << 8)),
      height:
        1 + ((bytes[22] >> 6) | (bytes[23] << 2) | ((bytes[24] & 0x0f) << 10)),
    }
  }
  return undefined
}

async function fileRecord(root, relativePath) {
  const absolutePath = path.join(root, relativePath)
  try {
    const [bytes, info] = await Promise.all([
      readFile(absolutePath),
      stat(absolutePath),
    ])
    if (!info.isFile()) return { path: relativePath, exists: false }
    return {
      path: relativePath,
      exists: true,
      bytes: info.size,
      sha256: createHash("sha256").update(bytes).digest("hex"),
      ...(imageDimensions(bytes) && { dimensions: imageDimensions(bytes) }),
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      return { path: relativePath, exists: false }
    }
    throw error
  }
}

const inventory = []
for (const entry of cases) {
  const manifestPath = path.join(entry.captureDir, "manifest.json")
  let manifest = []
  try {
    manifest = JSON.parse(
      await readFile(path.join(sourceRoot, manifestPath), "utf8"),
    )
    if (!Array.isArray(manifest))
      throw new Error(`${manifestPath} não é uma lista`)
  } catch (error) {
    if (error.code !== "ENOENT") throw error
  }

  const captures = await Promise.all(
    entry.expected.map(async (file) => {
      const record = await fileRecord(
        sourceRoot,
        path.join(entry.captureDir, file),
      )
      const metadata = manifest.find((item) => item.file === file)
      return {
        ...record,
        ...(metadata && {
          sourceUrl: metadata.url,
          capturedAt: metadata.capturedAt,
          viewport: metadata.viewport,
          dpr: metadata.dpr,
        }),
      }
    }),
  )

  inventory.push({
    slug: entry.slug,
    liveUrl: entry.liveUrl,
    rightsGate: "D5 pendente; manter os cases em review",
    trackedCover: await fileRecord(projectRoot, entry.trackedCover),
    captureManifest: await fileRecord(sourceRoot, manifestPath),
    captures,
    plannedPublicCover: await fileRecord(projectRoot, entry.plannedPublicCover),
  })
}

console.log(JSON.stringify({ sourceRoot, inventory }, null, 2))
