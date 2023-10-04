import { PrismaAdapter } from "@/lib/auth/prisma-adapter"
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar',
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            },
            profile(profile: GoogleProfile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    avatar_url: profile.picture,
                    username: ''
                }
            }
        }),
    ],

    callbacks: {
        async signIn({ account }) {
            if (!account?.scope?.includes('https://www.googleapis.com/auth/calendar')) {
                return '/register/connect-calendar/?error=permissions'
            }

            return true
        },
        async session({ session, user }) {
            return {
                ...session,
                user
            }
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }