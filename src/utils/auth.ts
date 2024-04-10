import { UserRole } from '@prisma/client'

function generatePassword(length = 8) {
  const password = []

  const specialChars = '@#'
  const numbers = '1234567890'
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseLetters = lowerCaseLetters.toUpperCase()

  const generateLetter = () => {
    const letters = lowerCaseLetters + upperCaseLetters
    return letters[Math.floor(Math.random() * letters.length)]
  }

  // 1 letra minúscula
  password.push(
    lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)],
  )
  // 1 letra maiúscula
  password.push(
    upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)],
  )
  // 1 caractere especial
  password.push(specialChars[Math.floor(Math.random() * specialChars.length)])
  // 2 números
  password.push(numbers[Math.floor(Math.random() * numbers.length)])
  password.push(numbers[Math.floor(Math.random() * numbers.length)])
  // (length - 5) letras aleatórias
  while (password.length < length) {
    password.push(generateLetter())
  }

  return password.sort(() => Math.random() - 0.5).join('')
}

const mapUserRoleToLabel = (role: UserRole) => {
  switch (role) {
    case UserRole.MEMBER:
      return 'Membro'
    case UserRole.STAFF:
      return 'Equipe'
    case UserRole.ADMIN:
      return 'Administrador'
    case UserRole.SUPER_ADMIN:
      return 'Super Administrador'
  }
}

function isAdmin(role: UserRole) {
  return role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN
}

export { isAdmin, generatePassword, mapUserRoleToLabel }
