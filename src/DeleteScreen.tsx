import { RiCloseCircleLine } from "react-icons/ri";

const DeleteScreen = ({
  setIsDeleteScreenVisible,
  handleDelete,
}: {
  setIsDeleteScreenVisible: (boolean: boolean) => void;
  handleDelete: () => void;
}) => {
  return (
    <div className="absolute z-10 h-screen w-screen backdrop-blur-[1px] flex justify-center items-center">
      <div className="bg-gray-100 h-fit w-[600px] rounded-lg shadow-lg flex flex-col px-4 py-3 mx-5">
        <div className="flex  justify-between h-min w-full">
          <div>Delete Task</div>

          <RiCloseCircleLine className="relative z-10" />
        </div>
        <p>Do you want to delete This task</p>
        <div className="flex justify-between">
          <div
            onClick={() => setIsDeleteScreenVisible(false)}
            className=" w-[150px] bg-gray-400 cursor-pointer text-white py-2 px-4 rounded text-center hover:bg-red-500"
          >
            No
          </div>
          <div
            onClick={() => handleDelete()}
            className="w-[150px] bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Yes
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteScreen;
