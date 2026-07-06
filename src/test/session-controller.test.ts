import request from "supertest";
import { describe, it, expect, afterAll } from "vitest";
import { app } from "@/app";
import { prisma } from "@/database/prisma";

describe("SessionsController", () => {

  afterAll(async() => {
    await prisma.user.delete({where: { email: "test@test.com" }})
  })

  it("should authenticate and return token", async () => {
    const userResponse = await request(app).post("/users").send({
        name: "Auth Test User",
        email: "test@test.com",
        password: "123456"
      });

      const sessionResponse = await request(app).post("/sessions").send({
        email: "test@test.com",
        password: "123456"
      })

      expect(sessionResponse.status).toBe(200)
      expect(sessionResponse.body.token).toEqual(expect.any(String))
  });
});