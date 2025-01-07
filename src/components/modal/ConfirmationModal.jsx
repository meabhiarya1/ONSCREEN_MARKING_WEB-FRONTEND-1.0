import React from "react";

const ConfirmationModal = ({
    confirmationModal,
    onSubmitHandler,
    setConfirmationModal,
    heading,
    message,
    type,
    setId
}) => {
    const typeStyles = {
        success: {
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
            buttonBg: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
        },
        warning: {
            iconBg: "bg-yellow-100",
            iconColor: "text-yellow-600",
            buttonBg: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
        },
        error: {
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
            buttonBg: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        },
    };

    const styles = typeStyles[type] || typeStyles.success;

    return (
        <div>
            {confirmationModal && (
                <div className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity"
                            aria-hidden="true"
                        >
                            <div className="absolute inset-0 backdrop-blur-md"></div>
                        </div>

                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full dark:bg-navy-700 dark:border dark:border-gray-400">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 dark:bg-navy-700">
                                <div className="sm:flex sm:items-start">
                                    <div
                                        className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${styles.iconBg} sm:mx-0 sm:h-10 sm:w-10`}
                                    >
                                        {/* Dynamic icon */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className={`h-6 w-6 ${styles.iconColor}`}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3
                                            className="text-lg font-medium text-gray-900 dark:text-white"
                                            id="modal-title"
                                        >
                                            {heading}
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">{message}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end py-3 px-3 gap-4 sm:gap-0">
                                <button
                                    type="button"
                                    onClick={onSubmitHandler}
                                    className={`inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${styles.buttonBg} sm:ml-3 sm:w-auto sm:text-sm`}
                                >
                                    OK
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setConfirmationModal(false)
                                        setId("")
                                    }}
                                    className="inline-flex justify-center w-full rounded-md shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 dark:border-gray-700 focus:border-none focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-navy-900 dark:text-white sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConfirmationModal;
