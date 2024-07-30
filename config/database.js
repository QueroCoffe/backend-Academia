import { config } from "dotenv";
config();

import { Sequelize } from "sequelize";

export const connection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

export async function authenticate(connection) {
  // tentar a conexão com o banco mysql
  try {
    await connection.authenticate();
    console.log("Conexão feita com sucesso!");
  } catch (error) {
    console.log("Algo de errado não está certo!", error);
  }
}
