"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from "react"
import { flushSync } from "react-dom"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/cn"
import {
  lerEApagarDadosContinuacao,
  montarMensagemContinuacao,
  type DadosContinuacao,
} from "@/lib/continuar-conversa"
import { CopyEmail } from "./copy-email"
import { WhatsAppLink } from "./whatsapp-link"
import { WhatsAppMontado } from "./whatsapp-montado"

export type TextosContinuacao = {
  comDados: string
  semDados: string
  rotuloWhatsApp: string
}

/**
 * Única dona dos dados da chave de continuação em `/contato/obrigado`. Lê
 * uma vez na montagem, apaga na hora e guarda só em estado React — nem o
 * WhatsAppMontado nem o CopyEmail leem armazenamento. No `pagehide`
 * descarta o estado, para o cache de voltar e avançar mostrar a versão sem
 * dados em vez de controles sem conteúdo.
 *
 * **Por que precisa de JS:** a chave só existe no `sessionStorage`. **Sem
 * JS:** a versão sem dados, na mesma caixa reservada, com o WhatsAppLink de
 * mensagem geral — que é também o que o servidor renderiza.
 *
 * A leitura entra por **ref de callback**, não por efeito: gravar estado
 * dentro de efeito é erro de lint neste projeto, e a ref de callback roda no
 * commit, já depois da hidratação, sem divergir do HTML do servidor.
 */
export function ContinuarConversa({
  canal,
  envio,
  mensagemGeral,
  textos,
  className,
}: {
  canal: "whatsapp" | "email"
  envio?: string
  mensagemGeral: string
  textos: TextosContinuacao
  className?: string
}): ReactElement {
  const [dados, setDados] = useState<DadosContinuacao | null>(null)
  // O ref sobrevive à montagem dupla do StrictMode, então a leitura única
  // não é consumida duas vezes em desenvolvimento.
  const jaLeu = useRef(false)

  const aoMontar = useCallback(
    (no: HTMLDivElement | null) => {
      if (!no || jaLeu.current) return
      jaLeu.current = true
      setDados(lerEApagarDadosContinuacao(envio))
    },
    [envio],
  )

  useEffect(() => {
    // `flushSync` porque `pagehide` é a última janela antes de o navegador
    // congelar a página para o cache de voltar e avançar: um descarte
    // agendado para o próximo quadro pode não acontecer antes do retrato, e
    // a pessoa voltaria para controles com dados que já deviam ter sumido.
    const descartar = () => flushSync(() => setDados(null))
    window.addEventListener("pagehide", descartar)
    return () => window.removeEventListener("pagehide", descartar)
  }, [])

  return (
    <div
      ref={aoMontar}
      className={cn(
        // Caixa com a altura mínima da versão com dados: a troca depois da
        // montagem acontece dentro dela, sem empurrar a seção seguinte.
        "flex min-h-(--space-10) flex-col gap-(--space-4)",
        className,
      )}
    >
      {dados ? (
        <>
          <Text>{textos.comDados}</Text>
          <WhatsAppMontado
            dados={dados}
            rotulo={textos.rotuloWhatsApp}
            location="obrigado"
            context={`continuar-${canal}`}
          />
          {canal === "whatsapp" ? (
            <CopyEmail
              variante="mensagem"
              mensagem={montarMensagemContinuacao(dados)}
            />
          ) : null}
        </>
      ) : (
        <>
          <Text>{textos.semDados}</Text>
          <WhatsAppLink
            aparencia="botao"
            rotulo={textos.rotuloWhatsApp}
            mensagem={mensagemGeral}
            location="obrigado"
            context={`sem-dados-${canal}`}
          />
        </>
      )}
    </div>
  )
}
