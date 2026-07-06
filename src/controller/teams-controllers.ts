import { Request, Response, NextFunction } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod"
import { AppError } from "@/utils/App.Error";

class TeamsController {
  async create(requeste:Request, response:Response, next:NextFunction) {
    const bodySchema = z.object({
      name: z.string().trim().min(1, "O nome do time deve possuir no minimo 1 caractere").max(100, "O nomde deve ter no maximo 100 caracteres"),
      description: z.string().optional()
    })

    const { name, description} = bodySchema.parse(requeste.body)

    const varifyTeamName = await prisma.team.findFirst({where: {name}})

    if(varifyTeamName){
      throw new AppError("Nome do time não disponivel",400)
    }

    const team = await prisma.team.create({
      data: {
        name,
        description
      }
    })
    return response.status(201).json({team})
  }

  async show(request:Request, response:Response, next:NextFunction) {

    const teams =  await prisma.team.findMany({select: {name: true, id: true, description: true}})

    return response.status(200).json(teams)
  }

  async update(request:Request, response:Response, next:NextFunction) {
    const paramSchema = z.object({
      id: z.string()
    })

    const bodySchema = z.object({
      name: z.string().trim().min(1, "O nome do time deve possuir no minimo 1 caractere").max(100, "O nomde deve ter no maximo 100 caracteres").optional(),
      description: z.string().optional()
    }).refine((data) => data.name !== undefined || data.description !== undefined, {
      message: "Informe pelo menos um campo para atualização."
    })

    const { id } = paramSchema.parse(request.params)

    const verifyIdExist = await prisma.team.findUnique({where: {id}})

    if(!verifyIdExist){
      throw new AppError("ID NotFound", 404)
    }

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
    
    return response.status(200).json(teamUpdate)
  }

  async delete(request:Request, response:Response, next:NextFunction) {
    const paramSchema = z.object({
      id: z.string()
    })

    const { id } = paramSchema.parse(request.params)

    const verifyIdExist = await prisma.team.findUnique({where: {id}})

    if(!verifyIdExist){
      throw new AppError("ID Notfound",404)
    }

    const deleteTeam = await prisma.team.delete({
      where: {id}
    })
    return response.status(204).json({message: "sucess"})
  }
}


export { TeamsController }