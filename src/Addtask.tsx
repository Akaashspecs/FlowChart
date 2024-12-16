import { RiCloseCircleLine } from "react-icons/ri";
import AddFormScreen from "./AddFormScreen";
import { Todo } from "./type";

const Addtask = ({
  isFormVisible,
  setIsFormVisible,
  setTodoList,
  todoListLength,
}: {
  isFormVisible: boolean;
  setIsFormVisible: (boolean: boolean) => void;
  setTodoList: (boolean: Todo) => void;
  todoListLength: number;
}) => {
  return (
    <>
      {isFormVisible === true && (
        <div className="absolute z-10 h-screen w-screen backdrop-blur-[1px] flex justify-center items-center">
          <div className="bg-gray-100 h-fit w-[600px] rounded-lg shadow-lg flex flex-col px-4 py-3 mx-5">
            <div className="flex  justify-between h-min w-full">
              <div>Add Task</div>

              <RiCloseCircleLine
                className="relative z-10"
                onClick={() => setIsFormVisible(false)}
              />
            </div>
            <AddFormScreen
              setTodoList={setTodoList}
              todoListLength={todoListLength}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Addtask;
