import { connection, authenticate } from "./config/database.js";
import { Cliente } from "./models/cliente.js";
import { Endereco } from "./models/endereco.js";
import { PlanoTreino } from "./models/planotreino.js";
import express from "express";

authenticate(connection).then(() => {
  //connection.sync({force: true});
  connection.sync();
});

//--------------------- uso da aplicação Express
const app = express();
app.use(express.json());

//--------------------- listagem de todos os clientes
app.get("/clientes", async (req, res) => {
  const listagemClientes = await Cliente.findAll();
  res.json(listagemClientes);
});

// listagem de um único cliente
app.get("/clientes/:id", async (req, res) => {
  const cliente = await Cliente.findOne({
    where: { id: req.params.id },
    include: [Endereco],
  });

  if (cliente) {
    res.json(cliente);
  } else {
    res.status(404).json({ message: "Cliente não encotrado!" });
  }
});

//---------------------- inserindo novos Clientes
app.post("/clientes", async (req, res) => {
  const { nome, email, telefone, endereco } = req.body;

  try {
    // tentativa de inserir o cliente
    await Cliente.create(
      { nome, email, telefone, endereco },
      { include: [Endereco] }
    );
    res.status(201).json({ message: "Cliente criado com sucesso!" });
  } catch (error) {
    // tratamento caso ocorra algum erro
    res.status(500).json({ message: "Algo de errado não está certo!" });
  }
});

//---------------------- Update de um dado
app.put("/clientes/:id", async (req, res) => {
  const idCliente = req.params.id;
  const { nome, email, telefone, endereco } = req.body;

  try {
    const cliente = await Cliente.findOne({ where: { id: idCliente } });

    if (cliente) {
      await Endereco.update(endereco, { where: { id: idCliente } });
      await cliente.update({ nome, email, telefone, endereco });

      res.json({ message: "Cliente atualizado!" });
    } else {
      res.status(404).json({ message: "Cliente não encontrado!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ocorreu um erro ao atualizar o cliente" });
  }
});

//---------------------- remover cliente
app.delete("/clientes/:id", async (req, res) => {
  const idCliente = req.params.id;

  try {
    const cliente = await Cliente.findOne({ where: { id: idCliente } });

    if (cliente) {
      await cliente.destroy();
      res.json({ message: "Cliente removido com sucesso" });
    } else {
      res.status(404).json({ message: "cliente não encontrado!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ocorreu um erro ao excluir o cliente" });
  }
});

//---------------------- rodar a aplicação backend
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000/");
});
