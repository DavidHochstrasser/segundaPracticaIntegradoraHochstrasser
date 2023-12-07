import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

import { __dirname } from "./utils.js";
import viewsRouter from "./routes/views.routes.js";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import chatRouter from "./routes/chat.routes.js";
import { MessageManager } from "./controllers/message.manager.mdb.js";

const PORT = 8080;
const MONGOOSE_URL =
  "mongodb+srv://coder_55605:Balcon580@cluster0.ndlarik.mongodb.net/ecommerce";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use("/static", express.static(`${__dirname}/public`));
app.use("/chat", chatRouter);

// CHAT

let message = [];

try {
  await mongoose.connect(MONGOOSE_URL);
  const server = app.listen(PORT, () => {
    console.log(`Backend activo ${PORT} conectado a base de datos`);
  });

  //

  const io = new Server(server);
  const manager = new MessageManager();

  io.on("connection", (socket) => {
    console.log(`Chat actual enviado a ${socket.id}`);

    socket.on("user_connected", async (data) => {
      message = await manager.getMessage();

      socket.emit("messagesLogs", message);
      socket.broadcast.emit("user_connected", data);
    });

    socket.on("message", async (data) => {
      message.push(data);
      await manager.addMessage(data);
      io.emit("messagesLogs", message);
    });
  });
} catch (err) {
  console.log(`No se puede conectar con base de datos (${err.message})`);
}
