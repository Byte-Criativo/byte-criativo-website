import type { ReactElement } from "react"

/** Marca oficial, renderizada no servidor e independente de hidratação. */
export function BrandLogo(): ReactElement {
  return (
    <picture>
      <source srcSet="/byte-wordmark.webp" type="image/webp" />
      {/* Arte oficial: WebP lossless, PNG original como fallback; sem runtime client de imagem. */}
      <img
        src="/logoByte.png"
        width={3535}
        height={647}
        alt=""
        aria-hidden="true"
        decoding="async"
        className="brand-logo"
      />
    </picture>
  )
}
