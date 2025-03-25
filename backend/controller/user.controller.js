import {
  JWT_TOKEN_KEY,
  createToken,
  db,
  decodePassword,
  encryptPassword,
} from "../db.js";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

export function addUser(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  if (password != confirmPassword) {
    return res.status(400).json("password not match");
  }

  const transactionQuery = "START TRANSACTION";
  console.log("Here 1");

  db.query(transactionQuery, (err, data) => {
    console.log("Here ", err);

    if (err) return res.status(400).json(err);
    console.log("Here 2");

    const isUserExistsQuery = "SELECT * FROM user WHERE email = ? and name = ?";

    db.query(isUserExistsQuery, [email, name], (err, data) => {
      if (err) return res.status(400).json(err);
      if (data.length)
        return res.status(403).json("User email or name already exist.");
      const hashPassword = encryptPassword(password);

      const q = "INSERT INTO user (`name`, `email`, `password`) VALUES (?)";
      const values = [name, email, hashPassword];

      db.query(q, [values], (err, data) => {
        if (err) return res.status(400).json(err);

        const q = "SELECT * FROM user WHERE name = ? AND email = ?";

        db.query(q, [name, email], (err, data) => {
          if (err) return res.status(400).json(err);

          db.query("COMMIT", (err) => {
            if (err) return res.status(400).json(err);
            const token = createToken(data[0].id, null);
            const { password, ...other } = data[0];
            res
              .cookie("access_token", token, { httpOnly: true })
              .status(200)
              .json(other);
          });
        });
      });
    });
  });
}

export function loginUser(req, res) {
  const { email, password } = req.body;

  const q =
    "SELECT ua.id AS id, u.name AS userName, u.password as userPassword, u.id AS userId, a.account_name AS accountName, a.balance AS balance, a.id AS accountId FROM users_accounts AS ua JOIN user AS u ON ua.user_id = u.id JOIN account AS a ON ua.account_id = a.id WHERE u.email = ?";

  db.query(q, [email], (err, data) => {
    if (err) return res.status(400).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");
    if (!decodePassword(password, data[0].userPassword))
      return res.status(400).json("User email or password is incorrect!");

    data.map((data) => delete data.userPassword);
    const token = createToken(data[0].userId, data[0].accountId);
    return res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(data[0]);
  });
}

export function isUserAvailable(req, res) {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, JWT_TOKEN_KEY, (err, userInfo) => {
    if (err) return res.status(401).json("User not Found");
    return res.status(200).json(true);
  });
}

export function logout(req, res) {
  res.clearCookie("access_token", { httpOnly: true });
  const token = req.cookies.access_token;
  if (token) return res.status(400).json("Logout Failed");
  return res.status(200).json("Logout SuccessFully");
}
