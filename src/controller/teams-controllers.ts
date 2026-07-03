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

  async show(request:Request, response:Response, next:NextFunction) {
    const teams =  await prisma.team.findMany({select: {name: true, id: true, description: true}})

    return response.json(teams)
  }

  async update(request:Request, response:Response, next:NextFunction) {
    const paramSchema = z.object({
      id: z.string()
    })

    const bodySchema = z.object({
      name: z.string().trim().min(1, "O nome do time deve possuir no minimo 1 caractere").max(100, "O nomde deve ter no maximo 100 caracteres"),
      description: z.string().optional()
    })


    const { id } = paramSchema.parse(request.params)
    const { name, description } = bodySchema.parse(request.body)

    const teamUpdate = await prisma.team.update({
      where: {
        id
      },
      data: {
        name,
        description
      }
    })
    
    return response.json(teamUpdate)
  }

  async delete(request:Request, response:Response, next:NextFunction) {
    const paramSchema = z.object({
      id: z.string()
    })

    const { id } = paramSchema.parse(request.params)

    const deleteTeam = await prisma.team.delete({
      where: {id}
    })
    return response.status(201).json({message: "sucess"})
  }
}


export { TeamsController }