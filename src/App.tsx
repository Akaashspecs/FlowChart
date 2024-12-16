import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ReactTabulator } from "react-tabulator";
import { toast } from "react-toastify";
import "tabulator-tables/dist/css/tabulator.min.css";
import Addtask from "./Addtask";
import DeleteScreen from "./DeleteScreen";
import EditTask from "./EditTask";
import { TodoObject } from "./type";

type Todo = {
  userId?: number;
  id: number;
  title: string;
  completed: boolean | string;
  description?: string;
}[];

function App() {
  const [todoList, setTodoList] = useState<Todo>([]);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [isDeleteScreenVisible, setIsDeleteScreenVisible] =
    useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<TodoObject | null>(null);

  const [fliterTodoList, setFilterTodoList] = useState<Todo | null>(null);
  const [editTask, setEditTask] = useState<TodoObject | null>(null);

  const savedTodoList = localStorage.getItem("todoList");
  const [searchParams, setSearchParams] = useSearchParams();
  const searchText = searchParams.get("search") || "";
  const selectedOption = searchParams.get("filter") || "";
  const [counter, setCounter] = useState<{ num: number; status: string }[]>([]);
  // Array of options
  const options = ["To Do", "In Progress", "Done"];

  useEffect(() => {
    if (savedTodoList) {
      const todoList: Todo = JSON.parse(savedTodoList);
      setTodoList(todoList);
      const statusCounts = [
        {
          status: "To Do",
          num: todoList.filter((todo) => todo.completed === "To Do").length,
        },
        {
          status: "In Progress",
          num: todoList.filter((todo) => todo.completed === "In Progress")
            .length,
        },
        {
          status: "Done",
          num: todoList.filter((todo) => todo.completed === "Done").length,
        },
      ];
      setCounter(statusCounts);
    }
  }, [savedTodoList]);

  useEffect(() => {
    if (
      selectedOption.length === 0 &&
      searchText &&
      searchText !== "" &&
      savedTodoList &&
      savedTodoList.length > 0
    ) {
      const todoList: Todo = JSON.parse(savedTodoList);
      const filtered = todoList.filter((todo) =>
        todo.title.toLowerCase().includes(searchText)
      );
      setFilterTodoList(filtered);
    } else {
      setFilterTodoList(null);
    }
  }, [searchText, selectedOption]);

  useEffect(() => {
    if (
      searchText.length === 0 &&
      selectedOption &&
      savedTodoList &&
      savedTodoList.length > 0
    ) {
      if (selectedOption !== "clear") {
        const todoList: Todo = JSON.parse(savedTodoList);
        const filterValue = todoList.filter(
          (item) => item.completed === selectedOption
        );
        setFilterTodoList(filterValue);
      }
      if (selectedOption === "clear") {
        setFilterTodoList(null);
      }
    }
  }, [selectedOption, searchText]);

  useEffect(() => {
    if (
      selectedOption.length !== 0 &&
      searchText.length !== 0 &&
      savedTodoList &&
      savedTodoList.length > 0
    ) {
      if (selectedOption !== "clear") {
        const todoList: Todo = JSON.parse(savedTodoList);
        const optionFilterValue = todoList.filter(
          (item) => item.completed === selectedOption
        );

        const filtered = optionFilterValue.filter((todo) =>
          todo.title.toLowerCase().includes(searchText)
        );

        setFilterTodoList(filtered);
      }
    }
  }, [selectedOption, searchText]);

  const columns = [
    { title: "ID", field: "id", width: 10 },
    { title: "Title", field: "title", width: 200 },
    { title: "Description", field: "description", width: 150 },
    {
      title: "Status",
      field: "completed",
      width: 150,
      formatter: (cell: any) => {
        const value = cell.getValue(); // Get the status value
        const color =
          value === "Done"
            ? "rgba(11, 204, 8, 0.8)"
            : value === "In Progress"
            ? "orange"
            : "rgba(255, 0, 0, 0.6)";
        return `<span style="background-color: ${color}; font-weight: bold; width: 100%; padding: 3px 10px; border-radius: 10px;">${value}</span>`;
      },
    },
    {
      title: "Actions",
      field: "actions",
      width: 150,
      formatter: () => {
        // Return an HTML string for the buttons
        return `
          <div style="display: flex; gap: 10px; justify-content: center;">
            <i class="fa fa-edit" style="cursor: pointer; color: #007bff;" data-action="edit">Edit</i>
            <i class="fa fa-trash" style="cursor: pointer; color: red;" data-action="delete"> Delete</i>
          </div>`;
      },
      cellClick: (e: UIEvent, cell: any) => {
        const action = (e.target as HTMLElement).dataset.action;
        const rowData = cell.getData();

        if (action === "edit") {
          handleEdit(rowData);
        } else if (action === "delete") {
          handleDeleteScreen(rowData);
        }
      },
    },
  ];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);

      if (value === "") {
        newParams.delete("search"); // Remove the filter if "clear" is selected
      } else {
        newParams.set("search", value); // Set the filter value
      }

      return newParams;
    });
  };

  // Handle the change event
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    // setSelectedOption(value === "clear" ? "" : value);
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);

      if (value === "clear") {
        newParams.delete("filter"); // Remove the filter if "clear" is selected
      } else {
        newParams.set("filter", value); // Set the filter value
      }

      return newParams;
    });
  };

  const handleEdit = (rowData: Todo[number]) => {
    setEditTask(rowData);
  };

  const handleDeleteScreen = (rowData: Todo[number]) => {
    setSelectedTask(rowData);
    setIsDeleteScreenVisible(true);
  };

  const handleDelete = () => {
    const listAfterDeleteTask = todoList.filter(
      (item) => item.id !== selectedTask?.id
    );

    localStorage.setItem("todoList", JSON.stringify(listAfterDeleteTask));
    setIsDeleteScreenVisible(false);
    toast.success("Task Deleted Successfully");
  };

  const handleAddTodo = (newTodo: Todo) => {
    // Get the current todo list from localStorage
    const savedTodoList = localStorage.getItem("todoList");
    let updatedTodoList: Todo = [];

    if (savedTodoList) {
      // If there's already a todo list in localStorage, parse it
      updatedTodoList = JSON.parse(savedTodoList);
      toast.success("Task Added Sucessfully");
    }

    // Append the new Todo to the list
    updatedTodoList.push(newTodo[0]);

    // Save the updated list back to localStorage
    localStorage.setItem("todoList", JSON.stringify(updatedTodoList));
    setIsFormVisible(false);
  };

  const handleEditTodo = (updatedTodo: TodoObject) => {
    // Append the new Todo to the existing list
    if (savedTodoList) {
      const todoList: Todo = JSON.parse(savedTodoList);
      const editedTodoList = todoList.map((item) =>
        item.id === updatedTodo.id ? updatedTodo : item
      );
      localStorage.setItem("todoList", JSON.stringify(editedTodoList));
      toast.success("Task Edited Sucessfully");
    }

    setTodoList((prevList) =>
      prevList.map((item) => (item.id === updatedTodo.id ? updatedTodo : item))
    );
    setEditTask(null);
    // setTodoList((prevList) => [...prevList, newTodo[0]]);
  };

  const memoizedCallback = useCallback((todo: Todo) => {
    const filterList = todo
      .filter((item) => item.id < 21)
      .map((item) => ({
        ...item,
        description: item.description || "-",
        completed: item.completed === true ? "Done" : "To Do", // Replace empty or undefined descriptions
      }));
    localStorage.setItem("todoList", JSON.stringify(filterList));
    setTodoList(filterList);
  }, []);

  useEffect(() => {
    if (!savedTodoList) {
      axios
        .get<Todo>("https://jsonplaceholder.typicode.com/todos")
        .then((res) => memoizedCallback(res.data));
    }
  }, []);

  return (
    <div className="h-full">
      <Addtask
        isFormVisible={isFormVisible}
        setIsFormVisible={setIsFormVisible}
        setTodoList={handleAddTodo}
        todoListLength={todoList.length}
      />

      {editTask && (
        <EditTask
          editTask={editTask}
          setEditTask={setEditTask}
          editTodoList={handleEditTodo}
          todoListLength={todoList.length}
        />
      )}

      {isDeleteScreenVisible && (
        <DeleteScreen
          setIsDeleteScreenVisible={setIsDeleteScreenVisible}
          handleDelete={handleDelete}
        />
      )}
      <div className="w-full flex justify-center md:justify-end bg-gradient-to-r from-cyan-500 to-blue-500 py-5 px-3">
        <div
          onClick={() => setIsFormVisible(true)}
          className="bg-gradient-to-r from-red-400 to-red-500 px-3 py-2 rounded-md"
        >
          + Add Task
        </div>
      </div>
      <div className="w-full flex justify-center mt-5">
        <div className="w-fit flex items-center flex-col rounded-lg border overflow-hidden">
          <div className="w-full bg-gradient-to-r text-[20px] from-red-300 to-red-400 text-center py-2">
            Counter
          </div>
          <div className="flex ">
            {counter &&
              counter.map((item) => (
                <div className="px-4">
                  <div className="text-center">{item.status}</div>{" "}
                  <div className="text-center">{item.num}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className=" mx-5 mt-[50px] overflow-x-scroll">
          <div className="flex flex-wrap flex-col-reverse gap-4 sm:gap-0 items-center sm:flex-row justify-between ">
            <div>
              <div className="text-[12px] text-center sm:text-start">
                Filter
              </div>
              <select
                id="status"
                value={selectedOption}
                onChange={handleChange}
                className="w-[230px] sm:w-[330px] px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Please select a status
                </option>
                {options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
                {/* Add an option for clearing */}
                <option value="clear">Unselect/Reset</option>
              </select>
            </div>
            <div>
              <div className="text-[12px] text-center  sm:text-start">
                Search
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchText}
                onChange={handleSearch}
                className="px-3 py-[6px] border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className=" mt-[20px]  ">
            {todoList.length > 0 && (
              <ReactTabulator
                className=" h-[500px]"
                data={fliterTodoList ? fliterTodoList : todoList}
                columns={columns}
                layout={"fitDataTable"}
                responsiveLayout={"collapse"} // Enables responsive layout
                responsiveLayoutCollapseFormatter={(data: any) => {
                  return data
                    .map((d: any) => `<div>${d.title}: ${d.value}</div>`)
                    .join(""); // Custom display for collapsed data
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
