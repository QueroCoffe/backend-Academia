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
  try {
    const listagemClientes = await Cliente.findAll({ include: [Endereco] });
    res.json(listagemClientes);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar clientes", error });
  }
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
    res.status(404).json({ message: "Cliente não encontrado!" });
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
      await Endereco.update(endereco, { where: { id: cliente.Endereco.id } });
      await cliente.update({ nome, email, telefone });

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
      res.status(404).json({ message: "Cliente não encontrado!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ocorreu um erro ao excluir o cliente", error });
  }
});

//--------------------- CRUD PlanoTreino ---------------------

// Listagem de todos os planos de treino
app.get("/planos", async (req, res) => {
  try {
    const listagemPlanos = await PlanoTreino.findAll();
    res.json(listagemPlanos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar planos de treino", error });
  }
});

// Listagem de um único plano de treino
app.get("/planos/:id", async (req, res) => {
  const plano = await PlanoTreino.findOne({
    where: { id: req.params.id },
  });

  if (plano) {
    res.json(plano);
  } else {
    res.status(404).json({ message: "Plano de treino não encontrado!" });
  }
});

// Inserir novo plano de treino
app.post("/planos", async (req, res) => {
  const { nome, descricao, clienteId } = req.body;

  try {
    await PlanoTreino.create({ nome, descricao, clienteId });
    res.status(201).json({ message: "Plano de treino criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar plano de treino", error });
  }
});

// Atualizar plano de treino
app.put("/planos/:id", async (req, res) => {
  const idPlano = req.params.id;
  const { nome, descricao, clienteId } = req.body;

  try {
    const plano = await PlanoTreino.findOne({ where: { id: idPlano } });

    if (plano) {
      await plano.update({ nome, descricao, clienteId });
      res.json({ message: "Plano de treino atualizado!" });
    } else {
      res.status(404).json({ message: "Plano de treino não encontrado!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar plano de treino", error });
  }
});

// Remover plano de treino
app.delete("/planos/:id", async (req, res) => {
  const idPlano = req.params.id;

  try {
    const plano = await PlanoTreino.findOne({ where: { id: idPlano } });

    if (plano) {
      await plano.destroy();
      res.json({ message: "Plano de treino removido com sucesso" });
    } else {
      res.status(404).json({ message: "Plano de treino não encontrado!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir plano de treino", error });
  }
});

//---------------------- rodar a aplicação backend
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000/");
});
