import React from 'react'

const Boxes = ({ icon, title, amount, percentage, event }) => {
    return (
        <div onClick={event} className="box flex h-20 w-full items-center justify-start gap-4 rounded-xl bg-white px-5 cursor-pointer hover:shadow-xl dark:bg-navy-700 dark:shadow-gray-800 transition ease-in-out hover:-translate-y-1 hover:scale-100 hover:bg-blue-50 duration-300 hover:border border-blue-300 hover:text-indigo-500 hover:font-semibold">
          <div className="icon">{icon}</div>
          <div className="content">
            <div className="md:text-base">{title}</div>
            <div>
              {amount}
               {/* <span className="mx-2 text-green-500">+{percentage}%</span> */}
            </div>
          </div>
        </div>
      );
}

export default Boxes
