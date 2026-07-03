import { Request, Response, NextFunction } from "express";
import { prisma } from "@/database/prisma";
import { hash } from "bcrypt"
import { z } from "zod"
import { AppError } from "@/utils/App.Error";

class UserController {
  async create(request:Request, response:Response, next:NextFunction) {
    const bodySchema = z.object({
      name: z.string().trim().min(3, "O nome deve conter no minimo 3 caracteres").max(100, "O nome deve conter no maximo 100 caracteres"),
      email: z.string().email("E-mail invalido").max(150),
      password: z.string().min(6, "A senha deve conter no minimo 6 caracteres")
    })

    const { name, email, password } = bodySchema.parse(request.body)

    const userWithSameEmail = await prisma.user.findFirst({where: {email}})

    if(userWithSameEmail) {
      throw new AppError("E mail não disponivel")
    }

    const hashedPassword = await hash(password, 8)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    const { password:_, ...userWithoutPassword } = user

    return response.json({userWithoutPassword})
  }
}

export { UserController }