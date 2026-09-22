"use client"

import {
  Suspense,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
  type MouseEvent,
  type ReactElement,
} from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { RadioGroup } from "@/components/ui/radio-group"
import { Text } from "@/components/ui/text"
import { Textarea } from "@/components/ui/textarea"
import { TextLink, textLinkClasses } from "@/components/ui/text-link"
import { Notice } from "@/components/patterns/notice"
import { WhatsAppMontado } from "@/components/patterns/whatsapp-montado"
import { WHATSAPP_URL } from "@/lib/contact"
import {
  apagarDadosContinuacao,
  gravarDadosContinuacao,
  type DadosContinuacao,
} from "@/lib/continuar-conversa"
import {
  errosPorCampo,
  ESTADO_INICIAL_LEAD,
  extrairValoresLead,
  LIMITE_CONTEXTO_FORM,
  leadSchema,
  TIPOS_PROJETO,
  type ErrosLead,
} from "@/lib/lead-form"
import type { ContatoPage } from "@/content/schema"
import { submitLead } from "../actions"

const LINK_PRIVACIDADE = "política de privacidade"

/** Ordem dos campos na tela: define o primeiro erro focado e o resumo. */
const ORDEM_CAMPOS = [
  "nome",
  "tipo",
  "contexto",
  "canal",
  "whatsapp",
  "email",
  "empresa",
  "prazo",
] as const

const ROTULO_RESUMO: Record<(typeof ORDEM_CAMPOS)[number], string> = {
  nome: "Seu nome",
  tipo: "O que você quer construir?",
  contexto: "Conte um pouco do contexto",
  canal: "Como prefere continuar?",
  whatsapp: "Seu WhatsApp",
  email: "Seu e-mail",
  empresa: "Empresa, marca ou projeto",
  prazo: "Tem prazo?",
}

const GRUPOS_DE_OPCOES: ReadonlySet<string> = new Set([
  "tipo",
  "canal",
  "prazo",
])

/** A região oculta do contador só anuncia ao passar destes marcos. */
const MARCOS_CONTADOR = [1_800, LIMITE_CONTEXTO_FORM] as const

const formatarNumero = new Intl.NumberFormat("pt-BR").format

/**
 * Filho mínimo que lê `?tipo=` e `?origem=` no navegador (especificação,
 * LeadForm › Renderização): dentro de um `Suspense` próprio para a página
 * continuar estática, e o formulário nunca fica atrás desse `Suspense`.
 * A leitura entra por ref de callback (commit), como na ilha
 * ContinuarConversa, protegida contra a montagem dupla do StrictMode.
 */
function PreSelecao({
  aoLer,
}: {
  aoLer: (tipo: string | null, origem: string | null) => void
}): ReactElement {
  const params = useSearchParams()
  return (
    <span
      hidden
      ref={(no) => {
        if (no) aoLer(params.get("tipo"), params.get("origem"))
      }}
    />
  )
}

/**
 * Ilha do formulário de lead (variante `completa`, copy v1 seção 7 e
 * especificação de componentes › LeadForm). A Server Action é a fonte de
 * verdade; a mesma regra do esquema Zod roda de forma síncrona no `submit`
 * para responder no mesmo quadro da ação da pessoa. Funciona sem JS: o
 * POST vai à action pelo permalink `/contato` e a resposta volta com
 * mensagens, resumo e valores.
 */
export function LeadForm({ contato }: { contato: ContatoPage }): ReactElement {
  const formulario = contato.caminhos.formulario
  const [antesDoLink, depoisDoLink] =
    formulario.privacyNotice.split(LINK_PRIVACIDADE)

  const [estado, formAction, pendente] = useActionState(
    submitLead,
    ESTADO_INICIAL_LEAD,
    "/contato",
  )
  const [errosCliente, setErrosCliente] = useState<ErrosLead>({})
  const [tentativasInvalidas, setTentativasInvalidas] = useState(0)
  const erros: ErrosLead =
    estado.status === "erro" ? estado.erros : errosCliente
  const camposComErro = ORDEM_CAMPOS.filter((campo) => erros[campo])

  const valores = estado.valores

  const [tipoPreSelecionado, setTipoPreSelecionado] = useState<string | null>(
    null,
  )
  const [origem, setOrigem] = useState("")
  const [tamanhoContexto, setTamanhoContexto] = useState(
    valores.contexto.length,
  )
  const [anuncioContador, setAnuncioContador] = useState("")

  const formRef = useRef<HTMLFormElement>(null)
  const resumoRef = useRef<HTMLDivElement>(null)
  const envioRef = useRef<HTMLInputElement>(null)
  const jaLeuParams = useRef(false)
  const tamanhoContextoRef = useRef(valores.contexto.length)

  const rotuloDoTipo = useCallback(
    (valor: string): string =>
      contato.projectTypeOptions.find((opcao) => opcao.value === valor)
        ?.label ?? valor,
    [contato.projectTypeOptions],
  )

  const aoLerParams = useCallback(
    (tipo: string | null, origemParam: string | null) => {
      if (jaLeuParams.current) return
      jaLeuParams.current = true
      if (tipo && (TIPOS_PROJETO as readonly string[]).includes(tipo)) {
        setTipoPreSelecionado(tipo)
      }
      if (origemParam) setOrigem(origemParam)
    },
    [],
  )

  const focarCampo = useCallback((campo: (typeof ORDEM_CAMPOS)[number]) => {
    const form = formRef.current
    if (!form) return
    // Nos grupos de opções o id não existe no controle: foca o primeiro
    // Radio do grupo; nos campos de texto, o próprio campo.
    const controle = GRUPOS_DE_OPCOES.has(campo)
      ? form.querySelector<HTMLElement>(`input[name="${campo}"]`)
      : form.querySelector<HTMLElement>(`#${campo}`)
    controle?.focus()
  }, [])

  // Foca os erros uma vez após cada tentativa inválida. Revalidar um campo
  // ao sair dele não deve puxar o foco durante a correção.
  useEffect(() => {
    if (tentativasInvalidas === 0) return
    if (camposComErro.length === 0) return
    if (camposComErro.length === 1 && camposComErro[0]) {
      focarCampo(camposComErro[0])
    } else {
      resumoRef.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tentativasInvalidas])

  useEffect(() => {
    if (estado.status === "inicial") return
    apagarDadosContinuacao()
    if (estado.status !== "erro") return
    const campos = ORDEM_CAMPOS.filter((campo) => estado.erros[campo])
    if (campos.length === 1 && campos[0]) {
      focarCampo(campos[0])
    } else if (campos.length > 1) {
      resumoRef.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado.status])

  const aoEnviar = (evento: FormEvent<HTMLFormElement>) => {
    // Segundo envio enquanto o primeiro está pendente (Enter num Input não
    // passa pelo guarda do onClick do Button): ignorado aqui também.
    if (pendente) {
      evento.preventDefault()
      return
    }

    const form = evento.currentTarget
    const valoresAtuais = extrairValoresLead((campo) => {
      const valor = new FormData(form).get(campo)
      return typeof valor === "string" ? valor : null
    })
    const resultado = leadSchema.safeParse(valoresAtuais)

    if (!resultado.success) {
      // Erro de validação com JS: a Server Action nem é chamada.
      evento.preventDefault()
      apagarDadosContinuacao()
      setErrosCliente(errosPorCampo(resultado.error))
      setTentativasInvalidas((total) => total + 1)
      return
    }

    setErrosCliente({})

    // Identificador de envio aleatório e não pessoal + gravação da chave
    // de continuação (especificação, WhatsAppLink › Passagem de dados).
    // E-mail e telefone nunca são gravados.
    const envio = crypto.randomUUID()
    if (envioRef.current) envioRef.current.value = envio
    gravarDadosContinuacao({
      envio,
      gravadoEm: Date.now(),
      nome: resultado.data.nome,
      ...(resultado.data.empresa ? { empresa: resultado.data.empresa } : {}),
      tipo: rotuloDoTipo(resultado.data.tipo),
      contexto: resultado.data.contexto,
    })
  }

  // Depois do primeiro envio, cada campo com erro revalida ao sair dele e
  // perde o erro quando corrigido (especificação, LeadForm › Estados).
  const aoSairDoCampo = (evento: FocusEvent<HTMLFormElement>) => {
    const campo = (evento.target as HTMLElement).getAttribute("name")
    if (!campo) return
    // O blur acontece antes do click no próximo controle. Atualizar o DOM
    // nesse intervalo substitui o rádio que a pessoa acabou de apontar.
    requestAnimationFrame(() =>
      setErrosCliente((anteriores) => {
        if (!anteriores[campo as keyof ErrosLead] || !formRef.current) {
          return anteriores
        }
        const valoresAtuais = extrairValoresLead((nome) => {
          const valor = new FormData(formRef.current as HTMLFormElement).get(
            nome,
          )
          return typeof valor === "string" ? valor : null
        })
        const resultado = leadSchema.safeParse(valoresAtuais)
        const novos = resultado.success ? {} : errosPorCampo(resultado.error)
        const mensagem = novos[campo as keyof ErrosLead]
        const copia = { ...anteriores }
        if (mensagem) {
          copia[campo as keyof ErrosLead] = mensagem
        } else {
          delete copia[campo as keyof ErrosLead]
        }
        return copia
      }),
    )
  }

  const aoDigitarContexto = (evento: FormEvent<HTMLTextAreaElement>) => {
    const tamanho = evento.currentTarget.value.length
    const anterior = tamanhoContextoRef.current
    tamanhoContextoRef.current = tamanho
    setTamanhoContexto(tamanho)
    const marco = MARCOS_CONTADOR.find((m) => anterior < m && tamanho >= m)
    if (marco !== undefined) {
      setAnuncioContador(
        `${formatarNumero(tamanho)} de ${formatarNumero(LIMITE_CONTEXTO_FORM)} caracteres`,
      )
    }
  }

  const aoClicarNoResumo =
    (campo: (typeof ORDEM_CAMPOS)[number]) =>
    (evento: MouseEvent<HTMLAnchorElement>) => {
      evento.preventDefault()
      focarCampo(campo)
    }

  const emFallback = estado.status === "fallback"

  // Dados do botão de WhatsApp da falha: vêm do estado do formulário e a
  // URL `wa.me` só existe no clique, nunca num `href` renderizado.
  const dadosFallback: DadosContinuacao = {
    envio: "",
    gravadoEm: 0,
    nome: valores.nome,
    ...(valores.empresa ? { empresa: valores.empresa } : {}),
    tipo: rotuloDoTipo(valores.tipo),
    contexto: valores.contexto,
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      onSubmit={aoEnviar}
      onBlur={aoSairDoCampo}
      className="lead-form flex flex-col gap-(--space-6)"
    >
      <Text medida>{formulario.text}</Text>

      {camposComErro.length >= 2 ? (
        <div
          ref={resumoRef}
          tabIndex={-1}
          className="flex flex-col gap-(--space-3)"
        >
          <Heading nivel={3}>
            Antes de enviar, confira {camposComErro.length} campos:
          </Heading>
          <ul className="flex flex-col gap-(--space-2)">
            {camposComErro.map((campo) => (
              <li key={campo}>
                <a
                  href={`#${campo}`}
                  onClick={aoClicarNoResumo(campo)}
                  className={textLinkClasses("inline")}
                >
                  {ROTULO_RESUMO[campo]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Field id="nome" label="Seu nome" obrigatorio erro={erros.nome}>
        {(aria) => (
          <Input
            {...aria}
            name="nome"
            autoComplete="name"
            defaultValue={valores.nome}
          />
        )}
      </Field>

      <Field
        id="tipo"
        label="O que você quer construir?"
        obrigatorio
        tipo="opcoes"
        ajuda="Escolha a opção mais próxima."
        erro={erros.tipo}
      >
        {(aria) => (
          // A pré-seleção por `?tipo=` chega depois da montagem: a chave
          // remonta o grupo com a opção marcada, sem perder o nome do grupo.
          <RadioGroup
            key={tipoPreSelecionado ?? "sem-pre-selecao"}
            name="tipo"
            aria={aria}
            colunas={2}
            defaultValue={tipoPreSelecionado ?? (valores.tipo || undefined)}
            opcoes={contato.projectTypeOptions.map((opcao) => ({
              valor: opcao.value,
              rotulo: opcao.label,
            }))}
          />
        )}
      </Field>

      <Field
        id="contexto"
        label="Conte um pouco do contexto"
        obrigatorio
        ajuda="O que existe hoje, o que precisa mudar e se há alguma data importante. Duas ou três frases já ajudam."
        erro={erros.contexto}
        contador={`${formatarNumero(tamanhoContexto)} de ${formatarNumero(LIMITE_CONTEXTO_FORM)} caracteres`}
      >
        {(aria) => (
          <Textarea
            {...aria}
            name="contexto"
            defaultValue={valores.contexto}
            onInput={aoDigitarContexto}
          />
        )}
      </Field>

      <Field
        id="canal"
        label="Como prefere continuar?"
        obrigatorio
        tipo="opcoes"
        erro={erros.canal}
      >
        {(aria) => (
          <RadioGroup
            name="canal"
            aria={aria}
            defaultValue={valores.canal || undefined}
            opcoes={[
              { valor: "whatsapp", rotulo: "WhatsApp" },
              { valor: "email", rotulo: "E-mail" },
            ]}
          />
        )}
      </Field>

      {/* O campo do canal escolhido aparece por CSS (`:has()` sobre o Radio
          marcado, ver globals.css). Sem suporte a `:has()` os dois ficam
          visíveis e o servidor exige só o do canal — fallback previsto. */}
      <div data-campo="whatsapp">
        <Field
          id="whatsapp"
          label="Seu WhatsApp"
          obrigatorio
          ajuda="Com DDD. Exemplo: (11) 91234-5678"
          erro={erros.whatsapp}
        >
          {(aria) => (
            <Input
              {...aria}
              name="whatsapp"
              tipo="tel"
              autoComplete="tel"
              inputMode="tel"
              defaultValue={valores.whatsapp}
            />
          )}
        </Field>
      </div>

      <div data-campo="email">
        <Field
          id="email"
          label="Seu e-mail"
          obrigatorio
          ajuda="Exemplo: nome@empresa.com.br"
          erro={erros.email}
        >
          {(aria) => (
            <Input
              {...aria}
              name="email"
              tipo="email"
              autoComplete="email"
              inputMode="email"
              defaultValue={valores.email}
            />
          )}
        </Field>
      </div>

      <Field id="empresa" label="Empresa, marca ou projeto" obrigatorio={false}>
        {(aria) => (
          <Input
            {...aria}
            name="empresa"
            autoComplete="organization"
            defaultValue={valores.empresa}
          />
        )}
      </Field>

      <Field id="prazo" label="Tem prazo?" obrigatorio={false} tipo="opcoes">
        {(aria) => (
          <RadioGroup
            name="prazo"
            aria={aria}
            defaultValue={valores.prazo || undefined}
            opcoes={contato.deadlineOptions.map((opcao) => ({
              valor: opcao,
              rotulo: opcao,
            }))}
          />
        )}
      </Field>

      {/* Honeypot fora da ordem de tabulação e do leitor de tela, com nome
          neutro que o preenchimento automático não reconhece. */}
      <div
        aria-hidden="true"
        className="absolute top-auto -left-[10000px] size-px overflow-hidden"
      >
        <label htmlFor="verificacao">Não preencha este campo</label>
        <input
          id="verificacao"
          name="verificacao"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {/* Carimbo: instante da montagem, gravado uma única vez — regravá-lo
          no envio faria todo envio com JS parecer "rápido demais" para o
          servidor. Propositalmente sem `defaultValue`: o reset que o React
          faz nos campos não controlados depois da action não o esvazia, e
          os reenvios (depois de erro ou fallback) continuam com carimbo.
          Sem JS vai vazio e a verificação é pulada no servidor. */}
      <input
        type="hidden"
        name="carimbo"
        ref={(el) => {
          if (el && !el.value) el.value = String(Date.now())
        }}
      />
      <input type="hidden" name="origem" value={origem} readOnly />
      <input type="hidden" name="envio" ref={envioRef} defaultValue="" />

      <Text papel="caption" tom="muted">
        {antesDoLink}
        <TextLink href="/privacidade" variante="inline">
          {LINK_PRIVACIDADE}
        </TextLink>
        {depoisDoLink}
      </Text>

      <div className="flex flex-col gap-(--space-3) pt-(--space-1) sm:flex-row sm:items-center">
        <Button type="submit" enviando={pendente}>
          {formulario.buttonLabel}
        </Button>
        {/* Único canal do anúncio de envio (RC11): linha reservada. */}
        <p aria-live="polite" className="min-h-(--space-5) text-caption">
          {pendente ? formulario.sendingLabel : ""}
        </p>
      </div>

      {/* Contêiner de alerta (falha de envio) vazio desde a carga; enquanto
          ele tem mensagem, o texto fixo abaixo fica oculto e a mensagem
          ocupa o lugar dele, sem empurrar o formulário (RC11). */}
      <div role="alert">
        {emFallback ? (
          <Notice
            tipo="erro"
            primeiraFrase="A mensagem não foi enviada."
            acao={
              <div>
                <WhatsAppMontado
                  dados={dadosFallback}
                  rotulo="Chamar no WhatsApp"
                  location="contato"
                  context="falha-envio"
                  className="sem-js:hidden"
                />
                <TextLink
                  href={WHATSAPP_URL}
                  variante="acao"
                  className="js:hidden"
                >
                  Chamar no WhatsApp
                </TextLink>
              </div>
            }
          >
            O que você escreveu continua aqui. Tente de novo ou fale direto pelo
            WhatsApp.
          </Notice>
        ) : null}
      </div>
      <div hidden={emFallback}>
        <Text papel="caption" tom="muted">
          {formulario.afterSendText}
        </Text>
      </div>

      {/* Região oculta do contador: anuncia só ao passar dos marcos. */}
      <span aria-live="polite" className="sr-only">
        {anuncioContador}
      </span>

      <Suspense fallback={null}>
        <PreSelecao aoLer={aoLerParams} />
      </Suspense>
    </form>
  )
}
