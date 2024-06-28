import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function Home() {
  return (
    <Card className="flex w-full flex-1 rounded-md bg-secondary">
      <CardContent className="flex w-full flex-col gap-9 p-4">
        {/* Systems Overview */}
        <div className="flex h-full flex-col gap-3">
          <span className="text-3xl font-medium text-white">Sistemas</span>
          <span className="text-sm font-extralight text-white">
            Há três sistemas de avaliação e qualificação do PBQP-H. Cada um estabelece normas para
            cada área que beneficia consumidores e empresas participantes:
          </span>
          <ItemList>
            <Item
              title="SiAC"
              description="É o sistema do PBQP-H baseado na implantação de sistema de gestão da qualidade pelas empresas de serviços e obras, que são certificados. Cobre no momento apenas as construtoras."
              image="/siac.jpg"
              moreInfoUrl="https://pbqp-h.mdr.gov.br/sistemas/siac/introducao/"
            />
            <Item
              title="SiMaC"
              description="É o sistema do PBQP-H para combater a não conformidade na fabricação, importação e distribuição de materiais, componentes e sistemas construtivos, organizado por meio dos Programas Setoriais da Qualidade (PSQs). O SiMaC tem como referência o cumprimento das normas técnicas brasileiras da ABNT."
              image="/simac.jpg"
              moreInfoUrl="https://pbqp-h.mdr.gov.br/sistemas/simac/introducao/"
            />
            <Item
              title="SiNAT"
              description="É o sistema do PBQP-H de avaliação de desempenho dos produtos convencionais em conformidade com as normas técnicas brasileiras. Também atesta se produtos e sistemas inovadores podem ser utilizados em empreendimentos habitacionais."
              image="/sinat.jpg"
              moreInfoUrl="https://pbqp-h.mdr.gov.br/sistemas/sinat/introducao/"
            />
          </ItemList>
        </div>
        {/* Categories Overview */}
        <div className="flex h-full flex-col gap-3">
          <span className="text-3xl font-medium text-white">Categorias dos Indicadores</span>
          <span className="text-sm font-extralight text-white">
            Para monitorar e gerenciar cada um dos sistemas, foram estabelecidas três categorias de
            indicadores: estratégicos, de desempenho e de resultados:
          </span>
          <ItemList>
            <Item
              title="Estratégico"
              description="Permitem à coordenação do PBQP-H monitorar e estabelecer ações futuras associadas aos seus objetivos estratégicos. Também são úteis para aferir os resultados e acompanhar a evolução do PBQP-H no PPA."
            />
            <Item
              title="Desempenho"
              description="Possibilitam o acompanhamento e avaliação dos sistemas em seus aspectos operacionais, considerando dimensões como abrangência dos sistemas, impactos agregados alcançados nos agentes e a gestão de sua implementação."
            />
            <Item
              title="Resultado"
              description="Associados aos impactos econômicos, sociais, tecnológicos, gerenciais, ambientais e jurídicos, decorrentes da implementação do Programa e de seus sistemas junto aos agentes do setor da construção civil da habitação."
            />
          </ItemList>
        </div>
      </CardContent>
    </Card>
  )
}

function ItemList({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-1 gap-6">{children}</div>
}

function Item({
  title,
  description,
  image,
  moreInfoUrl,
}: {
  title: string
  description: string
  image?: string
  moreInfoUrl?: string
}) {
  return (
    <div className="flex flex-grow basis-1 flex-col items-center gap-3">
      {image && (
        <div className="relative h-[160px] w-full shrink-0">
          <Image
            src={image}
            alt="vista de um local em construção"
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-sm"
          />
        </div>
      )}
      <div className="flex flex-col items-center justify-end gap-3">
        <span className="text-center text-xl text-white">{title}</span>
        <span className="text-xs font-extralight text-white">{description}</span>
        <div className="flex gap-2">
          <Link href="/visao-geral" className={cn(buttonVariants(), 'h-7 text-xs')}>
            Ver Indicadores
          </Link>
          {moreInfoUrl && (
            <Link
              href={moreInfoUrl}
              target="_blank"
              className={cn(
                buttonVariants({ variant: 'link' }),
                'flex h-7 items-center whitespace-nowrap text-xs text-white',
              )}
            >
              Saiba mais
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
