import express from "express";
const app = express();
import { createServer } from "http";
import { Server } from "socket.io";

import router from "./routes/index.routes";

// import DatabseConnection from "./database/connection";
// import upload from "./modules/fileupload";
import cors from "cors";

app.use(cors());
app.use(express.static("uploads"));
app.use(express.json());
app.use(router);

const port = process.env.PORT || 3001;
// Global databse connection
// app.use(async (req: any, res: any, next: any) => {
//   await DatabseConnection(req, res);
//   if (res.db_status == 200) next();
//   else res.send({ status: res.db_status });
// });

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connect", (socket) => {
  socket.on("con", (details) => {
    socket.broadcast.emit("con", details);
  });

  socket.on("sendNotification", (details) => {
    socket.broadcast.emit("sendNotification", details);
    // console.log(details);
  });
});

// httpServer.listen(3000);

httpServer.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
