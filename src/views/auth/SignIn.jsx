import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import ForgotPassword from "./ForgotPassword";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import logo from "./omr_logo.png";

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
  const [verify, setVerify] = useState(false);

  const navigate = useNavigate();

  const [otpdata, setOtpsdata] = useState(["", "", "", "", "", ""]);

  useEffect(() => {
    setUser({
      email: "",
      password: "",
      type: "",
    });
  }, [otp]);

  const handleSubmitEmailPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      toast.error(error?.message);
      // console.log(error);
      setUser({
        email: user.email,
        password: user.password,
        type: user.type,
      });
    } finally {
      setLoading(false);
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
      toast.success(response?.data?.message);
      localStorage.setItem("userId", response?.data?.userId);
    } catch (error) {
      toast.error(error?.response?.data?.message);
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

  // Helper function to handle input changes
  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otpdata];
      newOtp[index] = value;
      setOtpsdata(newOtp);
      setUser({ ...user, otp: otpdata.join("") });
    }
  };

  // Helper function to handle navigation between input fields
  const handleKeyUp = (e, index) => {
    if (e?.key === "Backspace" && !otpdata[index] && index > 0) {
      e?.target.previousElementSibling?.focus();
    } else if (e?.key !== "Backspace" && index < 5) {
      e?.target.nextElementSibling?.focus();
    }
  };

  const verifyOTP = async () => {
    setVerify(true);
    const userId = localStorage.getItem("userId");

    if (otpdata?.some((digit) => digit === "")) {
      toast.error("Please fill all OTP fields");
      setVerify(false);
      return;
    }

    const otpString = otpdata?.join(""); // Combine individual OTP values into a string

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/verify`,
        { userId, otp: otpString }
      );
      toast.success(response?.data?.message);
      if (localStorage.getItem("token")) localStorage.removeItem("token");
      localStorage.setItem("token", response?.data?.token);
      if (!forgotPassword) {
        navigate("/admin");
      } else {
        setOpen(!open);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setVerify(false);
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
      toast.success(response?.data?.message);
      if (localStorage.getItem("token")) localStorage.removeItem("token");
      localStorage.setItem("token", response?.data?.token);
    } catch (error) {
      toast.error(error?.response?.data?.message);
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
      <main className="m-5 animate-fadeIn rounded-3xl border-gray-200 bg-white px-8 pb-8 font-poppins shadow-2xl sm:px-12 2xl:w-4/12">
        <div className="logo flex justify-center">
          <img src={logo} alt="" width={120} />
        </div>
        <div className="max-w-xl lg:max-w-3xl">
          <h1 className="animate-bounceCustom text-center font-poppins text-2xl font-bold text-indigo-600 sm:text-3xl md:text-3xl">
            {forgotPassword ? (
              "Forgot Password"
            ) : (
              <div>
                Hello, <br /> Welcome Back
              </div>
            )}
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
                    className="bg-transparent focus:ring-sky-500 focus:border-sky-500 w-full rounded-md border border-gray-500 px-4 py-2 text-sm transition duration-300 placeholder:text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2"
                    placeholder="Enter your email"
                    required
                    onChange={(e) =>
                      setUser({ ...user, email: e?.target?.value })
                    }
                    value={user?.email}
                  />
                  <button
                    className={`hover:bg-transparent inline-block h-10 w-32 rounded-md border border-indigo-600 bg-indigo-600 text-sm font-medium text-white transition hover:bg-indigo-700 hover:text-white ${
                      loading ? "cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <div
                        className={`flex h-full w-full items-center ${
                          loading ? "bg-indigo-400" : "bg-indigo-600"
                        }`}
                      >
                        <svg
                          className="ml-1 mr-2 h-5 w-5 animate-spin text-white"
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
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  OTP
                </label>
                {/* <input
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
                  /> */}

                <div className="flex gap-1 sm:gap-2">
                  {otpdata?.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      className="bg-transparent focus:ring-sky-500 focus:border-sky-500 w-10 sm:w-12 rounded-md border border-gray-500 px-2 py-2 text-center text-sm transition duration-300 placeholder:text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2"
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyUp={(e) => handleKeyUp(e, index)}
                    />
                  ))}
                </div>
              </div>

              <div className="col-span-6 items-center gap-2 sm:justify-between">
                <button
                  className={`hover:bg-transparent hover:bg-bulue-700 inline-block h-10 rounded-md border border-indigo-600 bg-indigo-600 text-sm font-medium text-white transition hover:bg-indigo-700 hover:text-white ${
                    forgotPassword || otp ? "w-full" : "sm:w-2/3"
                  } `}
                  onClick={verifyOTP}
                  type="button"
                  disabled={verify}
                >
                  {verify ? (
                    <div
                      className={`flex h-full w-full items-center justify-center ${
                        verify ? "bg-indigo-400" : "bg-indigo-600"
                      }`}
                    >
                      <svg
                        className="mr-2 h-5 w-5 animate-spin text-white"
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
                      Verifying...
                    </div>
                  ) : (
                    "Login with OTP"
                  )}
                </button>

                {forgotPassword ? null : (
                  <p className="mt-2 flex justify-center text-sm text-gray-500">
                    <button
                      onClick={() => setOtp(!otp)}
                      className="mt-5 text-indigo-600"
                      cursor="pointer"
                      disabled={verify}
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
              <div className="relative col-span-6">
                <label
                  htmlFor="Email"
                  className="my-1 block text-sm font-medium text-gray-700"
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
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <span className="absolute right-3 top-10 h-5 w-5 cursor-pointer">
                  <FaUser />
                </span>
              </div>

              <div className="relative col-span-6">
                <label
                  htmlFor="Password"
                  className="my-1 block text-sm font-medium text-gray-700"
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
                  className="bg-transparent focus:ring-sky-500 focus:border-sky-500 w-full rounded-md border border-gray-500 px-4 py-2 text-sm transition duration-300 placeholder:text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2"
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
                <button
                  className="hover:bg-transparent text-md inline-block h-10 w-full rounded-md border border-indigo-600 bg-indigo-600 font-medium text-white transition hover:bg-indigo-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div
                      className={`flex h-full w-full items-center justify-center ${
                        loading ? "bg-indigo-400" : "bg-indigo-600"
                      }`}
                    >
                      <svg
                        className="mr-2 h-5 w-5 animate-spin text-white"
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
                      Logging In...
                    </div>
                  ) : (
                    "Login with Email"
                  )}
                </button>
                <div className="flex justify-center gap-5">
                  <p className="text-sm text-gray-500">
                    <button
                      onClick={() => setOtp(!otp)}
                      className={`rounded-md p-3 ${
                        loading ? "text-indigo-400" : "text-indigo-600"
                      }`}
                      disabled={loading}
                    >
                      OTP based login
                    </button>
                  </p>
                  <p className="text-sm text-gray-500">
                    <button
                      className={`rounded-md p-3 ${
                        loading ? "text-indigo-400" : "text-indigo-600"
                      }`}
                      onClick={() => {
                        setForgotPassword(!forgotPassword);
                        setOtp(!otp);
                      }}
                      disabled={loading}
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
