import React, { useState, useEffect } from "react";
import { Header, MainLayout } from "../components";
import axios from "axios";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/transaction", { withCredentials: true })
      .then((response) => {
        setTransactions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      });
  }, []);

  return (
    <MainLayout>
      <Header />
      <div className="flex justify-center items-center">
        {loading ? (
          <p>Loading...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl w-full">
            <h2 className="text-xl font-bold text-teal-700 mb-6">
              Previous Transaction Details
            </h2>

            {/* Table View (Desktop) */}
            <div className="hidden md:flex w-full max-w-7xl overflow-x-auto  flex-col items-center justify-center">
              <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-teal-700 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Account</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Amount</th>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Software</th>
                    <th className="py-3 px-4 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-100 transition-all"
                    >
                      <td className="py-3 px-4">{transaction.account_name}</td>
                      <td className="py-3 px-4">{transaction.name}</td>
                      <td
                        className={`py-3 px-4 font-bold ${
                          transaction.type === "credited"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                      ₹ {transaction.amount}
                      </td>
                      <td className="py-3 px-4">{transaction.type}</td>
                      <td className="py-3 px-4">{transaction.software}</td>
                      <td className="py-3 px-4">
                        {transaction.description || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card View (Mobile & Tablet) */}
            <div className="md:hidden w-full max-w-lg space-y-4">
              {transactions.map((transaction, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-teal-700">
                      {transaction.account_name}
                    </h3>
                    <span
                      className={`text-lg font-bold ${
                        transaction.type === "credited"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ₹ {transaction.amount}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-teal-700">Name:</span>{" "}
                    {transaction.name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-teal-700">Type:</span>{" "}
                    {transaction.type}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-teal-700">
                      Software:
                    </span>{" "}
                    {transaction.software}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-teal-700">
                      Description:
                    </span>{" "}
                    {transaction.description || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
