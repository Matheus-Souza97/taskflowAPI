import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/App.Error";
import { z } from "zod"
import { prisma } from "@/database/prisma";

class FilterTaskController { 
  async status(request:Request, response:Response, next:NextFunction) {
    const bodySchema = z.object({
      status: z.enum(["pending", "in_progress", "completed"], "Informe o status corretamente")
    })

    const { status } = bodySchema.parse(request.body)

    const testResult = await prisma.task.findFirst({where:{status}})

    if(!testResult) {
      throw new AppError(`Nenhuma task aberta com o status ${status}`)
    }

    const result = await prisma.task.findMany({where:{status}})

    return response.status(200).json(result)
  }

  async priority(request:Request, response:Response, next:NextFunction) {
    const bodySchema = z.object({
      priority: z.enum(["high", "medium", "low"], "Informe a prioridade corretamente")
    })

    const { priority } = bodySchema.parse(request.body)

    const testResult = await prisma.task.findFirst({where: {priority}})

    if(!testResult) {
      throw new AppError(`Nenhuma task aberta com a prioridade ${priority}`)
    }

    const result = await prisma.task.findMany({where: {priority}})

    return response.json(result)
  }
}

export { FilterTaskController }