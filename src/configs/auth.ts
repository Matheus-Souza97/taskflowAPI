import { env } from "../env"
const authConfig = {
  jwt: {
    secret: env.JWT_SECRETE,
    expiresIn: "1d"
  }
} as const

export { authConfig }