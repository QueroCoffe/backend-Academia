import { connection, authenticate } from "./config/database.js";
import { clienteRouter } from "./routes/clientes.js";
import express from "express";
import { treinoRouter } from "./routes/planotreino.js";

authenticate(connection).then(() => {
  //connection.sync({force: true});
  connection.sync();
});

//--------------------- uso da aplicação Express
const app = express();
app.use(express.json());

// definição dos endpoints no backend
app.use(clienteRouter);
app.use(treinoRouter);

//---------------------- rodar a aplicação backend
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000/");
});
