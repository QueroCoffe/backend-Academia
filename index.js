import { connection, authenticate } from "./config/database.js";
import { Cliente } from "./models/cliente.js";
import { Endereco } from "./models/endereco.js";
import { PlanoTreino } from "./models/planotreino.js";

authenticate(connection).then(() => {
  //connection.sync({force: true});
  connection.sync();
});
