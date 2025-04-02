import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  // Aufgaben vom Server abrufen
  useEffect(() => {
    fetch("http://localhost:3050/liste_abrufen")
      .then((res) => res.json())
      .then(setTasks)
      .catch((error) => console.error("Fehler beim Laden der Aufgaben:", error));
  }, []);

  // Neue Aufgabe hinzufügen
  const itemHinzufuegen = () => {
    if (!title.trim()) {
      return;
    }

    fetch("http://localhost:3050/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, completed: false, deadline: deadline || null }),
    })
      .then((res) => res.json())
      .then((neueAufgabe) => setTasks([...tasks, neueAufgabe]))
      .catch((error) => console.error("Fehler beim Hinzufügen einer Aufgabe:", error));

    setTitle("");
    setDeadline("");
  };

  // Aufgabe löschen
  const itemLoeschen = (id_nummer) => {
    fetch(`http://localhost:3050/delete/${id_nummer}`, {
      method: "DELETE",
    })
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter(task => task.id !== id_nummer));
      })
      .catch((error) => console.error("Fehler beim Löschen einer Aufgabe:", error));
  };

  // Aufgabe als erledigt markieren
  const taskStatusAktualisieren = (id_nummer, completed) => {
    fetch(`http://localhost:3050/update/${id_nummer}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    })
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.map(task =>
            task.id === id_nummer ? { ...task, completed: !completed } : task
          )
        );
      })
      .catch((error) => console.error("Fehler beim Aktualisieren des Status:", error));
  };

  return (
    <>
      <h1>To-Do List</h1>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Aufgabe eingeben"
      />
      <input
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button disabled={!title.trim()} onClick={itemHinzufuegen}>
        Add
      </button>

      <ul>
        {tasks.map(({ id, title, completed, deadline }) => (
          <li key={id} className={completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={completed}
              onChange={() => taskStatusAktualisieren(id, completed)}
            />
            {title} - <em>Deadline: {deadline ? new Date(deadline).toLocaleString() : "Keine"}</em>
            <button onClick={() => itemLoeschen(id)}>X</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;