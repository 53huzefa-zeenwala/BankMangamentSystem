import React, { useState } from "react";
import { useStateContext } from "../context/stateContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Steps from "../components/Steps";
export default function Signup() {
  const { setAlert, setCurrentUser } = useStateContext();
  const [inputs, setInputs] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: ""
  });
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const navigate = useNavigate();
  async function onSubmit(e) {
    e.preventDefault();
    const { email, name, password, confirmPassword } = inputs;
    if (
      email.length === 0 ||
      name.length === 0 ||
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
      const user = await axios.post(
        "http://localhost:8000/api/user/signup",
        inputs,
        { withCredentials: true }
      );
      setCurrentUser(user.data);
      navigate("/createaccount?redirected=true");
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
  return (
    <section className="bg-white">
      <Steps progress={0} />
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6 te">
          <img
            alt="Pattern"
            src="/signupImage.png"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>
        <main
          aria-label="Main"
          className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:py-12 lg:px-16 xl:col-span-6"
        >
          <div className="max-w-xl lg:max-w-3xl">
            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Welcome to AccountAce
            </h1>
            <p className="mt-4 leading-relaxed text-gray-500">
              Welcome to our transaction tracking website, a platform designed
              to simplify the management of your financial transactions.
              Experience an easy and efficient way to view your account balance
              and track your spending with quick and easy sign-up.
            </p>
            <form onSubmit={onSubmit} className="mt-8 grid grid-cols-6 gap-6">
              <div className="inputDiv">
                <label htmlFor="name" className="label">
                  User Name
                </label>
                <input
                  onChange={handleChange}
                  required
                  type="text"
                  id="name"
                  name="name"
                  className="input"
                />
              </div>
              <div className="inputDiv">
                <label htmlFor="Email" className="label">
                  Email
                </label>
                <input
                  onChange={handleChange}
                  required
                  type="email"
                  id="Email"
                  name="email"
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
                  Sign up
                </button>
                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Already have an account?
                  <a href="#" className="text-gray-700 underline pl-2">
                    Log in
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
