import { Request, Response, NextFunction } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod"

class TeamsController {
  async create(requeste:Request, response:Response, next:NextFunction) {
    const bodySchema = z.object({
      name: z.string().trim().min(1, "O nome do time deve possuir no minimo 1 caractere").max(100, "O nomde deve ter no maximo 100 caracteres"),
      description: z.string().optional()
    })

    const { name, description} = bodySchema.parse(requeste.body)

    const team = await prisma.team.create({
      data: {
        name,
        description
      }
    })
    return response.json({team})
  }
}

export { TeamsController }