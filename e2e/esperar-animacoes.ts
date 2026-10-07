import type { Page } from "@playwright/test"

/**
 * Espera as animações finitas da página terminarem. A entrada do hero sobe as
 * palavras do título e faz fade dos blocos por ~1,2 s, e o axe mede a cor que
 * está na tela: no meio do fade o texto e o botão ainda estão translúcidos e
 * o contraste sai baixo, um falso positivo que dependia de quão cedo o `load`
 * chegava. Animações infinitas (a linha do "Rolar") não entram na conta.
 */
export async function esperarAnimacoes(page: Page): Promise<void> {
  await page.waitForFunction(() =>
    document.getAnimations().every((animacao) => {
      const iteracoes = animacao.effect?.getComputedTiming().iterations
      return animacao.playState !== "running" || iteracoes === Infinity
    }),
  )
}
