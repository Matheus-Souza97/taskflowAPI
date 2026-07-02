import { Request, Response, NextFunction } from "express";
import { hash } from "bcrypt"
import { z } from "zod"

class UserController {
  async create(request:Request, response:Response, next:NextFunction) {
    const bodySchema = z.object({
      name: z.string().trim().min(3, "O nome deve conter no minimo 3 caracteres").max(100, "O nome deve conter no maximo 100 caracteres"),
      email: z.string().email("E-mail invalido").max(150),
      password: z.string().min(6, "A senha deve conter no minimo 6 caracteres")
    })

    const { name, email, password } = bodySchema.parse(request.body)

    const hashedPassword = await hash(password, 8)

    return response.json({message: "ok"})
  }
}

export { UserController }