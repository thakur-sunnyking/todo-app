import { useState, useEffect, useRef } from 'react';


function App() {
  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedText, setEditedText] = useState("");
  const textareaRef = useRef(null);

  const [todos, setTodos] = useState(() => {
    const stored = localStorage.getItem("todos");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);


  const addTodo = () => {
    if (input.trim() !== "") {
      setTodos([...todos, { text: input, completed: false }]);
      setInput("");
    }
  };

  const toggleTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditedText(todos[index].text);
  };

  const saveEdit = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].text = editedText;
    setTodos(updatedTodos);
    setEditingIndex(null);
    setEditedText("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditedText("");
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset first
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Grow to fit
    }
  }, [editedText, editingIndex]);



  return (
    <div className="min-h-screen bg-gray-100 p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">To-Do List</h1>

      <div className="flex mb-4">
        <input
          className="flex-grow p-2 border rounded-l"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add new task"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <ul>
        {todos.map((todo, index) => (
          <li
            key={index}
            className={`flex justify-between items-center p-2 mb-2 rounded ${todo.completed ? 'bg-green-200 line-through' : 'bg-white'
              }`}
          >

            {editingIndex === index ? (
              <div className="flex flex-col gap-2 w-full">
                <textarea
                  ref={textareaRef}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows={1}
                  className="flex-grow p-2 border rounded resize-none overflow-hidden transition-all duration-200"
                  onInput={(e) => {
                    e.target.style.height = 'auto'; // Reset height
                    e.target.style.height = `${e.target.scrollHeight}px`; // Grow based on content
                  }}
                />

                <button
                  onClick={() => saveEdit(index)}
                  className='bg-green-300 text-white px-2 rounded hover:bg-green-600'
                >
                  Save
                </button>

                <button
                  onClick={cancelEdit}
                  className='bg-gray-300 px-2 rounded hover:bg-red-600'
                >
                  Cancel
                </button>
              </div>

            ) : (

              <div className="flex items-center flex-grow gap-2">

                <div className="flex flex-grow gap-2 items-start">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(index)}
                    className="w-4 h-4 my-1"
                  />
                  <span className={`${todo.completed ? "line-through text-gray-500" : ""}`}
                  >
                    {todo.text}
                  </span>
                </div>

                {!todo.completed && (
                  <button
                    onClick={() => startEdit(index)}
                    className="text-blue-300 hover:text-blue-700"
                  >
                    ✏️
                  </button>
                )}

                <button
                  onClick={() => deleteTodo(index)}
                  className="text-red-600 hover:text-red-800 ml-4"
                >
                  ❌
                </button>

              </div>

            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
