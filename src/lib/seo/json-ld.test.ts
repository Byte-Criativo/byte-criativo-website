import { describe, expect, it } from "vitest"
import { ORGANIZATION_ID, organization, serializeJsonLd } from "./json-ld"

describe("json-ld", () => {
  it("organização tem @id estável e CNPJ", () => {
    const org = organization()
    expect(org["@id"]).toBe(ORGANIZATION_ID)
    expect(org["taxID"]).toBe("52.652.130/0001-02")
  })

  it("serialização escapa < para evitar fechar a tag script", () => {
    const output = serializeJsonLd({
      name: "</script><script>alert(1)</script>",
    })
    expect(output).not.toContain("<")
    expect(JSON.parse(output).name).toBe("</script><script>alert(1)</script>")
  })
})
