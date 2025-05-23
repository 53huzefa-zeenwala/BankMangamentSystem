import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Steps } from "../components";
import { useStateContext } from "../context/stateContext";
export default function CreateAccount() {
  const { setAlert, setCurrentUser, currentUser, userAvailable } =
    useStateContext();
  const [inputs, setInputs] = useState({
    initialBalance: 0,
    accountName: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const navigate = useNavigate();
  const [searchParam, getSearchParam] = useSearchParams();
  async function onSubmit(e) {
    e.preventDefault();
    const { initialBalance, accountName, password, confirmPassword } = inputs;
    if (
      initialBalance.length === 0 ||
      accountName.length === 0 ||
      password.length === 0 ||
      confirmPassword.length === 0
    ) {
      return setAlert({
        isShow: true,
        message: "Fill all the inputs",
        duration: 3000,
        type: "error",
      });
    }
    try {
      const account = await axios.post(
        "http://localhost:8000/api/account/add",
        { ...inputs, initialBalance: parseInt(inputs.initialBalance) },
        { withCredentials: true }
      );
      setCurrentUser({ ...currentUser, accountId: account.data.accountId });
      navigate("/createtransaction?redirected=true");
    } catch (error) {
      setAlert({
        isShow: true,
        message: error.message,
        duration: 3000,
        type: "error",
      });
      console.log(error);
    }
  }
  useEffect(() => {
    if (userAvailable === false || !currentUser) {
      setAlert({
        isShow: true,
        message: "User not found",
        duration: 3000,
        type: "error",
      });
      navigate("/login");
    }
  }, [userAvailable, currentUser]);
  return (
    <section className="bg-white">
      {searchParam.get("redirected") && <Steps progress={1} />}
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6 te">
          <img
            alt="Pattern"
            src="/createAccountImage.png"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main
          aria-label="Main"
          className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:py-12 lg:px-16 xl:col-span-6"
        >
          <div className="max-w-xl lg:max-w-3xl">
            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Create Account
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">
              Unlock a world of limitless possibilities by creating an account
              today and discovering all the amazing benefits that come with it!
            </p>
            <form onSubmit={onSubmit} className="mt-8 grid grid-cols-6 gap-6">
              <div className="inputSmallDiv">
                <label htmlFor="accountName" className="label">
                  Account Name
                </label>
                <input
                  onChange={handleChange}
                  required
                  type="text"
                  id="accountName"
                  name="accountName"
                  className="input"
                />
              </div>
              <div className="inputSmallDiv">
                <label htmlFor="initialBalance" className="label">
                  Current Balance
                </label>
                <input
                  onChange={handleChange}
                  required
                  type="number"
                  id="initialBalance"
                  name="initialBalance"
                  className="input"
                />
              </div>
              <div className="inputSmallDiv">
                <label htmlFor="Password" className="label">
                  Password
                </label>
                <input
                  onChange={handleChange}
                  required
                  type="password"
                  id="Password"
                  name="password"
                  className="input"
                />
              </div>
              <div className="inputSmallDiv">
                <label htmlFor="confirmPassword" className="label">
                  Confirm Password
                </label>
                <input
                  onChange={handleChange}
                  required
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="input"
                />
              </div>
              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button type="submit" className="primaryButton">
                  Create an account
                </button>
                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Already have an account?
                  <a href="#" className="text-gray-700 underline pl-2">
                    Join Account
                  </a>
                  .
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}
