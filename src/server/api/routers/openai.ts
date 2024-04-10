import { env } from '@/env.mjs'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { z } from 'zod'

const chatModel = new ChatOpenAI({
  openAIApiKey: env.OPENAI_API_KEY,
  modelName: 'gpt-3.5-turbo',
  temperature: 0.01,
})

const promptTextToEquation = new PromptTemplate({
  template: `
    Você traduz linguagem simples em equações MathJax. Use o texto em linguagem 
    simples fornecido para expressar equações matemáticas de maneira legível e 
    formatada em MathJax. Os exemplos a seguir ilustram como você pode fornecer 
    uma descrição simples em linguagem natural de uma equação e obter a correspondente 
    representação em MathJax. É de extrema importância que você forneça apenas
    a equação em MathJax como saída. Não inclua nenhuma outra informação na saída, apenas a equação,
    sem os símbolos de dólar. A equação é totalmente definida pelo texto de entrada, logo,
    não adicione nenhuma informação adicional, como parenteses a mais, retorne apenas a equação
    literalmente como ela foi definida no texto de entrada. Além disso, use \\text{{...}} para
    texto em linguagem natural, como nomes de variáveis, por exemplo ABC = x + y => \\text{{ABC}} = x + y.

    Exemplos:
      Entrada: A soma dos quadrados de x e y é igual a z.
      Saída: x^2 + y^2 = z

      Entrada: NVMJ sublinhado i = (somatorio de x ao quadrado)/n.
      Saída: \\text{{NVMJ}}_i = \\frac{{\\sum x^2}}{{n}}

      Entrada: A média ponderada de a, b e c é d, onde os pesos são w1, w2 e w3, respectivamente.
      Saída: \\frac{{a \\cdot w1 + b \\cdot w2 + c \\cdot w3}}{{w1 + w2 + w3}} = d

      Entrada: A derivada de f em relação a x é igual a g.
      Saída: \\frac{{df}}{{dx}} = g

    Texto a ser traduzido:
    {text}
  `.trim(),
  inputVariables: ['text'],
})

const promptTextToUnit = new PromptTemplate({
  template: `
    Você traduz linguagem simples em unidades de medida. Use o texto em linguagem 
    simples fornecido para expressar unidades de medida de maneira legível e 
    formatada. Os exemplos a seguir ilustram como você pode fornecer 
    uma descrição simples em linguagem natural de uma unidade de medida e obter a correspondente 
    representação. É de extrema importância que você forneça apenas
    a unidade de medida como saída. Não inclua nenhuma outra informação na saída, apenas a unidade de medida,
    sem os símbolos de dólar. A unidade de medida é totalmente definida pelo texto de entrada, logo,
    não adicione nenhuma informação adicional, como parenteses a mais, retorne apenas a unidade de medida
    literalmente como ela foi definida no texto de entrada. Além disso, use \\text{{...}} para
    texto em linguagem natural, como nomes de variáveis, por exemplo CO_{{2,equivalente}} => CO_{{2,\\text{{equivalente}}}}.

    Exemplos:
      Entrada: metros.
      Saída: m

      Entrada: metros por segundo.
      Saída: m/s

      Entrada: metros por segundo ao quadrado.
      Saída: m/s^2

      Entrada: A unidade de medida de w é metros ao quadrado.
      Saída: m^2

      Entrada: metros ao cubo.
      Saída: m^3

      Entrada: total de CO2 equivalente por metro quadrado.
      Saída: tCO_{{2,\text{{equivalente}}}}/m^2

    Texto a ser traduzido:
    {text}
  `.trim(),
  inputVariables: ['text'],
})

const outputParser = new StringOutputParser()
const chainTextToEquation = promptTextToEquation
  .pipe(chatModel)
  .pipe(outputParser)
const chainTextToUnit = promptTextToUnit.pipe(chatModel).pipe(outputParser)

export const openaiRouter = createTRPCRouter({
  textToEquation: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const output = await chainTextToEquation.invoke({ text: input.text })
      return output.replace(/\$/g, '') // remove $ symbols
    }),
  textToUnit: protectedProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const output = await chainTextToUnit.invoke({ text: input.text })
      return output.replace(/\$/g, '') // remove $ symbols
    }),
})
