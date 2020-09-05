import request from "supertest";
import { app } from "../../app";

const createTicket = async (title: string, price: number) => {
  return await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    });
};

it("can fetch a list of tickets", async () => {
  await createTicket("Ticket 001", 20);
  await createTicket("Ticket 002", 30);
  await createTicket("Ticket 003", 40);
  const response = await request(app).get("/api/tickets").send().expect(200);
  expect(response.body.data.length).toEqual(3);
});
