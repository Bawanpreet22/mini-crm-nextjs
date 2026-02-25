"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Client = {
  id: string;
  name: string;
  task: string[];
};

export default function ClientsPage() {
const [clients, setClients] = useState<Client[]>(() => {
  try {
    const stored = localStorage.getItem("clients");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
});
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
 
  
  // load clients
  useEffect(() => {
    const stored = localStorage.getItem("clients");
    if (stored) setClients(JSON.parse(stored));
  }, []);


  const didMount = useRef(false);

useEffect(() => {
  if (!didMount.current) {
    didMount.current = true;
    return;
  }
  localStorage.setItem("clients", JSON.stringify(clients));
}, [clients]);

  

  const addClient = () => {
    const name = text.trim();
    if (!name) return;

    setClients((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, task: [] },
    ]);
    setText("");
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  // 🔍 search filter
  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-xl mx-auto p-6">
      <Link href="/" className="text-blue-500"> Home</Link>

      <h1 className="text-3xl font-bold mb-6">Clients</h1>

      {/* add client */}
      <div className="flex gap-2 mb-6">
        <input
          className="border p-2 rounded w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Client name"
        />
        <button
          onClick={addClient}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* search */}
      <input
        className="border p-2 rounded w-full mb-6"
        placeholder="Search clients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* empty state */}
      {clients.length === 0 && <p>No clients yet.</p>}

      <ul className="space-y-2">
        {filteredClients.map((client) => (
          <li
            key={client.id}
            className="flex justify-between border p-2 rounded"
          >
            <Link href={`/clients/${client.id}`} className="font-medium">
              {client.name}
            </Link>

            <button
              onClick={() => deleteClient(client.id)}
              className="bg-red-500 text-white px-3 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
