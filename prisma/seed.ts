import { fakerPT_BR as faker } from '@faker-js/faker'
import {
  Category,
  Group,
  ImpactedAgent,
  ImpactNature,
  Periodicity,
  Polarity,
  PrismaClient,
  Region,
  SystemAbbrev,
  SystemType,
  UserRole,
} from '@prisma/client'
import bcrypt from 'bcrypt'

import * as seeds from './seeds'

const prisma = new PrismaClient()

// 1. create systems
const createSystems = seeds.systems.map((system) =>
  prisma.system.create({
    data: {
      name: system.name,
      abbrev: system.abbrev as SystemAbbrev,
      type: system.type as SystemType,
    },
  }),
)

// 2. create OACs
const createOACs = seeds.oacs.map((oac) =>
  prisma.oac.create({
    data: {
      name: oac.name,
    },
  }),
)

// 3. create PSQs
const createPSQs = seeds.psqs.map((psq) =>
  prisma.psq.create({
    data: {
      name: psq.name,
    },
  }),
)

// 4. create guidelines (diretrizes)
const createGuidelines = seeds.guidelines.map((guideline) =>
  prisma.guideline.create({
    data: {
      name: guideline.name,
    },
  }),
)

// 5. create companies
const createCompaniesAndProjects = seeds.companies.map((company) =>
  prisma.company.create({
    data: {
      name: company.name,
      projects: {
        create: company.projects.map((project) => ({
          name: project.name,
        })),
      },
    },
  }),
)

// 6. create indicators
const createIndicators = seeds.indicators.map((indicator) => {
  const [system, systemType] = indicator.system.split('-')
  return prisma.indicator.create({
    data: {
      category: indicator.category as Category,
      group: indicator?.group as Group,
      index: indicator.index,
      code: indicator.code,
      codeMarkdown: indicator.codeMarkdown,
      name: indicator.name,
      unit: indicator.unit,
      decimalPlaces: indicator?.decimalPlaces || 1,
      polarity: indicator.polarity as Polarity,
      cumulative: indicator.cumulative,
      source: indicator.source,
      periodicity: indicator.periodicity as Periodicity,
      impactNatures: indicator.impactNatures as ImpactNature[],
      impactedAgents: indicator.impactedAgents as ImpactedAgent[],
      purpose: indicator.purpose,
      equationMarkdown: indicator.equationMarkdown,
      equationVarsMarkdown: indicator.equationVarsMarkdown,
      stratifiedByRegion: indicator.stratifiedByRegion,
      stratifiedByCompany: indicator.stratifiedByCompany,
      stratifiedByProject: indicator.stratifiedByProject,
      stratifiedByOAC: indicator.stratifiedByOAC,
      stratifiedByPSQ: indicator.stratifiedByPSQ,
      stratifiedByGuideline: indicator.stratifiedByGuideline,
      system: {
        connect: {
          // eslint-disable-next-line camelcase
          abbrev_type: {
            abbrev: system as SystemAbbrev,
            type: systemType ? (systemType as SystemType) : SystemType.NAO_SE_APLICA,
          },
        },
      },
    },
  })
})

// 6.1. create indicator values
// with random values for each indicator
const NUM_VALUES = 10
const YEARS_RANGE = 10
const ONE_DAY = 1000 * 60 * 60 * 24
const START_DATE = new Date().getTime() - YEARS_RANGE * 365 * ONE_DAY

const createIndicatorValues = seeds.indicators.map((indicator) => {
  const indicatorValues = Array.from({ length: NUM_VALUES }, () => {
    let date
    switch (indicator.periodicity) {
      case Periodicity.TRIMESTRAL:
        date = faker.date.between({ from: START_DATE, to: new Date().getTime() })
        date.setMonth(date.getMonth() - (date.getMonth() % 3))
        date.setDate(1)
        break
      case Periodicity.SEMESTRAL:
        date = faker.date.between({ from: START_DATE, to: new Date().getTime() })
        date.setMonth(date.getMonth() - (date.getMonth() % 6))
        date.setDate(1)
        break
      case Periodicity.ANUAL:
        date = faker.date.between({ from: START_DATE, to: new Date().getTime() })
        date.setMonth(0)
        date.setDate(1)
        break
      case Periodicity.EVENTUAL:
        date = faker.date.between({ from: START_DATE, to: new Date().getTime() })
        break
      default:
        throw new Error('Periodicidade inválida')
    }

    if (indicator.stratifiedByRegion) {
      const regions = Object.values(Region)
      return regions.map((region) => ({
        value: parseFloat(
          faker.number.float({ min: indicator.range[0], max: indicator.range[1] }).toFixed(3),
        ),
        date: new Date(date),
        region,
      }))
    }

    if (indicator.stratifiedByGuideline) {
      return seeds.guidelines.map((guideline) => ({
        value: parseFloat(
          faker.number.float({ min: indicator.range[0], max: indicator.range[1] }).toFixed(3),
        ),
        date: new Date(date),
        guideline,
      }))
    }

    if (indicator.stratifiedByProject) {
      return seeds.companies.flatMap((company) =>
        company.projects.map((project) => ({
          value: parseFloat(
            faker.number.float({ min: indicator.range[0], max: indicator.range[1] }).toFixed(3),
          ),
          date: new Date(date),
          company,
          project,
        })),
      )
    }

    if (indicator.stratifiedByCompany) {
      return seeds.companies.map((company) => ({
        value: parseFloat(
          faker.number.float({ min: indicator.range[0], max: indicator.range[1] }).toFixed(3),
        ),
        date: new Date(date),
        company,
      }))
    }

    if (indicator.stratifiedByOAC) {
      return seeds.oacs.map((oac) => ({
        value: parseFloat(
          faker.number.float({ min: indicator.range[0], max: indicator.range[1] }).toFixed(3),
        ),
        date: new Date(date),
        oac,
      }))
    }

    if (indicator.stratifiedByPSQ) {
      return seeds.psqs.map((psq) => ({
        value: parseFloat(
          faker.number.float({ min: indicator.range[0], max: indicator.range[1] }).toFixed(3),
        ),
        date: new Date(date),
        psq,
      }))
    }

    return [
      {
        value: parseFloat(
          faker.number.float({ min: indicator.range[0], max: indicator.range[1] }).toFixed(3),
        ),
        date: new Date(date),
      },
    ]
  }).flat()

  return indicatorValues.map((indicatorValue) =>
    prisma.indicatorValue.create({
      data: {
        value: indicatorValue.value,
        createdAt: indicatorValue.date,
        region: 'region' in indicatorValue ? indicatorValue.region : null,
        guideline:
          'guideline' in indicatorValue
            ? {
                connect: {
                  name: indicatorValue.guideline.name,
                },
              }
            : undefined,
        company:
          'company' in indicatorValue
            ? {
                connect: {
                  name: indicatorValue.company.name,
                },
              }
            : undefined,
        project:
          'project' in indicatorValue
            ? {
                connect: {
                  name: (indicatorValue.project as { name: string }).name,
                },
              }
            : undefined,
        oac: 'oac' in indicatorValue ? { connect: { name: indicatorValue.oac.name } } : undefined,
        psq: 'psq' in indicatorValue ? { connect: { name: indicatorValue.psq.name } } : undefined,
        indicator: {
          connect: {
            code: indicator.code,
          },
        },
      },
    }),
  )
})

// 7. create users
// 7.1. create roles
const createRoles = Object.values(UserRole).map((role) =>
  prisma.role.create({
    data: { role },
  }),
)

// 7.2. create super admin user
const adminSalt = bcrypt.genSaltSync(10)
const createSuperAdminUser = prisma.user.create({
  data: {
    username: 'super.admin',
    firstName: 'Super Admin',
    lastName: '',
    email: 'super.admin@gmail.com',
    password: bcrypt.hashSync('SADMIN@dashboard2023', adminSalt),
    salt: adminSalt,
    image: 'https://mighty.tools/mockmind-api/content/human/41.jpg',
    createdAt: faker.date.past(),
    role: {
      connect: {
        role: UserRole.SUPER_ADMIN, // super admin role
      },
    },
  },
})

async function seedUsersTables() {
  await prisma.$transaction([
    ...createRoles,
    // ...createFakeUsers,
    createSuperAdminUser,
  ])
}

async function seedMainTables() {
  await prisma.$transaction([
    ...createSystems,
    ...createOACs,
    ...createPSQs,
    ...createGuidelines,
    ...createIndicators,
    ...createCompaniesAndProjects,
    ...createIndicatorValues.flat(),
  ])
}

async function nuke() {
  console.log('🚀 Nuking database records')
  return prisma.$transaction(async (prisma) => {
    await prisma.oac.deleteMany()
    await prisma.psq.deleteMany()
    await prisma.guideline.deleteMany()
    await prisma.project.deleteMany()
    await prisma.company.deleteMany()
    await prisma.indicatorValue.deleteMany()
    await prisma.indicator.deleteMany()
    await prisma.system.deleteMany()
    await prisma.role.deleteMany()
    await prisma.user.deleteMany()
  })
}

async function seed() {
  console.log('🌱 Seeding database')
  await seedMainTables()
  await seedUsersTables()
}

async function main() {
  await nuke()
  await seed()
}

main()
  .then(() => {
    console.log('✅ Database seeding completed')
  })
  .catch((e: Error) => {
    console.log(`❌ ${e.message}`)
  })
  .finally(() => {
    console.log('💀 Shutting down database connection')
    prisma.$disconnect()
  })
