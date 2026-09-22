import type { ReactElement, ReactNode } from "react"
import { cn } from "@/lib/cn"
import { Icon } from "./icon"
import type { ControleAria } from "./input"
import { Text } from "./text"

export type FieldAria = ControleAria

/**
 * Contêiner de campo: label visível acima do controle, ajuda antes do
 * controle (nunca em placeholder), erro abaixo e contador por último.
 * O filho é uma função para receber os atributos ARIA já montados: assim
 * nenhum consumidor consegue apontar `aria-describedby` para um id que não
 * está no DOM (RC11).
 */
export function Field({
  id,
  label,
  obrigatorio,
  tipo = "campo",
  ajuda,
  erro,
  contador,
  className,
  children,
}: {
  id: string
  label: string
  obrigatorio: boolean
  tipo?: "campo" | "opcoes"
  ajuda?: string
  erro?: string
  contador?: string
  className?: string
  children: (aria: FieldAria) => ReactNode
}): ReactElement {
  const idAjuda = `${id}-ajuda`
  const idErro = `${id}-erro`
  const idContador = `${id}-contador`

  const descrito = [
    erro ? idErro : null,
    ajuda ? idAjuda : null,
    contador ? idContador : null,
  ]
    .filter((valor): valor is string => valor !== null)
    .join(" ")

  const aria: FieldAria = {
    id,
    required: obrigatorio,
    ...(descrito.length > 0 ? { "aria-describedby": descrito } : {}),
    ...(erro ? { "aria-invalid": true as const } : {}),
  }

  const textoRotulo = `${label} ${obrigatorio ? "(obrigatório)" : "(opcional)"}`
  const classesRotulo = "text-label text-ink"

  const Caixa = tipo === "opcoes" ? "fieldset" : "div"

  // Ajuda, controle, erro e contador, juntos: no tipo "campo" eles são
  // filhos diretos do <div> flex; no tipo "opcoes" eles precisam de um
  // wrapper próprio (ver comentário abaixo do <legend>).
  const conteudo = (
    <>
      {ajuda ? (
        <Text id={idAjuda} papel="caption" tom="muted">
          {ajuda}
        </Text>
      ) : null}

      {children(aria)}

      {erro ? (
        <p
          id={idErro}
          className="flex items-start gap-(--space-2) text-caption text-danger-text [&_svg]:h-(--space-4) [&_svg]:w-(--space-4)"
        >
          <Icon nome="alerta" />
          {erro}
        </p>
      ) : null}

      {contador ? (
        <Text
          id={idContador}
          papel="caption"
          tom="muted"
          className="tabular-nums"
        >
          {contador}
        </Text>
      ) : null}
    </>
  )

  return (
    <Caixa
      // No tipo "opcoes" o id vai para o <fieldset>: é o alvo das âncoras
      // do resumo de erros do LeadForm (#tipo, #canal, #prazo) — sem ele o
      // link não teria destino no HTML sem JS (nos campos de texto o alvo
      // é o próprio controle, que já recebe o id).
      id={tipo === "opcoes" ? id : undefined}
      className={cn(
        // Um <fieldset> com display:flex vira, por definição do próprio
        // HTML, uma caixa anônima de conteúdo que exclui a legend: o `gap`
        // daqui não alcança o espaço entre a legend e o resto (o wrapper
        // abaixo é quem carrega esse gap). .campo-grupo-refluxo (globals.css)
        // reseta o min-width:min-content padrão do fieldset, que travaria o
        // refluxo em 320 px.
        tipo === "opcoes"
          ? "campo-grupo-refluxo"
          : "flex flex-col gap-(--space-2)",
        className,
      )}
    >
      {tipo === "opcoes" ? (
        <legend className={classesRotulo}>{textoRotulo}</legend>
      ) : (
        <label htmlFor={id} className={classesRotulo}>
          {textoRotulo}
        </label>
      )}

      {tipo === "opcoes" ? (
        <div className="flex flex-col gap-(--space-2)">{conteudo}</div>
      ) : (
        conteudo
      )}
    </Caixa>
  )
}
