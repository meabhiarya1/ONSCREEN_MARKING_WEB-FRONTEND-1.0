import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import ForgotPassword from "./ForgotPassword";



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

//   return (
//     <div className="flex h-screen w-full items-center justify-center">
//       <main className="rounded-lg border-gray-200 bg-navy-700 px-8 py-8 shadow-lg sm:px-12 lg:px-16 lg:py-12">
//         <div className="max-w-xl lg:max-w-3xl p-8">
//           <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl text-white">
//             {forgotPassword ? "Forgot Password" : "Sign In"}
//           </h1>
//           {forgotPassword ? (
//             <p className="mt-4 leading-relaxed text-gray-300">
//               Enter your email address to recover your account.
//             </p>
//           ) : (
//             <p className="mt-4 leading-relaxed text-gray-300">
//               Enter your email address and password or OTP to access the admin
//               panel.
//             </p>
//           )}

//           {otp ? (
//             // OTP form
//             <form
//               className="mt-8 grid grid-cols-6 gap-6"
//               onSubmit={handleSubmitOtpPassword}
//             >
//               <div className="col-span-6">
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-300"
//                 >
//                   Email
//                 </label>
//                 <div className="mt-1 flex items-center gap-2">
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     className="w-2/3 rounded-md border-gray-200 bg-white p-3 text-sm text-gray-700 shadow-sm"
//                     placeholder="Enter your email"
//                     required
//                     onChange={(e) =>
//                       setUser({ ...user, email: e.target.value })
//                     }
//                     value={user.email}
//                   />
//                   <button
//                     className={`hover:bg-transparent inline-block rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 hover:text-white sm:px-5 sm:py-3 ${loading ? 'cursor-not-allowed' : ''}`}
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <div className="flex items-center">
//                         <svg
//                           className="animate-spin h-5 w-5 mr-2 text-white"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           />
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                           />
//                         </svg>
//                         Sending...
//                       </div>
//                     ) : (
//                       "Send OTP"
//                     )}
//                   </button>

//                 </div>
//               </div>

//               <div className="col-span-6">
//                 <label
//                   htmlFor="otp"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   OTP
//                 </label>
//                 <input
//                   type="number"
//                   id="otp"
//                   name="otp"
//                   className="w-full rounded-md border-gray-200 bg-white p-3 text-sm text-gray-700 shadow-sm"
//                   placeholder="Enter your OTP"
//                   value={user.otp}
//                   maxLength={6}
//                   minLength={6}
//                   onChange={(e) => {
//                     const otpValue = e.target.value;
//                     if (/^\d{0,6}$/.test(otpValue)) {
//                       setUser({ ...user, otp: otpValue });
//                     }
//                   }}
//                 />
//               </div>

//               <div className="col-span-6 items-center gap-2 sm:justify-between">
//                 <button
//                   className={`hover:bg-transparent inline-block rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-bulue-700 hover:text-white ${forgotPassword || otp ? "w-full" : "sm:w-2/3"
//                     } `}
//                   onClick={verifyOTP}
//                   type="button"
//                 >
//                   {forgotPassword ? "Verify" : "Login with OTP"}
//                 </button>

//                 {forgotPassword ? null : (
//                   <p className="mt-2 text-sm text-gray-500 ">
//                     <button
//                       onClick={() => setOtp(!otp)}
//                       className="text-gray-700 underline"
//                       cursor="pointer"
//                     >
//                       Password based login
//                     </button>
//                   </p>
//                 )}
//               </div>
//             </form>
//           ) : (
//             // Password form
//             <form
//               className="mt-8 grid grid-cols-6 gap-6"
//               onSubmit={handleSubmitEmailPassword}
//             >
//               <div className="col-span-6">
//                 <label
//                   htmlFor="Email"
//                   className="block text-sm font-medium text-gray-300 my-1"
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="Email"
//                   name="email"
//                   className="w-full rounded-md border-gray-200 bg-navy-900 p-3 text-sm text-gray-300 shadow-sm"
//                   placeholder="Enter your email"
//                   value={user.email}
//                   required
//                   onChange={(e) => setUser({ ...user, email: e.target.value })}
//                 />
//               </div>

//               <div className="col-span-6">
//                 <label
//                   htmlFor="Password"
//                   className="block text-sm font-medium text-gray-300 my-1"
//                 >
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   id="Password"
//                   name="password"
//                   className="w-full rounded-md border-gray-200 bg-navy-900 p-3 text-sm text-gray-300 shadow-sm"
//                   placeholder="Enter your password"
//                   value={user.password}
//                   required
//                   onChange={(e) =>
//                     setUser({ ...user, password: e.target.value })
//                   }
//                 />
//               </div>

//               <div className="col-span-6 flex flex-col items-center gap-4">
//                 <button className="hover:bg-transparent inline-block w-full rounded-md border border-indigo-600 bg-indigo-600 hover:bg-indigo-700 px-12 py-3 text-sm font-medium text-white transition  ">
//                   Login with Email
//                 </button>
//                 <div className="flex justify-between gap-12 mt-5">
//                   <p className="text-sm text-gray-500">
//                     <button
//                       onClick={() => setOtp(!otp)}
//                       className="text-gray-50 p-3 rounded-md border border-indigo-600 bg-indigo-600 hover:bg-indigo-7000"
//                     >
//                       OTP based login
//                     </button>
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     <button
//                       className="text-gray-50 p-3 rounded-md border border-indigo-600 bg-indigo-600 hover:bg-indigo-700"
//                       onClick={() => {
//                         setForgotPassword(!forgotPassword);
//                         setOtp(!otp);
//                       }}
//                     >
//                       Forgot your password?
//                     </button>
//                   </p>
//                 </div>
//               </div>
//             </form>
//           )}
//         </div>

//         {/* Modal */}
//         <ForgotPassword
//           open={open}
//           setOpen={setOpen}
//           setNewPassword={setNewPassword}
//           updatePassword={updatePassword}
//           setConfirmPassword={setConfirmPassword}
//           newPassword={newPassword}
//           setUser={setUser}
//           confirmPassword={confirmPassword}
//         />
//       </main>
//     </div>
//   );
// }


return (
    <>
     <div className="font-[sans-serif]  text-gray-100 min-h-screen flex items-center justify-center px-4 py-6">
        <div className="flex justify-center items-center gap-6 max-w-8xl w-full">
         <div className="bg-navy-700 border border-gray-700 rounded-lg p-8 shadow-lg max-md:mx-auto w-full max-w-md">
            <form className="space-y-6" onSubmit={handleSubmitEmailPassword}

            >
             <div className="mb-8">
                <h3 className="text-3xl font-extrabold text-indigo-500">
                 Sign in
                </h3>
                <p className="text-gray-400 text-sm mt-4">
                 Sign in to your account and explore a world of possibilities.
                 Your journey begins here.
                </p>
             </div>
             <div>
                <label className="block text-sm font-medium mb-2">
                 Email
                </label>
                <div className="relative flex items-center">
                 <input
                    name="username"
                    type="text"
                    className="w-full bg-transparent placeholder:text-gray-300 text-sm border border-gray-500 rounded-md px-4 py-2 text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-navy-900"
                    placeholder="Enter Email"
                    value={user.email}
                  required
                  onChange={(e) => setUser({ ...user, email: e.target.value })}

                 />
                 <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    className="w-5 h-5 absolute right-4"
                    viewBox="0 0 24 24"
                 >
                    <circle cx="10" cy="7" r="6"></circle>
                    <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"></path>
                 </svg>
                </div>
             </div>
             <div>
                <label className="block text-sm font-medium mb-2">
                 Password
                </label>
                <div className="relative flex items-center">
                 <input
                    name="password"
                    type="password"
                    value={user.password}
                  required
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                    className="w-full bg-transparent placeholder:text-gray-300 text-sm border border-gray-500 rounded-md px-4 py-2 text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-navy-900"
                    placeholder="Enter password"
                 />
                 <span
                    
                    className="w-5 h-5 absolute right-4 cursor-pointer"
                 >
                 </span>
                </div>
             </div>
             <div className="flex items-center justify-between gap-4">
                <label className="flex items-center">
                 <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-500 border-gray-600 bg-gray-700 rounded focus:ring-blue-500"
                 />
                 <span className="ml-2 text-sm">Remember me</span>
                </label>
                <span
                 
                 className="text-indigo-400 text-sm cursor-pointer hover:underline"
                >
                 login with OTP
                </span>
             </div>
             <div>
                <button
                 type="submit"
                 className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg focus:ring focus:ring-indigo-600 focus:ring-opacity-50 shadow-lg"
                >
                 Log in
                </button>
             </div>
             <p className="text-sm text-center">
             Forgot your password?
             {" "}
                <span
                 
                 className="text-indigo-400 cursor-pointer font-semibold hover:underline"
                >
                Reset Password
                </span>
             </p>
            </form>
         </div>
        </div>
     </div>
    </>
);
};

export default SignIn;