import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper"; //jest would give the fake or mocked instance

it("Returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "New Ticket update",
      price: "20",
    })
    .expect(404);
});

it("Returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "New Ticket update",
      price: "20",
    })
    .expect(401);
});
it("Returns a 401 if the user does not own the tickets", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "User random ticket",
      price: 25,
    });

  await request(app)
    .put(`/api/tickets/${response.body.data.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "User updates random ticket",
      price: 20,
    })
    .expect(401);
});
it("Returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "User random ticket",
      price: 25,
    });
  await request(app)
    .put(`/api/tickets/${response.body.data.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.data.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Updated Ticket title",
      price: -88,
    })
    .expect(400);
});

it("Updated the tickets provided valid inputs", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "User random ticket",
      price: 25,
    });
  await request(app)
    .put(`/api/tickets/${response.body.data.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Updated Title",
      price: 20,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.data.id}`)
    .send();
  expect(ticketResponse.body.data.title).toEqual("Updated Title");
  expect(ticketResponse.body.data.price).toEqual(20);
});

it("publishes an event", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "User random ticket",
      price: 25,
    });
  await request(app)
    .put(`/api/tickets/${response.body.data.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Updated Title",
      price: 20,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if the ticket is reserved", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "User random ticket",
      price: 25,
    });

  const ticket = await Ticket.findById(response.body.data.id);
  ticket!.set({
    orderId: mongoose.Types.ObjectId().toHexString(),
  });
  await ticket!.save();
  await request(app)
    .put(`/api/tickets/${response.body.data.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Updated Title",
      price: 20,
    })
    .expect(400);
});
