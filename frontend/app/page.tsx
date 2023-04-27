"use client";
import Image from "next/image";
import { Inter } from "next/font/google";

import { useState, useEffect } from "react";

import Table from "./Table";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState("");
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState(0);
  const [type, setType] = useState("TARGET");

  const API_BASE_URI = "https://notifier-1-b7933411.deta.app/api";

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URI}/notifications`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  const handleEdit = (
    editId: string,
    symbol: string,
    price: number,
    type: string
  ) => {
    setIsEditing(true);
    setEditId(editId);
    setSymbol(symbol);
    setPrice(price);
    setType(type);
    setShowForm(true);
  };

  const handleDelete = async (_id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this row?"
    );
    if (!confirmDelete) {
      return;
    }

    setLoading(true);

    const response = await fetch(`${API_BASE_URI}/notifications/${_id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      window.alert("Failed to delete the notification");
      return;
    }

    fetch(`${API_BASE_URI}/notifications`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requestUrl = isEditing
      ? `${API_BASE_URI}/notifications/${editId}`
      : `${API_BASE_URI}/notifications`;

    const requestOptions = {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symbol, price, type }),
    };

    const response = await fetch(requestUrl, requestOptions);

    if (!response.ok) {
      window.alert(`Failed to create notification. Status ${response.status}`);
      return;
    }

    window.alert(`Notification ${response.statusText} successfully`);

    setShowForm(false);
    setEditId("");
    setSymbol("");
    setPrice(0);
    setType("TARGET");
    setIsEditing(false);

    fetch(`${API_BASE_URI}/notifications`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  };

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No notification data</p>;

  return (
    <div className="container mx-auto h-screen">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-4 text-center py-5">
          Pending Notifications
        </h1>
        <Table
          data={data}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowForm(true)}
        >
          Create Notification
        </button>
        {showForm && (
          <form className="mb-4" onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label htmlFor="symbol" className="block font-bold mb-2">
                Symbol
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="border rounded w-full py-2 px-3"
                value={symbol}
                disabled={isEditing}
                onChange={(event) => setSymbol(event.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="block font-bold mb-2">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className="border rounded w-full py-2 px-3"
                value={price}
                onChange={(event) => setPrice(parseInt(event.target.value))}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="type" className="block font-bold mb-2">
                Type
              </label>
              <select
                id="type"
                name="Type"
                className="border rounded w-full py-2 px-3"
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                <option value="TARGET">TARGET</option>
                <option value="STOP_LOSS">STOP_LOSS</option>
              </select>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Submit
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
