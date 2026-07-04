import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/App.Error";
import { z } from "zod"
import { prisma } from "@/database/prisma";




class TaskController {
  async create(request:Request, response:Response, next:NextFunction) {
    const bodySchema = z.object({
      title: z.string().min(10, "O titulo deve ter no minimo 10 caracteres").max(200, "O titulo pode ter no maximo 200 caracteres"),
      description: z.string().optional(),
      status: z.enum(["pending", "in_progress", "completed"]).optional(),
      priority: z.enum(["low", "medium", "high"]).optional(),
      assignedTo: z.string(),
      teamId: z.string()
    })

    const { title, description, status, priority, assignedTo, teamId } = bodySchema.parse(request.body)

    const verifyAssignedTo = await prisma.user.findUnique({where: {id:assignedTo}})

    if(!verifyAssignedTo) {
      throw new AppError("User ID notfound", 404)
    }

    const verifyTeamId = await prisma.team.findUnique({where: {id:teamId}})

    if(!verifyTeamId) {
      throw new AppError("Team ID notfound", 404)
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        assignedTo,
        teamId
      }
    })

    return response.status(200).json(task)
  }

  async show(request:Request, response:Response, next:NextFunction) {
    const tasks = await prisma.task.findMany({
      select: {
        user: {
          select: {
            name:true
          }
        },
        team: {
          select: {
            name:true
          }
        },
        title:true,
        description:true,
        status:true,
        priority:true,
        id:true
      }})

      const result = tasks.map(task => ({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        name: task.user.name,
        team: task.team.name,
        id: task.id
      }))

    return response.status(200).json(result)
  }

  async update(request:Request, response:Response, next:NextFunction) {
    const bodySchema = z.object({
      taskId: z.string("O ID da task é obrigatorio"),
      title: z.string().optional(),
      description: z.string().optional(),
      priority: z.enum(["low", "medium", "high"]).optional(),
      status: z.enum(["pending", "in_progress", "completed"]).optional(),
      assignedTo: z.string("O ID do responsavel pela task é obrigatorio"),
      teamId: z.string("O ID do time responsavel pela task é obrigatorio")
    })

    const { taskId, title, description, priority, status, assignedTo, teamId } = bodySchema.parse(request.body)

    const verifyTaskId = await prisma.task.findUnique({where: {id:taskId}})
    
    if(!verifyTaskId) {
      throw new AppError("Task ID notfound", 404)
    }

    const verifyAssignedTo = await prisma.user.findUnique({where: {id:assignedTo}})

    if(!verifyAssignedTo) {
      throw new AppError("AssignedTo notfound", 404)
    }

    const verifyTeamId = await prisma.team.findUnique({where: {id:teamId}})

    if(!verifyTeamId) {
      throw new AppError("Team ID notfound", 404)
    }

    const {assignedTo:userId} = bodySchema.parse(request.body) 

    const verifyAssignedTo_TeamId = await prisma.teamMember.findUnique({where: {userId_teamId:{userId, teamId}}})

    if(!verifyAssignedTo_TeamId){
      throw new AppError("Membro e time não estao vinculados", 400)
    }

    const taskUpdate = await prisma.task.update({where: {id: taskId}, 
      data: {
        title,
        description,
        priority,
        status,
        assignedTo,
        teamId
      }})

    
    return response.json(taskUpdate)
  }
}

export { TaskController }