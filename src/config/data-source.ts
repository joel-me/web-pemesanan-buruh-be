import { DataSource } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Order } from "../orders/entities/order.entity";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [User, Order],
  migrations: ["src/migrations/*.ts"],
  ssl: {
    rejectUnauthorized: false, // <<-- ini yang penting
  },
});
