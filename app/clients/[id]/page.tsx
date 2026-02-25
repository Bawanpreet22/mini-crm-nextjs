"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Client = { id: string; name: string; task: string[] };

export default function ClientPage() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [taskText, setTaskText] = useState("");

  // 1) helper: get all clients from storage
  const readClients = (): Client[] => {
    const raw = localStorage.getItem("clients");
    return raw ? JSON.parse(raw) : [];
  };

  // 2) helper: save all clients to storage
  const writeClients = (clients: Client[]) => {
    localStorage.setItem("clients", JSON.stringify(clients));
  };

  // 3) load client when page opens
  useEffect(() => {
    const clients = readClients();
    const found = clients.find((c) => c.id === id) ?? null;
    setClient(found);
  }, [id]);

  // 4) add task
  const addTask = () => {
    const t = taskText.trim();
    if (!t || !client) return;

    const clients = readClients();
    const updatedClients = clients.map((c) =>
      c.id === id ? { ...c, task: [...c.task, t] } : c
    );

    writeClients(updatedClients);
    setClient({ ...client, task: [...client.task, t] });
    setTaskText("");
  };

  // 5) delete task
  const deleteTask = (index: number) => {
    if (!client) return;

    const clients = readClients();
    const updatedClients = clients.map((c) =>
      c.id === id ? { ...c, task: c.task.filter((_, i) => i !== index) } : c
    );

    writeClients(updatedClients);
    setClient({ ...client, task: client.task.filter((_, i) => i !== index) });
  };

  if (!client) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <Link href="/clients" className="text-blue-600">← Back</Link>
        <p className="mt-4">Client not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <Link href="/clients" className="text-blue-600">← Back</Link>
      <h2 className="text-2xl font-bold mt-4">{client.name}</h2>

      <div className="flex gap-2 mt-6">
        <input
          className="border p-2 rounded w-full"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="New task"
        />
        <button onClick={addTask} className="bg-blue-600 text-white px-4 rounded">
          Add
        </button>
      </div>

      {client.task.length === 0 ? (
        <p className="mt-6 text-gray-600">No tasks yet.</p>
      ) : (
        <ul className="mt-6 space-y-2">
          {client.task.map((t, i) => (
            <li key={i} className="flex justify-between border p-2 rounded">
              <span>{t}</span>
              <button
                onClick={() => deleteTask(i)}
                className="bg-red-600 text-white px-3 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}