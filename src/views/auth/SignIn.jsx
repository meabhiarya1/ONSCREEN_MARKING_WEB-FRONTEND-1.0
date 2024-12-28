import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import ForgotPassword from "./ForgotPassword";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import logo from "./omr_logo.png"

export function SignIn() {
  const [otp, setOtp] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
    type: "",
    otp: "",
  });
  const [forgotPassword, setForgotPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setUser({
      email: "",
      password: "",
      type: "",
    });
  }, [otp]);

  const handleSubmitEmailPassword = async (e) => {
    e.preventDefault();
    if (localStorage.getItem("token")) localStorage.removeItem("token");
    const updatedUser = { ...user, type: "password" };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/signin`,
        updatedUser
      );
      toast.success("Logged in successfully!");
      dispatch(login(response.data));
      navigate("/admin");
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.log(error);
      setUser({
        email: "",
        password: "",
        type: "",
      });
    }
  };

  const handleSubmitOtpPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updatedUser = { ...user, type: "otp" };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/signin`,
        updatedUser
      );
      toast.success(response.data.message);
      localStorage.setItem("userId", response.data.userId);
    } catch (error) {
      toast.error(error?.response.data.message);
      setUser({
        email: "",
        password: "",
        type: "",
        otp: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    const userId = localStorage.getItem("userId");
    const otp = user.otp;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/verify`,
        { userId, otp }
      );
      toast.success(response.data.message);
      if (localStorage.getItem("token")) localStorage.removeItem("token");
      localStorage.setItem("token", response.data.token);
      if (!forgotPassword) {
        navigate("/admin");
      } else {
        setOpen(!open);
      }
    } catch (error) {
      toast.error(error?.response.data.message);
    }
  };

  const updatePassword = async () => {
    setLoading(true);
    const userId = localStorage.getItem("userId");

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error("Please enter new password and confirm password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/forgotpassword`,
        { userId, newPassword }
      );
      toast.success(response.data.message);
      if (localStorage.getItem("token")) localStorage.removeItem("token");
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      toast.error(error?.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
      setForgotPassword(false);
      setOpen(false);
      setConfirmPassword("");
      setNewPassword("");
      setUser({
        email: "",
        password: "",
        type: "",
        otp: "",
      });
    }
  };

    return (
      <div className="flex h-screen w-full items-center justify-center">
        <main className="rounded-3xl border-gray-200 bg-white px-8 pb-8 shadow-2xl sm:px-12 font-poppins m-5 2xl:w-4/12 animate-fadeIn">
        <div className="logo flex justify-center"><img src={logo} alt="" width={120}/></div>
          <div className="max-w-xl lg:max-w-3xl">
            <h1 className="text-2xl font-bold sm:text-3xl md:text-3xl font-poppins text-indigo-600 animate-bounceCustom text-center">
              {forgotPassword ? "Forgot Password" : <div>Hello, <br /> Welcome Back</div>}
            </h1>
            {forgotPassword ? (
              <p className="mt-4 leading-relaxed text-gray-700">
                Enter your email address to recover your account.
              </p>
            ) : (
              <p className="mt-4 leading-relaxed text-gray-700">
                Enter your email address and password or OTP to access the admin
                panel.
              </p>
            )}

            {otp ? (
              // OTP form
              <form
                className="mt-5 grid grid-cols-6 gap-6"
                onSubmit={handleSubmitOtpPassword}
              >
                <div className="col-span-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="bg-transparent focus:ring-sky-500 focus:border-sky-500 rounded-md border w-full border-gray-500 px-4 py-2 text-sm transition duration-300 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:border-indigo-500"
                      placeholder="Enter your email"
                      required
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                      value={user.email}
                    />
                    <button
                      className={`hover:bg-transparent inline-block rounded-md border w-32 border-indigo-600 bg-indigo-600 hover:bg-indigo-700 p-2 text-sm font-medium text-white transition hover:text-white ${loading ? 'cursor-not-allowed' : ''}`}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Sending...
                        </div>
                      ) : (
                        "Send OTP"
                      )}
                    </button>

                  </div>
                </div>

                <div className="col-span-6">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700"
                  >
                    OTP
                  </label>
                  <input
                    type="number"
                    id="otp"
                    name="otp"
                    className="w-full bg-transparent focus:ring-sky-500 focus:border-sky-500 rounded-md border border-gray-500 px-4 py-2 text-sm transition duration-300 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:border-indigo-500"
                    placeholder="Enter your OTP"
                    value={user.otp}
                    maxLength={6}
                    minLength={6}
                    onChange={(e) => {
                      const otpValue = e.target.value;
                      if (/^\d{0,6}$/.test(otpValue)) {
                        setUser({ ...user, otp: otpValue });
                      }
                    }}
                  />
                </div>

                <div className="col-span-6 items-center gap-2 sm:justify-between">
                  <button
                    className={`hover:bg-transparent inline-block rounded-md border border-indigo-600 bg-indigo-600 hover:bg-indigo-700 px-12 py-3 text-sm font-medium text-white transition hover:bg-bulue-700 hover:text-white ${forgotPassword || otp ? "w-full" : "sm:w-2/3"
                      } `}
                    onClick={verifyOTP}
                    type="button"
                  >
                    {forgotPassword ? "Verify" : "Login with OTP"}
                  </button>

                  {forgotPassword ? null : (
                    <p className="mt-2 text-sm text-gray-500 flex justify-center">
                      <button
                        onClick={() => setOtp(!otp)}
                        className="text-indigo-600 mt-5"
                        cursor="pointer"
                      >
                        Password based login
                      </button>
                    </p>
                  )}
                </div>
              </form>
            ) : (
              // Password form
              <form
                className="mt-5 grid grid-cols-6 gap-6"
                onSubmit={handleSubmitEmailPassword}
              >
                <div className="col-span-6 relative">
                  <label
                    htmlFor="Email"
                    className="block text-sm font-medium text-gray-700 my-1"
                  >
                    Email
                  </label>
                  <input
                    name="email"
                    type="text"
                    className="bg-transparent focus:ring-sky-500 w-full rounded-md border border-gray-500 px-4 py-2 text-sm transition duration-300 placeholder:text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2"
                    placeholder="Enter Email"
                    value={user.email}
                    required
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                  />
                  <span className="absolute right-3 top-10 h-5 w-5 cursor-pointer">
                  <FaUser />
                  </span>
                </div>

                <div className="col-span-6 relative">
                  <label
                    htmlFor="Password"
                    className="block text-sm font-medium text-gray-700 my-1"
                  >
                    Password
                  </label>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={user.password}
                    required
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    className="bg-transparent focus:ring-sky-500 focus:border-sky-500 w-full rounded-md border border-gray-500 px-4 py-2 text-sm transition duration-300 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:border-indigo-500"
                    placeholder="Enter password"
                  />
                  <span
                    className="absolute right-3 top-10 h-5 w-5 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>

                <div className="col-span-6 flex flex-col items-center gap-4">
                  <button className="hover:bg-transparent inline-block w-full rounded-md border border-indigo-600 bg-indigo-600 hover:bg-indigo-700 px-12 py-3 text-sm font-medium text-white transition  ">
                    Login with Email
                  </button>
                  <div className="flex justify-center gap-5">
                    <p className="text-sm text-gray-500">
                      <button
                        onClick={() => setOtp(!otp)}
                        className="text-indigo-600 p-3 rounded-md brder"
                      >
                        OTP based login
                      </button>
                    </p>
                    <p className="text-sm text-gray-500">
                      <button
                        className="text-indigo-600 p-3 rounded-md"
                        onClick={() => {
                          setForgotPassword(!forgotPassword);
                          setOtp(!otp);
                        }}
                      >
                        Forgot your password?
                      </button>
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Modal */}
          <ForgotPassword
            open={open}
            setOpen={setOpen}
            setNewPassword={setNewPassword}
            updatePassword={updatePassword}
            setConfirmPassword={setConfirmPassword}
            newPassword={newPassword}
            setUser={setUser}
            confirmPassword={confirmPassword}
          />
        </main>
      </div>
    );
  }

export default SignIn;
