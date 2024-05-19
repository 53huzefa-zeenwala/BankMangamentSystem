import { db, JWT_TOKEN_KEY, updateAccountBalance } from "../db.js";
import jwt from "jsonwebtoken";

export function addTransaction(req, res) {
  let { amount, type, method, software, description } = req.body;
  const token = req.cookies.access_token;
  amount = parseInt(amount)
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, JWT_TOKEN_KEY, (err, userInfo) => {
    if (err) return res.status(403).json(err);
    if (!userInfo.id || !userInfo.accountId)
      return res.status(401).json("Not authenticated!");

    db.query("START TRANSACTION", (err) => {
      if (err) return res.status(400).json(err);

      const q =
        "INSERT INTO transaction (`amount`, `type`, `method`, `software`, `description`, `user_id`, `account_id`) VALUES (?)";
      const values = [
        amount,
        type,
        method,
        software,
        description,
        userInfo.id,
        userInfo.accountId,
      ];

      db.query(q, [values], (err, data) => {
        if (err) return res.status(400).json(err);
        const getUserAccountQuery = "SELECT balance FROM account WHERE id = ?";
        db.query(getUserAccountQuery, [userInfo.accountId], (err, data) => {
          if (err) return res.status(400).json(err);

          const balance =
            type === "credited"
              ? data[0].balance + amount
              : data[0].balance - amount;
          const updateBalanceQuery =
            "UPDATE account SET balance = ? WHERE id = ?";
          db.query(updateBalanceQuery, [balance, userInfo.accountId], (err) => {
            if (err) return res.status(400).json(err);

            db.query("COMMIT", (err) => {
              if (err) return res.status(400).json(err);

              return res
                .status(200)
                .json("Transaction is successfully created");
            });
          });
        });
      });
    });
  });
}

export function deleteTransaction(req, res) {
  const id = req.params.id;
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, JWT_TOKEN_KEY, (err, userInfo) => {
    if (err) return res.status(403).json(err);
    if (!userInfo.id || !userInfo.accountId)
      return res.status(401).json("Not authenticated!");

    db.query("START TRANSACTION", (err) => {
      if (err) return res.status(400).json(err);

      const getTransactionQuery =
        "SELECT amount, type FROM transaction WHERE id = ? and user_id = ? and account_id = ?";

      db.query(
        getTransactionQuery,
        [id, userInfo.id, userInfo.accountId],
        (err, data) => {
          if (err) return req.status(400).json(err);

          const { amount, type } = data[0];
          const deleteTransactionQuery =
            "DELETE FROM transaction WHERE id = ? and user_id = ? and account_id = ?";

          db.query(
            deleteTransactionQuery,
            [id, userInfo.id, userInfo.accountId],
            (err) => {
              if (err) return req.status(400).json(err);

              const getBalanceQuery =
                "SELECT a.balance FROM users_accounts AS au JOIN account AS a ON a.id = au.account_id WHERE au.user_id = ? AND au.account_id = ?";
              db.query(
                getBalanceQuery,
                [userInfo.id, userInfo.accountId],
                (err, data) => {
                  if (err) return req.status(400).json(err);

                  const updatedBalance =
                    type === "credited"
                      ? data[0].balance - amount
                      : data[0].balance + amount;
                  db.query(
                    "UPDATE account SET balance = ? WHERE id = ?",
                    [updatedBalance, userInfo.accountId],
                    (err) => {
                      if (err) return res.status(400).json(err);

                      db.query("COMMIT", (err) => {
                        if (err) return res.status(400).json(err);

                        return res
                          .status(200)
                          .json("Transaction has been deleted.");
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
}

export function getTransactions(req, res) {
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, JWT_TOKEN_KEY, (err, userInfo) => {
    if (err) return res.status(403).json(err);
    if (!userInfo.id || !userInfo.accountId)
      return res.status(401).json("Not authenticated!");

    const getTransactionsQuery =
      "SELECT t.id, t.amount, t.type, t.software, t.description, user.name, a.account_name FROM transaction AS t JOIN account as a on a.id = t.account_id Join user on user.id = t.user_id WHERE user.id = ?";
    db.query(getTransactionsQuery, [userInfo.id], (err, data) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json(data);
    });
  });
}

export function updateTransaction(req, res) {
  const id = req.params.id;
  const { amount, type, method, software, description } = req.body;
  const token = req.cookies.access_token;

  if (!token) return res.status(401).send("Not authenticated!");

  jwt.verify(token, JWT_TOKEN_KEY, (err, userInfo) => {
    if (err) return res.status(403).json(err);
    if (!userInfo.id || !userInfo.accountId)
      return res.status(401).json("Not authenticated!");

    db.query("START TRANSACTION", (err) => {
      if (err) return res.status(400).json(err);

      const getAccountQuery =
        "SELECT a.balance, t.type, t.amount, t.user_id FROM account AS a JOIN transaction AS t ON t.account_id = a.id WHERE t.id = ?";
      db.query(getAccountQuery, [id], (err, data) => {
        if (err) return res.status(400).json(err);
        const detail = data[0];
        if (detail.user_id != userInfo.id)
          return res.status(403).json("Sorry you cant change this transaction");
        const updatedBalance = updateAccountBalance(
          detail.type,
          type,
          detail.balance,
          detail.amount,
          amount
        );

        const updateTransactionQuery =
          "UPDATE transaction set amount = ?, type = ?, method = ?, software = ?, description = ? WHERE id = ?";
        db.query(
          updateTransactionQuery,
          [amount, type, method, software, description, id],
          (err) => {
            if (err) return res.status(400).json(err);

            db.query(
              "UPDATE account SET balance = ? WHERE id = ?",
              [updatedBalance, userInfo.accountId],
              (err) => {
                if (err) return res.status(400).json(err);

                db.query("COMMIT", (err) => {
                  if (err) return res.status(400).json(err);

                  return res.status(200).json("Transaction has been updated.");
                });
              }
            );
          }
        );
      });
    });
  });
}

export function getTransaction(req, res) {
  const id = req.params.id;
  const token = req.cookies.access_token;

  if (!token) return res.status(401).send("Not authenticated!");

  jwt.verify(token, JWT_TOKEN_KEY, (err, userInfo) => {
    if (err) return res.status(403).json(err);
    if (!userInfo.id || !userInfo.accountId)
      return res.status(401).json("Not authenticated!");

    const getTransactionQuery =
      "SELECT * FROM transaction WHERE id = ? and account_id = ?";
    db.query(getTransactionQuery, [id, userInfo.accountId], (err, data) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json(data);
    });
  });
}
