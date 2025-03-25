import mysql from "mysql2";
import bcrypt, { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";

export const db = mysql.createConnection({
  host: "sql.freedb.tech",
  user: "freedb_huzefa",
  password: "%vKB#&#rqAkA6@x",
  port: 3306,
  database: "freedb_bank_managment",
});

export const JWT_TOKEN_KEY = "SubscribeToWebDevHuzefa";

export function encryptPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}
export function decodePassword(userPassword, serverPassword) {
  const isPasswordCorrect = compareSync(userPassword, serverPassword);
  return isPasswordCorrect;
}

export function createToken(userId, accountId) {
  const token = jwt.sign({ id: userId, accountId }, JWT_TOKEN_KEY);
  return token;
}

export function updateAccountBalance(
  initialType,
  type,
  initialBalance,
  initialAmount,
  amount
) {
  const CREDITED = "credited";
  const DEBITED = "debited";
  if (initialAmount === amount && initialType === type) return initialBalance;
  if (initialType === CREDITED && type === DEBITED) {
    return initialBalance - (initialAmount + amount);
  } else if (initialType === DEBITED && type === DEBITED) {
    return initialBalance + (initialAmount - amount);
  } else if (initialType === DEBITED && type === CREDITED) {
    return initialBalance + (initialAmount + amount);
  } else {
    return initialBalance + (amount - initialAmount);
  }
}
