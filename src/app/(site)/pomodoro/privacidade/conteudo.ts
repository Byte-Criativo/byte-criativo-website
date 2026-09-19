// Texto preservado do site antigo. Fonte de verdade: a fixture do contrato
// e2e em e2e/contract/fixtures/pomodoro-privacidade.txt — o texto visível
// renderizado precisa ser estritamente idêntico (page.test.tsx compara os
// dois). Só a estrutura HTML (títulos, parágrafos) pode mudar.

export type SecaoPolitica = {
  id: string
  titulo: string
  paragrafos: string[]
}

export const pomodoroPrivacidade = {
  h1: "Política de Privacidade",
  intro:
    "Vigente desde 15 de julho de 2026. O Pomodoro funciona localmente no seu Mac. A Byte Criativo não coleta, transmite, vende nem compartilha dados pessoais ou dados de uso deste aplicativo.",
  secoes: [
    {
      id: "dados-armazenados",
      titulo: "Dados armazenados no dispositivo",
      paragrafos: [
        "O app guarda localmente suas durações, preferências, estado da sessão e estatísticas diárias de foco.",
        "Essas informações ficam no contêiner do aplicativo e são usadas somente para manter o timer e suas configurações entre execuções.",
      ],
    },
    {
      id: "notificacoes",
      titulo: "Notificações",
      paragrafos: [
        "Se você ativar notificações, o Pomodoro solicita permissão ao macOS e agenda alertas locais para o fim das sessões. O app não usa servidor de notificações remotas e não envia o conteúdo desses alertas à Byte Criativo.",
      ],
    },
    {
      id: "publicidade-e-patrocinios",
      titulo: "Publicidade e patrocínios",
      paragrafos: [
        "A versão gratuita pode exibir mensagens patrocinadas selecionadas pela Byte Criativo. Esses anúncios são incluídos no próprio aplicativo e não usam redes de publicidade, identificadores, cookies, personalização, analytics ou rastreamento de impressões e cliques.",
        "Ao abrir um patrocinador, seu navegador acessa um site externo sujeito à política desse site.",
      ],
    },
    {
      id: "compras-pela-app-store",
      titulo: "Compras pela App Store",
      paragrafos: [
        "O usuário pode fazer uma compra única para remover os anúncios. A compra, a restauração e o histórico da transação são processados pela Apple por meio da App Store. O Pomodoro mantém apenas um indicador local de uma compra previamente verificada para evitar que anúncios apareçam enquanto a App Store atualiza o estado.",
      ],
    },
    {
      id: "servicos-de-terceiros",
      titulo: "Serviços de terceiros",
      paragrafos: [
        "O app não contém SDKs de anúncios, analytics ou rastreamento. Links externos e os serviços da App Store operam segundo as políticas de seus respectivos provedores.",
      ],
    },
    {
      id: "retencao-e-exclusao",
      titulo: "Retenção e exclusão",
      paragrafos: [
        "Os dados locais permanecem no dispositivo até serem substituídos ou removidos pelo usuário junto com os dados do aplicativo. Como nenhuma conta ou cópia remota é criada, a Byte Criativo não mantém dados do usuário para excluir em seus servidores.",
      ],
    },
    {
      id: "contato",
      titulo: "Contato",
      paragrafos: [
        "Dúvidas sobre esta política podem ser encaminhadas pela nossa página de contato.",
      ],
    },
  ] satisfies SecaoPolitica[],
}

export const POMODORO_PRIVACIDADE_SEO = {
  title: "Política de Privacidade do Pomodoro | Byte Criativo",
  description:
    "Política de privacidade do Pomodoro: o app funciona localmente no seu Mac, sem coleta nem compartilhamento de dados, com anúncios sem rastreamento e compras pela App Store.",
}
