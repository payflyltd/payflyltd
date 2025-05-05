import type { User } from "@/types"
import { hash, compare } from "bcryptjs"

// In-memory user store
const users: User[] = []

// Initialize with a default admin user
const initializeUsers = () => {
  if (users.length === 0) {
    users.push({
      id: 1,
      email: "admin@konga.com",
      name: "Admin User",
      password: "$2a$10$8Pn/sFHB.RRGSs1n4s5VEeNpQ2Jn9tQUZKV5Oe.5X7c8JMMHzlYhC", // hashed "password123"
      role: "admin",
      createdAt: new Date().toISOString(),
    })
  }
}

// Get all users
export const getAllUsers = (): Omit<User, "password">[] => {
  initializeUsers()
  // Return users without passwords
  return users.map(({ password, ...user }) => user)
}

// Get user by email
export const getUserByEmail = (email: string): User | undefined => {
  initializeUsers()
  return users.find((user) => user.email === email)
}

// Get user by ID
export const getUserById = (id: number): Omit<User, "password"> | undefined => {
  initializeUsers()
  const user = users.find((user) => user.id === id)
  if (!user) return undefined

  // Return user without password
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

// Create a new user
export const createUser = async (userData: Omit<User, "id" | "createdAt">): Promise<Omit<User, "password">> => {
  initializeUsers()

  // Check if user already exists
  const existingUser = getUserByEmail(userData.email)
  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  // Hash the password
  const hashedPassword = await hash(userData.password, 10)

  // Generate a new ID
  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1

  const newUser: User = {
    ...userData,
    id: newId,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  }

  // Add to users array
  users.push(newUser)

  // Return user without password
  const { password, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

// Verify user credentials
export const verifyCredentials = async (email: string, password: string): Promise<Omit<User, "password"> | null> => {
  initializeUsers()

  const user = getUserByEmail(email)
  if (!user) return null

  try {
    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) return null

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error("Password comparison error:", error)
    return null
  }
}
