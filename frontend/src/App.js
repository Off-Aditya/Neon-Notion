import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);

  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const fetchPages = async () => {
    const res = await axios.get("http://localhost:5000/api/pages");
    setPages(res.data);
  };

  const createPage = async () => {
    const res = await axios.post("http://localhost:5000/api/pages", {
      title: "Untitled",
      content: "",
      tags: [],
      tasks: [],
    });
    fetchPages();
    setCurrentPage(res.data);
    setTags([]);
    setTasks([]);
  };

  const updatePage = async (field, value) => {
    const updated = {
      ...currentPage,
      [field]: value,
      tags,
      tasks,
    };
    setCurrentPage(updated);
    await axios.put(`http://localhost:5000/api/pages/${currentPage._id}`, updated);
    fetchPages();
  };

  const deletePage = async () => {
    await axios.delete(`http://localhost:5000/api/pages/${currentPage._id}`);
    setCurrentPage(null);
    setTags([]);
    setTasks([]);
    fetchPages();
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <div className="app">
      <div className="sidebar">
        <div className="logo">.NEON</div>
        <h2>Pages</h2>
        <ul>
          {pages.map((page) => (
            <li
              key={page._id}
              onClick={() => {
                setCurrentPage(page);
                setTags(page.tags || []);
                setTasks(page.tasks || []);
              }}
            >
              {page.title || "Untitled"}
            </li>
          ))}
        </ul>
        <button onClick={createPage}>+ New Page</button>

        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add tag"
          />
          <button
            onClick={() => {
              if (!newTag) return;
              const updatedTags = [...tags, newTag];
              setTags(updatedTags);
              updatePage("tags", updatedTags);
              setNewTag("");
            }}
          >
            +Tag
          </button>

          <div>
            {tags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  marginRight: "6px",
                  padding: "2px 6px",
                  background: "#ddd",
                  borderRadius: "4px",
                  display: "inline-block",
                  marginTop: "4px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="editor">
        {currentPage ? (
          <>
            <input
              value={currentPage.title}
              onChange={(e) => updatePage("title", e.target.value)}
              placeholder="Page Title"
            />

            {currentPage?.updatedAt && (
              <p style={{ fontSize: "14px", color: "gray" }}>
                Last edited: {new Date(currentPage.updatedAt).toLocaleString()}
              </p>
            )}

            <textarea
              value={currentPage.content}
              onChange={(e) => updatePage("content", e.target.value)}
              placeholder="Write something..."
            />

            <h4>Tasks</h4>
            <ul>
              {tasks.map((task, index) => (
                <li key={index}>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => {
                      const updatedTasks = [...tasks];
                      updatedTasks[index].done = !updatedTasks[index].done;
                      setTasks(updatedTasks);
                      updatePage("tasks", updatedTasks);
                    }}
                  />
                  <span
                    style={{
                      textDecoration: task.done ? "line-through" : "none",
                    }}
                  >
                    {task.text}
                  </span>
                </li>
              ))}
            </ul>

            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="New task..."
            />
            <button
              onClick={() => {
                if (!newTask) return;
                const updatedTasks = [...tasks, { text: newTask, done: false }];
                setTasks(updatedTasks);
                updatePage("tasks", updatedTasks);
                setNewTask("");
              }}
            >
              + Add Task
            </button>

            <button
              onClick={deletePage}
              style={{ marginTop: "10px", marginLeft:"7px",color: "" }}
            >
              Delete Page
            </button>
          </>
        ) : (
          <p>Select or create a page to get started</p>
        )}
      </div>
    </div>
  );
}

export default App;
