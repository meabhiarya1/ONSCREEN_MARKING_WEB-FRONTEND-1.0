import React, { useState, useEffect } from "react";

const EditAssingModal = ({
  setShowEditModal,
  currentTask,
  setShowTaskModal,
  setCurrentTask,
  updateTaskInParent,
}) => {
  const [taskName, setTaskName] = useState(currentTask?.taskName);
  const [subjectCode, setSubjectCode] = useState(currentTask?.subjectCode);
  const [className, setClassName] = useState(currentTask?.className);
  const [totalFiles, setTotalFiles] = useState(currentTask?.totalFiles);
  const [status, setStatus] = useState(currentTask?.status);

  const handleUpdate = () => {
    const updatedTask = {
      ...currentTask,
      taskName,
      subjectCode,
      className,
      totalFiles,
      status,
    };

    // Update the task in the parent component state
    updateTaskInParent(updatedTask);

    // Close modal and reset state
    setShowEditModal(false);
    setShowTaskModal(false);
    setCurrentTask({});
  };

  useEffect(() => {
    setTaskName(currentTask?.taskName);
    setSubjectCode(currentTask?.subjectCode);
    setClassName(currentTask?.className);
    setTotalFiles(currentTask?.totalFiles);
    setStatus(currentTask?.status);
  }, [currentTask]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h3 className="text-xl font-semibold">Edit Task</h3>
        <div className="mt-4">
          <div>
            <label htmlFor="taskName">Task Name</label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="mt-1 w-full rounded border px-4 py-2"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="subjectCode">Subject Code</label>
            <input
              type="text"
              id="subjectCode"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className="mt-1 w-full rounded border px-4 py-2"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="className">Class Name</label>
            <input
              type="text"
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="mt-1 w-full rounded border px-4 py-2"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="totalFiles">Total Files</label>
            <input
              type="number"
              id="totalFiles"
              value={totalFiles}
              onChange={(e) => setTotalFiles(e.target.value)}
              className="mt-1 w-full rounded border px-4 py-2"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full rounded border px-4 py-2"
            >
              <option value={false}>Pending</option>
              <option value={true}>Completed</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => setShowEditModal(false)}
            className="rounded bg-gray-500 px-4 py-2 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="rounded bg-blue-500 px-4 py-2 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAssingModal;
