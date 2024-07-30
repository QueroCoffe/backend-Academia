import { connection } from "../config/database.js";
import { DataTypes } from "sequelize";

export const PlanoTreino = connection.define("planoTreino",{
    nomePlano: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    duracao: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});