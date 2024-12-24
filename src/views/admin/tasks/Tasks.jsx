import React, { useEffect, useState } from "react";
import axios from "axios";
import FolderModal from "components/modal/FolderModal";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/tasks/getall/tasks/675fabbdaf0e966398b0d92c`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTasks(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="">
      <div className="mt-10 flex">
        {tasks.map((task) => (
          <section
            class="group relative flex h-full w-full flex-col"
            onClick={() => {
              setShowFolderModal(true);
              setSelectedTask(task);
            }}
            key={task._id}
          >
            <div class="file relative z-50 h-40 w-60 origin-bottom cursor-pointer [perspective:1500px]">
              <div class="work-5 ease relative h-full w-full origin-top rounded-2xl rounded-tl-none bg-amber-600 transition-all duration-300 before:absolute before:-top-[15px] before:left-[75.5px] before:h-4 before:w-4 before:bg-amber-600 before:content-[''] before:[clip-path:polygon(0_35%,0%_100%,50%_100%);] after:absolute after:bottom-[99%] after:left-0 after:h-4 after:w-20 after:rounded-t-2xl after:bg-amber-600 after:content-[''] group-hover:shadow-[0_20px_40px_rgba(0,0,0,.2)]"></div>
              <div class="work-4 bg-zinc-400 ease absolute inset-1 origin-bottom select-none rounded-2xl transition-all duration-300 group-hover:[transform:rotateX(-20deg)]"></div>
              <div class="work-3 bg-zinc-300 ease absolute inset-1 origin-bottom rounded-2xl transition-all duration-300 group-hover:[transform:rotateX(-30deg)]"></div>
              <div class="work-2 bg-zinc-200 ease absolute inset-1 origin-bottom rounded-2xl transition-all duration-300 group-hover:[transform:rotateX(-38deg)]"></div>
              <div class="work-1 ease absolute bottom-0 flex h-[156px] w-full origin-bottom items-end rounded-2xl rounded-tr-none bg-gradient-to-t from-amber-500 to-amber-400 transition-all duration-300 before:absolute before:-top-[10px] before:right-[142px] before:size-3 before:bg-amber-400 before:content-[''] before:[clip-path:polygon(100%_14%,50%_100%,100%_100%);] after:absolute after:bottom-[99%] after:right-0 after:h-[16px] after:w-[146px] after:rounded-t-2xl after:bg-amber-400 after:content-[''] group-hover:shadow-[inset_0_20px_40px_#fbbf24,_inset_0_-20px_40px_#d97706] group-hover:[transform:rotateX(-46deg)_translateY(1px)]   "></div>
              <div class="work-1 ease absolute bottom-0 flex h-[126px] w-full origin-bottom items-end rounded-2xl rounded-tr-none bg-gradient-to-t from-amber-500 to-amber-400 transition-all duration-300 before:absolute before:-top-[10px] before:right-[142px] before:size-3 before:bg-amber-400 before:content-[''] before:[clip-path:polygon(100%_14%,50%_100%,100%_100%);] after:absolute after:bottom-[99%] after:right-0 after:h-[16px] after:w-[146px] after:rounded-t-2xl after:bg-amber-400 after:content-[''] group-hover:shadow-[inset_0_20px_40px_#fbbf24,_inset_0_-20px_40px_#d97706] group-hover:[transform:rotateX(-46deg)_translateY(1px)]">
                <p className="w-full  justify-center p-2 font-poppins text-sm font-semibold text-white ">
                  {" "}
                  {task?.taskName}
                </p>
              </div>{" "}
            </div>{" "}
          </section>
        ))}{" "}
        <FolderModal
          showFolderModal={showFolderModal}
          setShowFolderModal={setShowFolderModal}
          selectedTask={selectedTask}
        />
      </div>
    </div>
  );
};

export default Tasks;
