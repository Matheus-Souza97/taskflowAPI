import request from "supertest";
import { describe, expect, it, afterAll, beforeAll } from "vitest";
import { prisma } from "@/database/prisma";
import { app } from "@/app";

describe("taskController", async() => {

  let token: string
  

  beforeAll( async() => {
    const sessions = await request(app).post("/sessions").send({
      email: "admin@teste.com",
      password: "123456"
    })

    token = sessions.body.token

    const createUser = await request(app).post("/users").send({
      name: "User Test",
      email: "usertest@email.com",
      password: "123456"
    })

    const createTeam =  await request(app).post("/teams").set("Authorization", `Bearer ${token}`).send({
      name: "TEST",
      description: "TIME PARA TESTE"
    })

    let user: string
    let team: string

    const verifyUserId = await prisma.user.findUnique({where: { email: "usertest@email.com"}})
    user = verifyUserId!.id

    const verifyTeamId = await prisma.team.findFirst({where: { name: "TEST"}})
    team = verifyTeamId!.id

    const teamMember = await request(app).post("/members").set("Authorization", `Bearer ${token}`).send({
      userId: `${user}`,
      teamId: `${team}`
    })
    
  })

  it("should create a task", async() => {

    let user: string
    let team: string

    const verifyUserId = await prisma.user.findUnique({where: { email: "usertest@email.com"}})
    user = verifyUserId!.id

    const verifyTeamId = await prisma.team.findFirst({where: { name: "TEST"}})
    team = verifyTeamId!.id

    const createTask = await request(app).post("/task").set("Authorization", `Bearer ${token}`).send({
      title: "TITULO TESTE",
      description: "TESTE",
      assignedTo: `${user}`,
      teamId: `${team}`
    })

    expect(createTask.status).toBe(200)
  })

  it("should list tasks", async() => {
    const listTasks = await request(app).get("/task").set("Authorization", `Bearer ${token}`)

    expect(listTasks.status).toBe(200)
    expect(Array.isArray(listTasks.body)).toBe(true)
  })

  it("should update a task", async() => {
    let user: string
    let task: string
    let team: string

    const verifyUserId = await prisma.user.findUnique({where: { email: "usertest@email.com"}})
    user = verifyUserId!.id

    const verifyTeam = await prisma.team.findFirst({where: { name: "TEST"}})
    team = verifyTeam!.id

    const verifYTaskId = await prisma.task.findFirst({where: { description: "TESTE" }})
    task = verifYTaskId!.id

    const updateTask = await request(app).put("/task").set("Authorization", `Bearer ${token}`).send({
      taskId: `${task}`,
      title: "TASK TEST",
      description: "DESCRIPTION TEST",
      assignedTo: `${user}`,
      teamId: `${team}`
    })

    expect(updateTask.status).toBe(200)
  })

  it("should delete task and clear BD", async() => {
    let user: string
    let task: string
    let team: string

    const verifyUserId = await prisma.user.findUnique({where: { email: "usertest@email.com"}})
    user = verifyUserId!.id

    const verifyTeam = await prisma.team.findFirst({where: { name: "TEST"}})
    team = verifyTeam!.id

    const verifYTaskId = await prisma.task.findFirst({where: { title: "TASK TEST" }})
    task = verifYTaskId!.id


    const deleteTask = await request(app).delete(`/task/${task}`).set("Authorization", `Bearer ${token}`)
    const deleteMember = await request(app).delete(`/members/user/${user}/team/${team}`).set("Authorization", `Bearer ${token}`)
    const deleteTeam = await request(app).delete(`/teams/${team}`).set("Authorization", `Bearer ${token}`)
    const deleteUser = await await request(app).delete(`/users/${user}`).set("Authorization",  `Bearer ${token}`)


    expect(deleteTask.status).toBe(204)
    expect(deleteMember.status).toBe(204)
    expect(deleteTeam.status).toBe(204)
    expect(deleteUser.status).toBe(204)
  })
})