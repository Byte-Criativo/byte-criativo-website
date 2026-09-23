import { BrandLogo } from "@/components/patterns/brand-logo"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { PageFrame } from "@/app/_shared/page-frame"
import { Breadcrumbs } from "@/components/patterns/breadcrumbs"
import { BrowserFrame } from "@/components/patterns/browser-frame"
import { CaseHero } from "@/components/patterns/case-hero"
import { ContinuarConversa } from "@/components/patterns/continuar-conversa"
import { ConversaBand } from "@/components/patterns/conversa-band"
import { CopyEmail } from "@/components/patterns/copy-email"
import {
  EditorialLayout,
  MarcadorNumerado,
  NotasMargem,
} from "@/components/patterns/editorial-layout"
import { FaqItem } from "@/components/patterns/faq-item"
import { Ficha } from "@/components/patterns/ficha"
import {
  FrenteVersoControle,
  FrenteVersoFaces,
  FrenteVersoProvider,
} from "@/components/patterns/frente-verso"
import { GaleriaDialog } from "@/components/patterns/galeria-dialog"
import { IndiceSemicolon } from "@/components/patterns/indice-semicolon"
import { MobileNav } from "@/components/patterns/mobile-nav"
import { NavegacaoTrabalhos } from "@/components/patterns/navegacao-trabalhos"
import { Notice } from "@/components/patterns/notice"
import { PhoneFrame } from "@/components/patterns/phone-frame"
import { Sala } from "@/components/patterns/sala"
import { SalaObserver } from "@/components/patterns/sala-observer"
import { SiteFooter } from "@/components/patterns/site-footer"
import { SiteHeader } from "@/components/patterns/site-header"
import { SituacaoServico } from "@/components/patterns/situacao-servico"
import { TagList } from "@/components/patterns/tag"
import { VideoLoop } from "@/components/patterns/video-loop"
import { WhatsAppLink } from "@/components/patterns/whatsapp-link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Field } from "@/components/ui/field"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { RadioGroup } from "@/components/ui/radio-group"
import { Stack } from "@/components/ui/stack"
import { Text } from "@/components/ui/text"
import { Textarea } from "@/components/ui/textarea"
import { TextLink } from "@/components/ui/text-link"
import { CONTACT_EMAIL } from "@/lib/contact"
import { BotaoEnviandoDemo } from "./botao-enviando"
import {
  CAPACIDADES,
  COLUNAS_RODAPE,
  ITENS_INDICE,
  MENSAGEM_GERAL,
  NAVEGACAO,
  NAVEGACAO_MENU,
  catalogoDisponivel,
} from "./catalogo"

export const metadata: Metadata = {
  title: "Catálogo de componentes",
  robots: { index: false, follow: false },
}

const WORDMARK = <BrandLogo />

function Secao({
  titulo,
  children,
}: {
  titulo: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-(--space-5) border-t-(length:--border-w-decorative) border-solid border-border-decorative py-(--space-7)">
      <Heading nivel={2}>{titulo}</Heading>
      {children}
    </section>
  )
}

export default function CatalogoPage() {
  if (!catalogoDisponivel(process.env)) notFound()

  return (
    <>
      <SiteHeader
        navegacao={NAVEGACAO}
        wordmark={WORDMARK}
        menu={
          <MobileNav
            navegacao={NAVEGACAO_MENU}
            whatsapp={{
              rotulo: "Chamar no WhatsApp",
              mensagem: MENSAGEM_GERAL,
            }}
            emailHref={`mailto:${CONTACT_EMAIL}`}
            wordmark={WORDMARK}
          />
        }
      />

      <PageFrame>
        <SalaObserver salas={["sala-catalogo"]} secoes={["inicio"]} />

        <Container>
          <Heading nivel={1} id="inicio" semicolon className="py-(--space-7)">
            Catálogo de componentes
          </Heading>

          <Secao titulo="Tipografia">
            <Stack espaco={3}>
              <Heading nivel={2} papel="display">
                Display
              </Heading>
              <Heading nivel={2} papel="h2" semicolon>
                Título de seção
              </Heading>
              <Heading nivel={3} semicolon>
                Título menor
              </Heading>
              <Text papel="lede">Lede de abertura de seção.</Text>
              <Text medida>
                Corpo de texto com medida de até 68 caracteres por linha.
              </Text>
              <Text papel="caption" tom="muted">
                Legenda apagada
              </Text>
              <Text as="code" papel="code">
                next build
              </Text>
            </Stack>
          </Secao>

          <Secao titulo="Button e TextLink">
            <div className="flex flex-wrap items-center gap-(--space-4)">
              <Button href="/contato">Falar sobre meu projeto</Button>
              <Button type="button" variante="contorno">
                Ação secundária
              </Button>
              <BotaoEnviandoDemo />
              <TextLink href="/portfolio" variante="acao">
                Ver todos os projetos
              </TextLink>
              <TextLink
                href="https://festivalalumio.com.br"
                variante="acao"
                externo
                complemento="do Festival Alumiô"
              >
                Visitar site
              </TextLink>
              <Text>
                Leia a{" "}
                <TextLink href="/privacidade" variante="inline">
                  política de privacidade
                </TextLink>
                .
              </Text>
            </div>
          </Secao>

          <Secao titulo="Campos">
            <Stack espaco={6} className="max-w-(--medida-max)">
              <Field id="nome" label="Seu nome" obrigatorio>
                {(aria) => <Input {...aria} name="nome" autoComplete="name" />}
              </Field>
              <Field
                id="email"
                label="Seu e-mail"
                obrigatorio
                ajuda="Exemplo: nome@empresa.com.br"
                erro="Escreva um e-mail válido."
              >
                {(aria) => (
                  <Input
                    {...aria}
                    name="email"
                    tipo="email"
                    autoComplete="email"
                  />
                )}
              </Field>
              <Field
                id="contexto"
                label="Conte um pouco do contexto"
                obrigatorio
                contador="120 de 2.000 caracteres"
              >
                {(aria) => <Textarea {...aria} name="contexto" />}
              </Field>
              <Field
                id="tipo"
                label="O que você quer construir?"
                obrigatorio
                tipo="opcoes"
              >
                {(aria) => (
                  <RadioGroup
                    name="tipo"
                    colunas={2}
                    aria={aria}
                    opcoes={[
                      { valor: "site", rotulo: "Um site" },
                      { valor: "sistema", rotulo: "Um sistema" },
                      { valor: "landing", rotulo: "Uma landing page" },
                      { valor: "nao-sei", rotulo: "Ainda não sei" },
                    ]}
                  />
                )}
              </Field>
            </Stack>
          </Secao>

          <Secao titulo="Mensagens e capacidades">
            <Stack espaco={4}>
              <Notice tipo="erro" primeiraFrase="Não deu para enviar agora.">
                Você pode chamar no WhatsApp.
              </Notice>
              <Notice
                tipo="aviso"
                primeiraFrase="Muitas tentativas seguidas."
              />
              <TagList itens={CAPACIDADES} />
              <CopyEmail variante="email" email={CONTACT_EMAIL} />
            </Stack>
          </Secao>

          <Secao titulo="Molduras e mídia">
            <Stack espaco={5}>
              <BrowserFrame
                dominio="festivalalumio.com.br"
                legenda="Topo da programação em festivalalumio.com.br, capturado em 12/09/2026"
              >
                <div className="aspect-video bg-surface-muted" />
              </BrowserFrame>
              <PhoneFrame legenda="Programação no celular, capturada em 12/09/2026">
                <div className="aspect-[390/844] bg-surface-muted" />
              </PhoneFrame>
              <VideoLoop
                poster="/catalogo/poster.svg"
                fontes={[{ src: "/catalogo/loop.mp4", type: "video/mp4" }]}
                descricao="O vídeo mostra a busca de bandas."
                data="Capturado em 12/09/2026."
                complemento="busca de bandas"
                width={1280}
                height={720}
              />
            </Stack>
          </Secao>
        </Container>

        <Secao titulo="Sala, Ficha e FrenteVerso">
          <FrenteVersoProvider projeto="Festival Alumiô">
            <Ficha
              id="ficha-catalogo"
              nome="Festival Alumiô"
              tipo="Site de festival"
              nivel={2}
              frase="A programação na mão, com a cor do Centro Histórico de João Pessoa."
              capacidades={CAPACIDADES}
              estudoDeCasoHref="/portfolio/festival-alumio"
              projetoNoArHref="https://festivalalumio.com.br"
              contagem={{
                atual: 1,
                total: 2,
                proximo: { nome: "Underground PB", href: "#inicio" },
              }}
              controle={<FrenteVersoControle />}
              sala={
                <Sala slug="festival-alumio" id="sala-catalogo">
                  <FrenteVersoFaces
                    frente={<div className="aspect-video bg-surface-muted" />}
                    verso={
                      <Stack espaco={3}>
                        {/* h3 abaixo do h2 do nome do projeto na Ficha. */}
                        <Heading nivel={3}>O que o projeto precisava</Heading>
                        <Text>Programação filtrável e leve no celular.</Text>
                      </Stack>
                    }
                  />
                </Sala>
              }
            />
          </FrenteVersoProvider>
        </Secao>

        <Container>
          <Secao titulo="Case: breadcrumbs, abertura, corpo e galeria">
            <Breadcrumbs
              trilha={[
                { rotulo: "Início", href: "/" },
                { rotulo: "Projetos", href: "/portfolio" },
                { rotulo: "Festival Alumiô" },
              ]}
            />
            <article
              data-case="festival-alumio"
              className="bg-bg py-(--space-6)"
            >
              <CaseHero
                titulo="A programação de um festival na mão de quem vai"
                subtitulo="Um site para o Festival Alumiô, no Centro Histórico de João Pessoa."
                imagem={
                  <BrowserFrame
                    dominio="festivalalumio.com.br"
                    legenda="Abertura do site, capturada em 12/09/2026"
                  >
                    <div className="aspect-video bg-surface-muted" />
                  </BrowserFrame>
                }
                fichaTecnica={[
                  { termo: "Tipo", descricao: "Site de festival" },
                  { termo: "Plataformas", descricao: "Web" },
                  { termo: "Tecnologias", descricao: "Next.js" },
                ]}
                projetoNoAr={{
                  nome: "Festival Alumiô",
                  href: "https://festivalalumio.com.br",
                }}
              />
              <EditorialLayout>
                <Heading nivel={2}>Decisões de design</Heading>
                <figure className="relative">
                  <div className="aspect-video bg-surface-muted" />
                  <MarcadorNumerado
                    numero={1}
                    className="absolute top-(--space-3) left-(--space-3)"
                  />
                  <figcaption className="text-caption">
                    Topo da programação
                  </figcaption>
                </figure>
                <NotasMargem>
                  <li>1. No topo da página, a busca por banda.</li>
                </NotasMargem>
                <Text medida>
                  O corpo do case fica na coluna de texto, com as notas ao lado
                  da figura a partir de 64 rem.
                </Text>
                <GaleriaDialog
                  itens={[
                    {
                      id: "tela-1",
                      legenda: "Busca por banda",
                      ampliada: (
                        <div className="aspect-video bg-surface-muted" />
                      ),
                    },
                    {
                      id: "tela-2",
                      legenda: "Mapa de palcos",
                      ampliada: (
                        <div className="aspect-video bg-surface-muted" />
                      ),
                    },
                  ]}
                >
                  <figure data-galeria-item="tela-1" className="relative">
                    <div className="aspect-video bg-surface-muted" />
                    <figcaption className="text-caption">
                      Busca por banda
                    </figcaption>
                  </figure>
                  <figure data-galeria-item="tela-2" className="relative">
                    <div className="aspect-video bg-surface-muted" />
                    <figcaption className="text-caption">
                      Mapa de palcos
                    </figcaption>
                  </figure>
                </GaleriaDialog>
              </EditorialLayout>
            </article>
            <NavegacaoTrabalhos todosHref="/portfolio" />
          </Secao>

          <Secao titulo="Serviços e dúvidas">
            <SituacaoServico
              itens={[
                {
                  id: "site-antigo",
                  situacao: "O site não acompanha o que a empresa virou.",
                  frase: "Estrutura, texto e tela decididos juntos.",
                  links: [
                    {
                      rotulo: "Ir para Sites e experiências",
                      href: "#inicio",
                    },
                  ],
                },
              ]}
              rodape="Não sabe por onde começar? Definir o escopo é a primeira parte do trabalho."
            />
            <FaqItem pergunta="Quanto custa e quanto tempo leva?">
              Depende do escopo. Depois da primeira conversa, você recebe uma
              proposta com valores, etapas e prazo.
            </FaqItem>
          </Secao>

          <Secao titulo="Continuar a conversa">
            <ContinuarConversa
              canal="whatsapp"
              mensagemGeral={MENSAGEM_GERAL}
              textos={{
                comDados:
                  "Para continuar agora pelo WhatsApp, toque no botão. A mensagem vai com o que você escreveu.",
                semDados:
                  "Se você enviou uma mensagem pelo formulário, ela chegou. A resposta vai pelo canal que você escolheu.",
                rotuloWhatsApp: "Chamar no WhatsApp",
              }}
            />
            <WhatsAppLink
              aparencia="texto"
              rotulo="WhatsApp +55 (83) 99125-3377"
              mensagem={MENSAGEM_GERAL}
              location="footer"
              context="catalogo"
            />
          </Secao>
        </Container>

        <IndiceSemicolon itens={ITENS_INDICE} />

        <ConversaBand
          variante="chamada"
          id="conversa"
          titulo="Seu negócio não tem nada a ver com música?"
          frase="O desafio costuma ser parecido: muita coisa para mostrar e pouca atenção disponível."
          ctaHref="/contato?origem=design-system"
          whatsapp={{
            rotulo: "Chamar no WhatsApp",
            mensagem: MENSAGEM_GERAL,
            location: "cta",
            context: "design-system",
          }}
        />
      </PageFrame>

      <SiteFooter
        tagline="Design e engenharia na mesma frase"
        razaoSocial="Byte Criativo, design e engenharia de software."
        cnpj="CNPJ 52.652.130/0001-02"
        colunas={COLUNAS_RODAPE}
        email={CONTACT_EMAIL}
        whatsapp={{
          rotulo: "WhatsApp +55 (83) 99125-3377",
          mensagem: MENSAGEM_GERAL,
        }}
        copyright="© 2026 Byte Criativo"
      />
    </>
  )
}
