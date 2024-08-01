import { PlanoTreino } from "../models/planotreino.js";
import { Cliente } from "../models/cliente.js";
import { Router } from "express";

export const treinoRouter = Router();

//--------------------- CRUD PlanoTreino ---------------------

// Listagem de todos os planos de treino
treinoRouter.get("/planos", async (req, res) => {
  try {
    const listagemPlanos = await PlanoTreino.findAll();
    res.json(listagemPlanos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar planos de treino", error });
  }
});

// Listagem de um único plano de treino
treinoRouter.get("/planos/:id", async (req, res) => {
  const plano = await PlanoTreino.findOne({
    where: { id: req.params.id },
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [{ model: Cliente, attributes: ["id", ["nome", "nomeCliente"]] }],
  });

  if (plano) {
    res.json(plano);
  } else {
    res.status(404).json({ message: "Plano de treino não encontrado!" });
  }
});

// Inserir novo plano de treino
treinoRouter.post("/planos", async (req, res) => {
  const { nome, descricao, duracao, clienteId } = req.body;

  try {
    await PlanoTreino.create({ nome, descricao, duracao, clienteId });
    res.status(201).json({ message: "Plano de treino criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar plano de treino", error });
  }
});

// Atualizar plano de treino
treinoRouter.put("/planos/:id", async (req, res) => {
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
    res
      .status(500)
      .json({ message: "Erro ao atualizar plano de treino", error });
  }
});

// Remover plano de treino
treinoRouter.delete("/planos/:id", async (req, res) => {
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
