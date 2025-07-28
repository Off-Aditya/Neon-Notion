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

  const themes = ["light", "dark", "sakura", "retro", "solarized", "tokyo"];
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };
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
    const confirmDelete = window.confirm("Are you sure you want to delete this page?");
    if (!confirmDelete) return;

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
    <div className={`app ${theme}`}>
      {/* Theme Toggle Button */}
      <div className="theme-toggle" onClick={toggleTheme} title={`Theme: ${theme}`}>
        {
          {
            light: "☀️",
            dark: "🌙",
            sakura: "🌸",
            retro: "💾",
            solarized: "🟨",
            tokyo: "🌆",
          }[theme]
        }
      </div>


      {/* Sidebar */}
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

        {/* Tag Input */}
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
                className="tag"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="editor">
        {currentPage ? (
          <>
            <input
              type="text"
              value={currentPage.title}
              onChange={(e) => updatePage("title", e.target.value)}
              placeholder="Untitled"
              className="page-title"
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

            <button className="delete-btn" onClick={deletePage}>
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
