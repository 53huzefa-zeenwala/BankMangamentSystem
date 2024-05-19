import {
  createToken,
  db,
  decodePassword,
  encryptPassword,
  JWT_TOKEN_KEY,
} from "../db.js";
import jwt from "jsonwebtoken";

export function addAccount (req, res) {
  const { accountName, password, confirmPassword, initialBalance } = req.body;
  if (password != confirmPassword) {
    return res.status(400).json("password not match");
  }
  const transactionQuery = "START TRANSACTION";

  db.query(transactionQuery, (err, data) => {
    if (err) return res.status(400).json(err);

    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, JWT_TOKEN_KEY, (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
      const userId = userInfo.id;
      const isAccountExistQuery =
        "SELECT * FROM account WHERE account_name = ?";

      db.query(isAccountExistQuery, [accountName], (err, data) => {
        if (err) return res.status(400).json(err);
        if (data.length) return res.status(500).json("Account Already Exists");

        const createAccountQuery =
          "INSERT INTO account (`account_name`, `password`, `balance`) VALUES (?)";

        const hashPassword = encryptPassword(password);
        const values = [accountName, hashPassword, initialBalance];

        db.query(createAccountQuery, [values], (err, data) => {
          if (err) return res.status(400).json(err);

          const getUserAccountQuery =
            "SELECT * FROM account WHERE account_name = ?";

          db.query(getUserAccountQuery, [accountName, userId], (err, data) => {
            if (err) return res.status(400).json(err);

            const accountData = data[0];
            const createJunctionQuery =
              "INSERT INTO users_accounts (user_id, account_id) VALUES (?)";
            const values = [userId, accountData.id];

            db.query(createJunctionQuery, [values], (err, data) => {
              if (err) return res.status(400).json(err);

              db.query("COMMIT", (err) => {
                if (err) return res.status(400).json(err);

                const token = createToken(userId, accountData.id);
                return res
                  .cookie("access_token", token)
                  .status(200)
                  .json({accountId: accountData.id});
              });
            });
          });
        });
      });
    });
  });
};

export function joinAccount (req, res) {
  const { accountName, password } = req.body;
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, JWT_TOKEN_KEY, (err, userInfo) => {
    if (err) return res.status(403).json(err);
    db.query("START TRANSACTION", (err) => {
      if (err) return res.status(400).json(err);

      const getAccountQuery =
        "SELECT * FROM account WHERE account.account_name = ?";

      db.query(getAccountQuery, [accountName], (err, data) => {
        if (err) return res.status(400).json(err);
        if (data.length === 0)
          return res.status(404).json("Account not found!");
        if (!decodePassword(password, data[0].password))
          return req.status(400).json("Account name or password is incorrect");
        const accountData = data[0];
        const createJunctionQuery =
          "INSERT INTO users_accounts (user_id, account_id) VALUES (?)";
        const values = [userInfo.id, accountData.id];

        db.query(createJunctionQuery, [values], (err, data) => {
          if (err) return res.status(400).json(err);

          db.query("COMMIT", (err) => {
            if (err) return res.status(400).json(err);
            const token = createToken(userInfo.id, accountData.id);

            return res
              .cookie("access_token", token)
              .status(200)
              .json("Account has been joined");
          });
        });
      });
    });
  });
};

export function switchAccount(req, res) {
  const id = req.params.id;

  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, JWT_TOKEN_KEY, (err, userInfo) => {
    if (err) return res.status(403).json(err);
    const switchAccountQuery =
      "SELECT * from users_accounts AS au JOIN account AS a on a.id = au.account_id WHERE au.user_id = ? AND au.account_id = ?";

    db.query(switchAccountQuery, [userInfo.id, parseInt(id)], (err, data) => {
      if (err) return res.status(400).json(err);
      if (data.length === 0) return res.status(403).json("No account found");

      const token = createToken(userInfo.id, data[0].id);

      return res
        .cookie("access_token", token)
        .status(200)
        .json("Account has been switched");
    });
  });
}
