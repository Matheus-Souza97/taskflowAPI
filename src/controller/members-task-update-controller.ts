import { Response, Request, NextFunction } from "express";
import { AppError } from "@/utils/App.Error";
import { z } from "zod"
import { prisma } from "@/database/prisma";
import { taskRouter } from "@/routes/task-routes";

class MembersTaskUpdateController {
  async update(request:Request, response:Response, next:NextFunction) {
    const paramSchema = z.object({
      id: z.string()
    })

    const bodySchema = z.object({
      taskId: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      priority: z.enum(["low", "medium", "high"]).optional(),
      status: z.enum(["pending", "in_progress", "completed"]).optional()
    })

    const { id } = paramSchema.parse(request.params)
    const { taskId, title, description, priority, status } = bodySchema.parse(request.body)

    const verifyUserId = await prisma.task.findFirst({where: {assignedTo:id}})

    if(!verifyUserId) {
      throw new AppError("ID de usuario invalido", 404)
    }

    const verifyTaskId = await prisma.task.findUnique({where: { id: taskId}})

    if(!verifyTaskId) {
      throw new AppError("Task ID invalido", 404)
    }

    const verifyTaskByMember = await prisma.task.findFirst({where: {assignedTo:id, id:taskId}})

    if(!verifyTaskByMember) {
      throw new AppError("Task não vinculada ao usuario", 401)
    }

    if(status) {
      if(status != verifyTaskId.status) {
        await prisma.taskHistory.create({
          data: {
            taskId,
            changedBy: id,
            oldStatus: verifyTaskId.status,
            newStatus: status
          }
        })
      }
    }

    const taskUpdate = await prisma.task.update({where: {id: taskId},
    data: {
      title,
      description,
      priority,
      status
    }})

    return response.status(200).json(taskUpdate)
  }
}

export { MembersTaskUpdateController }