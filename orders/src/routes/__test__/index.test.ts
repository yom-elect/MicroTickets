import request from "supertest";
import { app } from "../../app";
import { Types } from "mongoose";
import { Ticket } from "../../models/ticket";

const buildTicket = async (title: string, price: number) => {
  const ticket = Ticket.build({
    id: Types.ObjectId().toHexString(),
    title,
    price,
  });
  await ticket.save();

  return ticket;
};

it("fetches orders for a particular user", async () => {
  const ticketOne = await buildTicket("concert01", 20);
  const ticketTwo = await buildTicket("concert02", 40);
  const ticketThree = await buildTicket("concert03", 30);

  const user1 = global.signin();
  const user2 = global.signin();

  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", user2)
    .expect(200);
  expect(response.body.data.length).toEqual(2);
});
