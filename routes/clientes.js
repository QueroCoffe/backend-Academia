import {Cliente} from "../models/cliente.js";
import { Endereco } from "../models/endereco.js";
import { Router } from "express";

//modulo de rotas
export const clienteRouter = Router();

//--------------------- Crud dos Clientes
// listagem de todos os clientes
clienteRouter.get("/clientes", async (req, res) => {
  try {
    const listagemClientes = await Cliente.findAll({ include: [Endereco] });
    res.json(listagemClientes);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar clientes", error });
  }
});

// listagem de um único cliente
clienteRouter.get("/clientes/:id", async (req, res) => {
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

// inserindo novos Clientes
clienteRouter.post("/clientes", async (req, res) => {
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

// Update de um dado
clienteRouter.put("/clientes/:id", async (req, res) => {
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

// remover cliente
clienteRouter.delete("/clientes/:id", async (req, res) => {
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
    res
      .status(500)
      .json({ message: "Ocorreu um erro ao excluir o cliente", error });
  }
});
