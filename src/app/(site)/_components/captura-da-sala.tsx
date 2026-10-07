import type { ReactElement } from "react"
import { BrowserFrame } from "@/components/patterns/browser-frame"
import type { CapturaDaSalaDados } from "./capturas-das-salas"

/**
 * Corte da direção de arte: abaixo de `sm` (30rem, 480 px) a Frente mostra
 * a home do projeto no celular; a partir daí, a captura desktop. Não é `md`
 * (48rem) porque, entre 480 e 767 px, o retrato esticado na largura da sala
 * passaria de 1.000 px de altura, e nessas larguras a captura desktop já se
 * lê. `<source media>` não aceita var(), por isso o valor é literal (é o
 * mesmo `--breakpoint-sm` do globals.css).
 */
const MEDIA_CELULAR = "(width < 30rem)"

/**
 * Largura real da imagem no celular: a sala ocupa a tela toda menos a
 * margem lateral (`--grid-margin`, 20 px de cada lado abaixo de `md`) e a
 * borda do BrowserFrame (`--border-w-decorative`, 1 px de cada lado):
 * 2 × 20 + 2 × 1 = 42 px. `sizes` não aceita var(), por isso o número fica
 * literal; se a margem ou a borda mudarem, este valor muda junto.
 */
const SIZES_CELULAR = "calc(100vw - 42px)"

/**
 * Frente da sala: a captura real dentro do BrowserFrame (a barra com o
 * domínio fica também no celular, porque navegador de celular também tem
 * barra de endereço). Direção de arte com `<picture>`: o navegador baixa uma
 * imagem só por aparelho, sem duas `<img>` escondidas por CSS. O `width` e o
 * `height` do `<source>` reservam a proporção do retrato no celular e os do
 * `<img>`, a da captura desktop, então nenhuma das duas causa CLS.
 *
 * Um texto só serve de `alt` e de legenda visível, e precisa ser verdadeiro
 * para as duas versões. Componente de servidor: zero JS no cliente.
 */
export function CapturaDaSala({
  captura,
  alt,
  loading,
  fetchPriority,
}: {
  captura: CapturaDaSalaDados
  alt: string
  loading: "eager" | "lazy"
  fetchPriority?: "high" | "low" | "auto"
}): ReactElement {
  const { dominio, desktop, celular780, celular1170 } = captura

  return (
    <BrowserFrame dominio={dominio} legenda={alt}>
      {/* `block`: o <picture> é inline por padrão; assim a caixa dele é a
          da imagem, como era quando o <img> ficava direto na moldura. */}
      <picture className="block">
        <source
          media={MEDIA_CELULAR}
          srcSet={`${celular780.src} ${celular780.width}w, ${celular1170.src} ${celular1170.width}w`}
          sizes={SIZES_CELULAR}
          width={celular1170.width}
          height={celular1170.height}
          type="image/webp"
        />
        {/* Tag nativa com dimensões explícitas e WebP estático, para evitar o
            runtime client de next/image no teto de JS da Home. Sem
            eslint-disable: a regra @next/next/no-img-element já isenta o
            <img> dentro de <picture>, e a diretiva sobraria como "não usada". */}
        <img
          src={desktop.src}
          width={desktop.width}
          height={desktop.height}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          className="h-auto w-full object-cover"
        />
      </picture>
    </BrowserFrame>
  )
}
