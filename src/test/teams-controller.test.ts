import request from "supertest";
import { describe, it, expect, afterAll, beforeAll } from "vitest";
import { prisma } from "@/database/prisma";
import { app } from "@/app";



describe("teamsControler", () => {

  let token: string
  
  beforeAll( async() => {
    const sessions = await request(app).post("/sessions").send({
      email: "admin@teste.com",
      password: "123456"
    })

    token = sessions.body.token
  })

  it("should create a team", async() => {
    const teamCreate = await request(app).post("/teams").set("Authorization", `Bearer ${token}`).send({
      name: "TIME TESTE",
      description: "Time criado para teste"
    })

    expect(teamCreate.status).toBe(201)
  })

  it("should list teams", async() => {
    const listTeams = await request(app).get("/teams").set("Authorization", `Bearer ${token}`)

    expect(listTeams.status).toBe(200)
    expect(Array.isArray(listTeams.body)).toBe(true)
  })

  it("should update team", async() => {
    const id = await prisma.team.findFirst({where: { name: "TIME TESTE"}})
    let teamId = id?.id

    const updateTeam = await request(app).put(`/teams/${teamId}`).set("Authorization", `Bearer ${token}`).send({
      description: "DESCRIÇÃO ALTERADA PARA REALIZAR TESTE"
    })

    expect(updateTeam.status).toBe(200)
  })

  it("should delete team", async() => {
    const id = await prisma.team.findFirst({where: { name: "TIME TESTE"}})
    let teamId = id?.id

    const deleteTeam = await request(app).delete(`/teams/${teamId}`).set("Authorization", `Bearer ${token}`)
    
    expect(deleteTeam.status).toBe(204)
  })
})