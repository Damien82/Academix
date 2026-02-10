import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

const fakeUsers = [
  {
    email: "student@test.com",
    password: "123456",
    role: "student",
    name: "Jean Etudiant",
  },
  {
    email: "delegate@test.com",
    password: "123456",
    role: "delegate",
    name: "Paul Délégué",
  },
  {
    email: "admin@test.com",
    password: "123456",
    role: "admin",
    name: "Admin Principal",
  },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (email, password) => {
    const foundUser = fakeUsers.find(
      (u) => u.email === email && u.password === password
    )

    if (!foundUser) {
      return { success: false, message: "Identifiants incorrects" }
    }

    setUser(foundUser)
    return { success: true, role: foundUser.role }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
