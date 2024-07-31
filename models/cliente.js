import { connection } from "../config/database.js";
import { DataTypes } from "sequelize";
import { Endereco } from "./endereco.js";
import { PlanoTreino } from "./planotreino.js";

export const Cliente = connection.define("cliente", {
  nome: {
    type: DataTypes.STRING(130), // String = Varchar
    allowNull: false, // allownull = not null
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

// Associação 1:1 (cliente - endereco)
Cliente.hasOne(Endereco, { onDelete: "CASCADE" });
Endereco.belongsTo(Cliente);

// associação 1:N (cliente-PlanoTreino)

Cliente.hasMany(PlanoTreino, { onDelete: "CASCADE" });
PlanoTreino.belongsTo(Cliente);
