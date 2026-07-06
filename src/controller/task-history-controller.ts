import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/App.Error";
import { prisma } from "@/database/prisma";
import { z } from "zod"

class TaskHistoryController {
  async show(request:Request, response:Response, next:NextFunction) {
    const paramSchema = z.object({
      taskId: z.string()
    })

    const { taskId } = paramSchema.parse(request.params)

    const verifyTaskId = await prisma.task.findUnique({where:{id:taskId}})

    if(!verifyTaskId) {
      throw new AppError("Task ID notfound", 404)
    }

    const taskHistory = await prisma.taskHistory.findMany({where:{taskId},
    orderBy: {
      changedAt: "desc"
    }})

    

    return response.json(taskHistory)
  }
}

export { TaskHistoryController }