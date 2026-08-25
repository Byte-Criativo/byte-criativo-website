export type LeadFields = {
  name: string
  company: string
  need: string
}

export function buildLeadMessage({ name, company, need }: LeadFields): string {
  const companyPart = company.trim() ? `, da empresa ${company.trim()}` : ""
  return `Olá! Sou ${name.trim()}${companyPart}. Preciso de: ${need.trim()}`
}
