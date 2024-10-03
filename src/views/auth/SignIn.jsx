import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import ForgotPassword from "./ForgotPassword";



export default function SignIn() {
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
    setLoading(true)
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
        otp: ""
      });
    }
    finally {
      setLoading(false)

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
    setLoading(true)
    const userId = localStorage.getItem("userId");


    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    if (!newPassword || !confirmPassword) {
      toast.error("Please enter new password and confirm password")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
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
    }
    finally {
      setLoading(false)
      setForgotPassword(false)
      setOpen(false)
      setConfirmPassword("")
      setNewPassword("")
      setUser({
        email: "",
        password: "",
        type: "",
        otp: ""
      });
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <main className="rounded-lg border-gray-200 bg-white px-8 py-8 shadow-lg sm:px-12 lg:px-16 lg:py-12">
        <div className="max-w-xl lg:max-w-3xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            {forgotPassword ? "Forgot Password" : "Sign In"}
          </h1>
          {forgotPassword ? (
            <p className="mt-4 leading-relaxed text-gray-500">
              Enter your email address to recover your account.
            </p>
          ) : (
            <p className="mt-4 leading-relaxed text-gray-500">
              Enter your email address and password or OTP to access the admin
              panel.
            </p>
          )}

          {otp ? (
            // OTP form
            <form
              className="mt-8 grid grid-cols-6 gap-6"
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
                    className="w-2/3 rounded-md border-gray-200 bg-white p-3 text-sm text-gray-700 shadow-sm"
                    placeholder="Enter your email"
                    required
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    value={user.email}
                  />
                  <button
                    className={`hover:bg-transparent inline-block rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 hover:text-white sm:px-5 sm:py-3 ${loading ? 'cursor-not-allowed' : ''}`}
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
                  className="w-full rounded-md border-gray-200 bg-white p-3 text-sm text-gray-700 shadow-sm"
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
                  className={`hover:bg-transparent inline-block rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-bulue-700 hover:text-white ${forgotPassword || otp ? "w-full" : "sm:w-2/3"
                    } `}
                  onClick={verifyOTP}
                  type="button"
                >
                  {forgotPassword ? "Verify" : "Login with OTP"}
                </button>

                {forgotPassword ? null : (
                  <p className="mt-2 text-sm text-gray-500 ">
                    <button
                      onClick={() => setOtp(!otp)}
                      className="text-gray-700 underline"
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
              className="mt-8 grid grid-cols-6 gap-6"
              onSubmit={handleSubmitEmailPassword}
            >
              <div className="col-span-6">
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="Email"
                  name="email"
                  className="w-full rounded-md border-gray-200 bg-white p-3 text-sm text-gray-700 shadow-sm"
                  placeholder="Enter your email"
                  value={user.email}
                  required
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="Password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="Password"
                  name="password"
                  className="w-full rounded-md border-gray-200 bg-white p-3 text-sm text-gray-700 shadow-sm"
                  placeholder="Enter your password"
                  value={user.password}
                  required
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
              </div>

              <div className="col-span-6 flex flex-col items-center gap-4">
                <button className="hover:bg-transparent inline-block w-full rounded-md border border-blue-600 bg-blue-600 hover:bg-blue-700 px-12 py-3 text-sm font-medium text-white transition  ">
                  Login with Email
                </button>
                <div className="flex justify-between gap-12">
                  <p className="text-sm text-gray-500">
                    <button
                      onClick={() => setOtp(!otp)}
                      className="text-gray-700 underline"
                    >
                      OTP based login
                    </button>
                  </p>
                  <p className="text-sm text-gray-500">
                    <button
                      className="text-gray-700 underline"
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
