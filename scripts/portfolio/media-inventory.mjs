// Inventário local das fontes e dos derivados visuais dos cases.
// Uso: node scripts/portfolio/media-inventory.mjs [raiz-com-capturas]
// Ex.: node scripts/portfolio/media-inventory.mjs /caminho/para/byte-criativo-website
import { createHash } from "node:crypto"
import { readFile, stat } from "node:fs/promises"
import path from "node:path"

const projectRoot = process.cwd()
const sourceRoot = path.resolve(process.argv[2] ?? projectRoot)

const cases = [
  {
    slug: "carlos-ferrer",
    liveUrl: "https://www.carlosferrer.online/",
    trackedCover: "src/assets/case-carlos-ferrer-screenshot.webp",
    captureDir:
      "docs/research/captures/staging/2026-09-22T18-01-31-970Z-carlos-ferrer-rUDjgi",
    expected: [
      "home-1440.png",
      "home-390.png",
      "1997-1440.png",
      "1997-390.png",
    ],
    publicMedia: ["home-1440.avif", "home-390.avif", "era-1997-1440.avif"],
  },
  {
    slug: "goromax",
    liveUrl: "https://www.goromax.com.br/",
    trackedCover: "src/assets/case-goromax-screenshot.webp",
    captureDir:
      "docs/research/captures/staging/2026-09-22T17-58-34-474Z-goromax-pcbeza",
    expected: [
      "home-1440.png",
      "home-390.png",
      "imprensa-1440.png",
      "imprensa-390.png",
    ],
    publicMedia: ["home-1440.avif", "imprensa-1440.avif", "home-390.avif"],
  },
  {
    slug: "underground-pb",
    liveUrl: "https://www.undergroundpb.com.br/",
    trackedCover: "src/assets/case-undergroundpb-screenshot.webp",
    captureDir:
      "docs/research/captures/staging/2026-09-22T18-01-10-146Z-underground-pb-uy902r",
    expected: [
      "home-1440.png",
      "home-390.png",
      "agenda-1440.png",
      "agenda-390.png",
      "palcos-1440.png",
      "palcos-390.png",
    ],
    publicMedia: [
      "home-1440.avif",
      "agenda-1440.avif",
      "palcos-1440.avif",
      "palcos-390.avif",
    ],
  },
  {
    slug: "festival-alumio",
    liveUrl: "https://www.festivalalumio.com.br/",
    trackedCover: "src/assets/case-festival-alumio-screenshot.webp",
    captureDir:
      "docs/research/captures/staging/2026-09-22T18-02-01-295Z-festival-alumio-buZZ42",
    expected: [
      "home-1440.png",
      "home-390.png",
      "programacao-1440.png",
      "programacao-390.png",
      "circuito-1440.png",
      "circuito-390.png",
    ],
    publicMedia: [
      "home-1440.avif",
      "programacao-1440.avif",
      "circuito-1440.avif",
      "programacao-390.avif",
    ],
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
  const localManifest = await fileRecord(projectRoot, manifestPath)
  const captureRoot = localManifest.exists ? projectRoot : sourceRoot
  let manifest = []
  try {
    manifest = JSON.parse(
      await readFile(path.join(captureRoot, manifestPath), "utf8"),
    )
    if (!Array.isArray(manifest))
      throw new Error(`${manifestPath} não é uma lista`)
  } catch (error) {
    if (error.code !== "ENOENT") throw error
  }

  const captures = await Promise.all(
    entry.expected.map(async (file) => {
      const record = await fileRecord(
        captureRoot,
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
    rightsNote:
      "Capturas autorizadas; revisão editorial de novos materiais antes da promoção. Ver docs/case-approvals.md.",
    trackedCover: await fileRecord(projectRoot, entry.trackedCover),
    captureStatus: "selected-after-visual-review-local-only",
    captureRoot,
    captureManifest: await fileRecord(captureRoot, manifestPath),
    captures,
    publicMedia: await Promise.all(
      entry.publicMedia.map((file) =>
        fileRecord(projectRoot, path.join("public/cases", entry.slug, file)),
      ),
    ),
  })
}

console.log(JSON.stringify({ sourceRoot, inventory }, null, 2))
