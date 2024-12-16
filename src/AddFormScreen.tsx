import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { Todo } from "./type";

interface FormValues {
  title: string;
  description: string;
  completed: string | null;
}

interface Props {
  setTodoList: (todo: Todo) => void;
  todoListLength: number;
}

const AddFormScreen: React.FC<Props> = ({ setTodoList, todoListLength }) => {
  const initialValues: FormValues = {
    title: "",
    description: "",
    completed: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .required("Title is required"),

    description: Yup.string().max(
      100,
      "Description must not exceed 100 characters"
    ),
    completed: Yup.string()
      .required("Category is required") // Ensure the user selects an option
      .oneOf(["To Do", "In Progress", "Done"], "Invalid category selected"), // Restrict to valid options
  });

  const handleSubmit = (values: FormValues) => {
    if (values) {
      const savedTodoList = localStorage.getItem("todoList");
      const newTodo: Todo = [
        {
          id: todoListLength + 1, // Generate a unique ID based on the current list length
          title: values.title,
          description: values.description || "-",
          completed: values.completed || "To Do",
        },
      ];

      setTodoList(newTodo);
    }
  };

  return (
    <div className=" w-full  p-5 border rounded-md  mt-3">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            {/* Title Field */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm mb-1">
                Title:
              </label>
              <Field
                name="title"
                type="text"
                className="w-full px-3  border rounded focus:outline-none focus:ring-2 focus:ring-transparent"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-[10px]"
              />
            </div>

            {/* Description Field */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm mb-1">
                Description:
              </label>
              <Field
                name="description"
                type="text"
                className="w-full px-3  border rounded focus:outline-none focus:ring-2 focus:ring-transparent"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="completed" className="block text-sm mb-1">
                Status:
              </label>
              <Field
                name="completed"
                as="select"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" label="Please select status" />
                <option value="To Do" label="To Do" />
                <option value="In Progress" label="In Progress" />
                <option value="Done" label="Done" />
              </Field>
              <ErrorMessage
                name="category"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Completed Field */}
            {/* <div className="mb-4">
              <label className="flex items-center">
                <Field name="completed" type="checkbox" className="mr-2" />
                Completed
              </label>
            </div> */}

            {/* Submit Button */}
            <div className="flex justify-between">
              <div className=" w-[150px] bg-gray-400 cursor-pointer text-white py-2 px-4 rounded text-center hover:bg-red-500">
                Cancel
              </div>
              <button
                type="submit"
                className="w-[150px] bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddFormScreen;
