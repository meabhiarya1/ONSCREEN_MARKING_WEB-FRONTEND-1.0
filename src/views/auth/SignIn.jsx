import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

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
    const updatedUser = { ...user, type: "password" };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/signin`,
        updatedUser
      );
      toast.success("Logged in successfully!");
      console.log(response);
      if (localStorage.getItem("token")) localStorage.removeItem("token");
      localStorage.setItem("token", response.data.token);
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
    const updatedUser = { ...user, type: "otp" };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/signin`,
        updatedUser
      );
      toast.success(response.data.message);
      // console.log(response.data.userId)
      localStorage.setItem("userId", response.data.userId);
    } catch (error) {
      toast.error(error?.response.data.message);
      console.log(error?.response.data.message);
      setUser({
        email: "",
        password: "",
        type: "",
      });
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
      // console.log(userId, otp);
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
      console.log(error);
    }
  };

  const updatePassword = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/forgotpassword`,
        { userId, newPassword }
      );
      toast.success(response.data.message);
      if (localStorage.getItem("token")) localStorage.removeItem("token");
      localStorage.setItem("token", response.data.token);
      navigate("/admin");
    } catch (error) {
      toast.error(error?.response.data.message);
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <main className="rounded-lg border-gray-200 bg-white px-8 py-8 shadow-lg sm:px-12 lg:px-16 lg:py-12">
        <div className="max-w-xl lg:max-w-3xl">
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
                  <button className="hover:bg-transparent inline-block rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:text-blue-600 sm:px-5 sm:py-3">
                    Send OTP
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
                  onChange={(e) => setUser({ ...user, otp: e.target.value })}
                />
              </div>

              <div className="col-span-6 items-center gap-2 sm:justify-between">
                <button
                  className={`hover:bg-transparent inline-block rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:text-blue-600 ${
                    forgotPassword || otp ? "w-full" : "sm:w-2/3"
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
                <button className="hover:bg-transparent inline-block w-full rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:text-blue-600 ">
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
                  {console.log(forgotPassword)}
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
        <div>
          <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div>
                <label
                  htmlFor="newpassword"
                  className="text-md my-2 block font-medium text-gray-700 "
                >
                  {" "}
                  Enter New Password{" "}
                </label>

                <input
                  type="text"
                  id="newpassword"
                  placeholder="Type password"
                  className="mt-1 w-full rounded-md border-gray-200 p-3 shadow-sm sm:text-sm"
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <span className="mt-4 inline-flex overflow-hidden rounded-md border bg-white shadow-sm ">
                <button
                  className="inline-block border-e px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
                  onClick={updatePassword}
                >
                  Update New Password
                </button>
              </span>
            </Box>
          </Modal>
        </div>
      </main>
    </div>
  );
}
