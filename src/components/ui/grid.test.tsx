import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Grid } from "./grid"

describe("Grid", () => {
  it("usa 4, 8 e 12 colunas com a medianiz da grade", () => {
    render(<Grid>colunas</Grid>)
    const grade = screen.getByText("colunas")
    expect(grade).toHaveClass("grid-cols-4")
    expect(grade).toHaveClass("md:grid-cols-8")
    expect(grade).toHaveClass("lg:grid-cols-12")
    expect(grade).toHaveClass("gap-(--grid-gutter)")
  })
})
