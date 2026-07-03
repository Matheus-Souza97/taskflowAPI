import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/App.Error";
import { compare } from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { z } from "zod"
import { authConfig } from "@/configs/auth";
import { sign } from "jsonwebtoken";

class SessionsControllers {
  async create(request:Request, response:Response, next:NextFunction) {
    const bodySchema = z.object({
      email: z.string().email("E-mail ou senha invalidos"),
      password: z.string().min(6, "E-mail ou senha invalidos")
    })

    const { email, password } = bodySchema.parse(request.body)

    const user = await prisma.user.findFirst({ where: {email}})

    if(!user) {
      throw new AppError("E-mail ou senha invalidos", 401)
    }

    const passwordMatched = await compare(password, user.password)

    if(!passwordMatched) {
      throw new AppError("E-mail ou senha invalidos", 401)
    }

    const { secret, expiresIn} = authConfig.jwt
    const token = sign({role: user.role ?? "member"}, secret, {
      subject: user.id,
      expiresIn
    })


    return response.json({message: "sucess", token})
  }
}

export { SessionsControllers }
