import React from 'react'
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

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

const ForgotPassword = ({ open, setNewPassword, updatePassword, setOpen, setConfirmPassword,
    newPassword,
    confirmPassword, setUser }) => {
    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {/* Close button */}
                    <button
                        onClick={() => {
                            setUser({
                                email: "",
                                password: "",
                                type: "",
                                otp: ""
                            });
                            setOpen(false)
                        }}
                        className="absolute top-2 right-4 text-6xl text-red-500 hover:text-red-800 focus:outline-none"
                    >
                        &times;
                    </button>

                    {/* Modal content */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800">Update Password</h2>

                        {/* New Password Field */}
                        <div>
                            <label
                                htmlFor="newpassword"
                                className="text-md my-2 block font-medium text-gray-700"
                            >
                                Enter New Password
                            </label>
                            <input
                                type="password"
                                id="newpassword"
                                placeholder="Type new password"
                                value={newPassword}
                                className="mt-1 w-full rounded-md border-gray-300 p-3 shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label
                                htmlFor="confirmpassword"
                                className="text-md my-2 block font-medium text-gray-700"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmpassword"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                className="mt-1 w-full rounded-md border-gray-300 p-3 shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {/* Update Password Button */}
                        <div className="text-right">
                            <button
                                className="inline-block rounded-md bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-sm font-medium text-white transition-all duration-300 ease-in-out hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                                onClick={updatePassword}
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default ForgotPassword