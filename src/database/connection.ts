import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variabçe: ${name}`);
  }
  return value;
}

export const db = mysql.createPool({
  host: requiredEnv("DB_HOST"),
  user: requiredEnv("DB_USER"),
  password: requiredEnv("DB_PASSWORD"),
  database: requiredEnv("DB_NAME"),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
