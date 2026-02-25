import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Extend the session type
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role?: string;
            userType?: "ADMIN" | "EMPLOYEE";
        } & DefaultSession["user"]
    }
}

interface AuthUser {
    id: string;
    name: string;
    role: string;
    userType: "ADMIN" | "EMPLOYEE";
}

// Optimized: Search both tables in parallel and use secure comparison
async function findUserByCredentials(username: string, password: string): Promise<AuthUser | null> {
    try {
        console.log("findUserByCredentials called for username:", username);
        const [user, employee] = await Promise.all([
            prisma.user.findFirst({ where: { username } }),
            prisma.employee.findFirst({ where: { username, status: "Active" } })
        ]);

        console.log("Found user:", !!user, "Found employee:", !!employee);

        // Check Admin User
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            console.log("User password match:", isMatch);
            if (isMatch) {
                return {
                    id: user.id,
                    name: username,
                    role: user.role,
                    userType: "ADMIN"
                };
            }
        }

        // Check Employee
        if (employee && employee.password) {
            const isMatch = await bcrypt.compare(password, employee.password);
            console.log("Employee password match:", isMatch);
            if (isMatch) {
                return {
                    id: employee.id,
                    name: employee.name,
                    role: employee.role,
                    userType: "EMPLOYEE"
                };
            }
        }

        console.log("No password match found for either user or employee");
        return null;
    } catch (error) {
        console.error("Failed to authenticate:", error);
        return null;
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: process.env.AUTH_SECRET,
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ username: z.string(), password: z.string().min(3) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { username, password } = parsedCredentials.data;
                    return await findUserByCredentials(username, password);
                }

                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const u = user as AuthUser;
                token.id = u.id;
                token.name = u.name;
                token.role = u.role;
                token.userType = u.userType;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.role = token.role as string;
                session.user.userType = token.userType as "ADMIN" | "EMPLOYEE";

                // Final safety for root admin user
                if (session.user.name?.toLowerCase() === 'admin' || token.userType === "ADMIN") {
                    session.user.userType = "ADMIN";
                    session.user.role = (token.role as string) || "ADMIN";
                }
            }
            return session;
        }
    }
});

