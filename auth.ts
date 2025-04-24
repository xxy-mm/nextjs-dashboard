import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import postgres from 'postgres'
import { User } from './app/lib/definitions'
import bcrypt from 'bcryptjs'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials)

        if (!parsedCredentials.success) {
          console.log('Invalid credentials')
          return null
        }

        const { email, password } = parsedCredentials.data
        const user = await getUser(email)

        if (!user) return null

        const passwordsMatch = await bcrypt.compare(password, user.password)
        return passwordsMatch ? user : null
      },
    }),
  ],
})

async function getUser(email: string): Promise<User> {
  try {
    const users = await sql<User[]>`
            SELECT * FROM users WHERE email=${email}
        `
    return users[0]
  } catch (error) {
    console.error('failed to fetch user', error)
    throw new Error('Failed to fetch user.')
  }
}
