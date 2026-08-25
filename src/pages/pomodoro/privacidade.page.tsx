import Head from "next/head"
import { generateNextSeo } from "next-seo/pages"
import { Header } from "@/src/components/Header"
import { FooterSection } from "@/src/pages/home/sections/Footer"
import { DEFAULT_OG_IMAGES, ROBOTS_PROPS, SITE_NAME } from "@/src/lib/seo"
import {
  ContactLink,
  PageContainer,
  PrivacyArticle,
  PrivacyHeader,
  PrivacyMain,
  PrivacySection,
} from "./privacidade.styles"

const canonical = "https://www.bcriativo.com/pomodoro/privacidade"
const description =
  "Saiba como o Pomodoro para macOS armazena preferências e estatísticas localmente e protege a privacidade dos usuários."

export default function PomodoroPrivacyPage() {
  return (
    <>
      <Head>
        {generateNextSeo({
          title: "Política de Privacidade do Pomodoro",
          description,
          canonical,
          robotsProps: ROBOTS_PROPS,
          openGraph: {
            title: `Política de Privacidade do Pomodoro | ${SITE_NAME}`,
            description,
            url: canonical,
            images: DEFAULT_OG_IMAGES,
          },
        })}
      </Head>
      <PageContainer>
        <Header />
        <PrivacyMain>
          <PrivacyArticle>
            <PrivacyHeader>
              <span>Pomodoro para macOS</span>
              <h1>Política de Privacidade</h1>
              <p>Vigente desde 15 de julho de 2026.</p>
            </PrivacyHeader>

            <PrivacySection>
              <p>
                O Pomodoro funciona localmente no seu Mac. A Byte Criativo não
                coleta, transmite, vende nem compartilha dados pessoais ou dados
                de uso deste aplicativo.
              </p>
            </PrivacySection>

            <PrivacySection>
              <h2>Dados armazenados no dispositivo</h2>
              <p>
                O app guarda localmente suas durações, preferências, estado da
                sessão e estatísticas diárias de foco. Essas informações ficam
                no contêiner do aplicativo e são usadas somente para manter o
                timer e suas configurações entre execuções.
              </p>
            </PrivacySection>

            <PrivacySection>
              <h2>Notificações</h2>
              <p>
                Se você ativar notificações, o Pomodoro solicita permissão ao
                macOS e agenda alertas locais para o fim das sessões. O app não
                usa servidor de notificações remotas e não envia o conteúdo
                desses alertas à Byte Criativo.
              </p>
            </PrivacySection>

            <PrivacySection>
              <h2>Publicidade e patrocínios</h2>
              <p>
                A versão gratuita pode exibir mensagens patrocinadas
                selecionadas pela Byte Criativo. Esses anúncios são incluídos no
                próprio aplicativo e não usam redes de publicidade,
                identificadores, cookies, personalização, analytics ou
                rastreamento de impressões e cliques. Ao abrir um patrocinador,
                seu navegador acessa um site externo sujeito à política desse
                site.
              </p>
            </PrivacySection>

            <PrivacySection>
              <h2>Compras pela App Store</h2>
              <p>
                O usuário pode fazer uma compra única para remover os anúncios.
                A compra, a restauração e o histórico da transação são
                processados pela Apple por meio da App Store. O Pomodoro mantém
                apenas um indicador local de uma compra previamente verificada
                para evitar que anúncios apareçam enquanto a App Store atualiza
                o estado.
              </p>
            </PrivacySection>

            <PrivacySection>
              <h2>Serviços de terceiros</h2>
              <p>
                O app não contém SDKs de anúncios, analytics ou rastreamento.
                Links externos e os serviços da App Store operam segundo as
                políticas de seus respectivos provedores.
              </p>
            </PrivacySection>

            <PrivacySection>
              <h2>Retenção e exclusão</h2>
              <p>
                Os dados locais permanecem no dispositivo até serem substituídos
                ou removidos pelo usuário junto com os dados do aplicativo. Como
                nenhuma conta ou cópia remota é criada, a Byte Criativo não
                mantém dados do usuário para excluir em seus servidores.
              </p>
            </PrivacySection>

            <PrivacySection>
              <h2>Contato</h2>
              <p>
                Dúvidas sobre esta política podem ser encaminhadas pela nossa{" "}
                <ContactLink href="/contato">página de contato</ContactLink>.
              </p>
            </PrivacySection>
          </PrivacyArticle>
        </PrivacyMain>
        <FooterSection />
      </PageContainer>
    </>
  )
}
