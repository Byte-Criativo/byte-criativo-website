import { FormEvent, useState } from "react"
import { buildLeadMessage } from "@/src/lib/lead"
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from "@/src/lib/contact"
import { trackWhatsAppClick } from "@/src/lib/analytics"
import { Field, FormContainer, SubmitButton } from "./styles"

export function LeadForm() {
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [need, setNeed] = useState("")

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const message = buildLeadMessage({ name, company, need })
    trackWhatsAppClick("cta")
    window.open(
      buildWhatsAppUrl(WHATSAPP_NUMBER, message),
      "_blank",
      "noopener,noreferrer",
    )
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Field>
        <label htmlFor="lead-name">Nome</label>
        <input
          id="lead-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
      </Field>
      <Field>
        <label htmlFor="lead-company">Empresa (opcional)</label>
        <input
          id="lead-company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          autoComplete="organization"
        />
      </Field>
      <Field>
        <label htmlFor="lead-need">O que você precisa</label>
        <textarea
          id="lead-need"
          value={need}
          onChange={(e) => setNeed(e.target.value)}
          required
          rows={3}
        />
      </Field>
      <SubmitButton type="submit">Enviar e abrir conversa</SubmitButton>
    </FormContainer>
  )
}
