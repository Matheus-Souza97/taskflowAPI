import { Request, Response, NextFunction } from "express";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/App.Error";
import { z } from "zod"
import { verify } from "node:crypto";


class MembersContoller{
  async create(request:Request, response:Response, next:NextFunction) {
    const bodySchema = z.object({
      userId: z.string(),
      teamId: z.string()
    })

    const { userId, teamId } = bodySchema.parse(request.body)

    if(!userId) {
      throw new AppError("Informe o ID do membro")
    }

    if(!teamId) {
      throw new AppError("Informe o ID do time")
    }

    const verifyUserId = await prisma.user.findUnique({where: {id:userId}})

    if(!verifyUserId) {
      throw new AppError("User ID notfound", 404)
    }

    const verifyTeamId = await prisma.team.findUnique({where: {id:teamId}})

    if(!verifyTeamId) {
      throw new AppError("Team ID notfound", 404)
    }


    const member = await prisma.teamMember.create({
      data: {
        userId,
        teamId
      }})
    return response.status(201).json()
  }

  async show(request:Request, response:Response, next:NextFunction) {
    const paramSchema = z.object({
      teamId: z.string()
    })
    const { teamId } = paramSchema.parse(request.params)

    const verifyTeamId = await prisma.team.findUnique({where: {id:teamId}})

    if(!verifyTeamId) {
      throw new AppError("Team ID notfound", 404)
    }

    const members = await prisma.teamMember.findMany({where: {teamId}, 
      select: {
        user: {
          select: {
            name: true,
            id: true
          }
        },
        team: {
          select: {
            name: true,
            id: true
          }
        }
      }})

    return response.status(200).json(members)

  }

  async delete(request:Request, response:Response, next:NextFunction) {
    const paramSchema = z.object({
      userId: z.string(),
      teamId: z.string()
    })
    const { userId, teamId } = paramSchema.parse(request.params)

    const verifyUserId = await prisma.user.findUnique({where: {id:userId}})

    if(!verifyUserId) {
      throw new AppError("User ID notfound", 404)
    }

    const verifyTeamId = await prisma.team.findUnique({where: {id:teamId}})

    if(!verifyTeamId) {
      throw new AppError("Team ID notfound", 404)
    }

    const deleteUserFromTeam = await prisma.teamMember.delete({where: {userId_teamId: {userId, teamId}}})

    return response.status(204).json({message: "sucess"})
  }


}

export { MembersContoller }