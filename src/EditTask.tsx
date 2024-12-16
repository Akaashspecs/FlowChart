import { RiCloseCircleLine } from "react-icons/ri";
import EditFormScreen from "./EditFormScreen";
import { TodoObject } from "./type";

const EditTask = ({
  setEditTask,
  editTodoList,
  todoListLength,
  editTask,
}: {
  editTask: TodoObject | null;
  setEditTask: (TodoObject: TodoObject | null) => void;
  editTodoList: (todoObject: TodoObject) => void;
  todoListLength: number;
}) => {
  return (
    <div className="absolute z-10 h-screen w-screen backdrop-blur-[1px] flex justify-center items-center">
      <div className="bg-gray-100 h-fit w-[600px] rounded-lg shadow-lg flex flex-col px-4 py-3 mx-5">
        <div className="flex  justify-between h-min w-full">
          <div>Edit Task</div>

          <RiCloseCircleLine
            onClick={() => setEditTask(null)}
            className="relative z-10"
          />
        </div>
        <EditFormScreen
          editTask={editTask}
          setEditTask={setEditTask}
          editTodoList={editTodoList}
          todoListLength={todoListLength}
        />
      </div>
    </div>
  );
};

export default EditTask;
