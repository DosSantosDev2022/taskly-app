import NextAuth from 'next-auth'
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import { prisma } from './src/app/lib/prisma'

 
export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
})