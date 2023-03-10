// Backend (Node.js + Express)
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
app.use(bodyParser.json());
const http = require("http");
const socketio = require("socket.io");
// const server = http.createServer(app);

const ticketRoute = require("./routes/ticket.routes");
const PORT = 5000;
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});
app.use("/ticket", ticketRoute);
mongoose
  .connect(
    "mongodb+srv://ticket:1234566@cluster0.7rsoslq.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = socketio(server, { cors: { origin: "*" } }, { allowEIO3: true });

io.on("connection", (socket) => {
  console.log("A user has connected");

  socket.on("disconnect", () => {
    console.log("A user has disconnected");
  });

  socket.on("new-ticket", (ticketnum) => {
    console.log("new ticket taken");
    io.emit("new-ticket", ticketnum);
  });

  socket.on("next", (counters) => {
    console.log("new counter taken");

    io.emit("next", counters);
  });
});
