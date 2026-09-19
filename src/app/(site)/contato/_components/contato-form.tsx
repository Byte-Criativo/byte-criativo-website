import type { ReactElement } from "react"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup } from "@/components/ui/radio-group"
import { Text } from "@/components/ui/text"
import { TextLink } from "@/components/ui/text-link"
import type { ContatoPage } from "@/content/schema"

const LINK_PRIVACIDADE = "política de privacidade"

/**
 * Estrutura acessível do formulário completo (copy v1, seção 7; anatomia do
 * LeadForm na especificação de componentes). Nesta fase o formulário ainda
 * não envia: a Server Action `submitLead`, a validação, a pré-seleção por
 * `?tipo=`/`?origem=` e a revelação do campo de contato pelo canal chegam
 * com a ilha LeadForm na Fase 10 — por isso os dois campos de contato ficam
 * visíveis (o fallback previsto para ausência de `:has()`) e os campos
 * ocultos vão vazios.
 */
export function ContatoForm({
  contato,
}: {
  contato: ContatoPage
}): ReactElement {
  const formulario = contato.caminhos.formulario
  const [antesDoLink, depoisDoLink] =
    formulario.privacyNotice.split(LINK_PRIVACIDADE)

  return (
    <form method="post" noValidate className="flex flex-col gap-(--space-6)">
      <Text medida>{formulario.text}</Text>

      <Field id="nome" label="Seu nome" obrigatorio>
        {(aria) => <Input {...aria} name="nome" autoComplete="name" />}
      </Field>

      <Field
        id="tipo"
        label="O que você quer construir?"
        obrigatorio
        tipo="opcoes"
        ajuda="Escolha a opção mais próxima."
      >
        {(aria) => (
          <RadioGroup
            name="tipo"
            aria={aria}
            colunas={2}
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
        contador="0 de 2.000 caracteres"
      >
        {(aria) => <Textarea {...aria} name="contexto" />}
      </Field>

      <Field
        id="canal"
        label="Como prefere continuar?"
        obrigatorio
        tipo="opcoes"
      >
        {(aria) => (
          <RadioGroup
            name="canal"
            aria={aria}
            opcoes={[
              { valor: "whatsapp", rotulo: "WhatsApp" },
              { valor: "email", rotulo: "E-mail" },
            ]}
          />
        )}
      </Field>

      <Field
        id="whatsapp"
        label="Seu WhatsApp"
        obrigatorio
        ajuda="Com DDD. Exemplo: (11) 91234-5678"
      >
        {(aria) => (
          <Input
            {...aria}
            name="whatsapp"
            tipo="tel"
            autoComplete="tel"
            inputMode="tel"
          />
        )}
      </Field>

      <Field
        id="email"
        label="Seu e-mail"
        obrigatorio
        ajuda="Exemplo: nome@empresa.com.br"
      >
        {(aria) => (
          <Input
            {...aria}
            name="email"
            tipo="email"
            autoComplete="email"
            inputMode="email"
          />
        )}
      </Field>

      <Field id="empresa" label="Empresa, marca ou projeto" obrigatorio={false}>
        {(aria) => (
          <Input {...aria} name="empresa" autoComplete="organization" />
        )}
      </Field>

      <Field id="prazo" label="Tem prazo?" obrigatorio={false} tipo="opcoes">
        {(aria) => (
          <RadioGroup
            name="prazo"
            aria={aria}
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
      <input type="hidden" name="carimbo" value="" />
      <input type="hidden" name="origem" value="" />
      <input type="hidden" name="envio" value="" />

      <Text papel="caption" tom="muted">
        {antesDoLink}
        <TextLink href="/privacidade" variante="inline">
          {LINK_PRIVACIDADE}
        </TextLink>
        {depoisDoLink}
      </Text>

      <div className="flex flex-col gap-(--space-3) pt-(--space-1) sm:flex-row sm:items-center">
        <Button type="submit">{formulario.buttonLabel}</Button>
        {/* Único canal do anúncio de envio (Fase 10): linha reservada. */}
        <p aria-live="polite" className="min-h-(--space-5) text-caption" />
      </div>

      {/* Contêiner de alerta da falha de envio e do limite (Fase 10), vazio
          desde a carga; o texto fixo ocupa o mesmo lugar. */}
      <div role="alert" />
      <Text papel="caption" tom="muted">
        {formulario.afterSendText}
      </Text>
    </form>
  )
}
