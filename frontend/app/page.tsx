"use client";
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
  const [quantity, setQuantity] = useState(0);
  const [entry, setEntry] = useState(0);
  const [target, setTarget] = useState(0);
  const [stopLoss, setStopLoss] = useState(0);
  const [exit, setExit] = useState(0);
  const [status, setStatus] = useState("OPEN");
  const [type, setType] = useState("BUY");

  const API_BASE_URI = "/api";

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URI}/orders`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  const handleEdit = (
    editId: string,
    symbol: string,
    entry: number,
    target: number,
    stopLoss: number,
    exit: number,
    status: string,
    quantity: number,
    type: string
  ) => {
    setIsEditing(true);
    setEditId(editId);
    setSymbol(symbol);
    setEntry(entry);
    setTarget(target);
    setStopLoss(stopLoss);
    setExit(exit);
    setStatus(status);
    setShowForm(true);
    setType(type);
    setQuantity(quantity);
  };

  const handleDelete = async (_id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this row?"
    );
    if (!confirmDelete) {
      return;
    }

    setLoading(true);

    const response = await fetch(`${API_BASE_URI}/orders/${_id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      window.alert("Failed to delete the order");
      return;
    }

    fetch(`${API_BASE_URI}/orders`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requestUrl = isEditing
      ? `${API_BASE_URI}/orders/${editId}`
      : `${API_BASE_URI}/orders`;

    const requestOptions = {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol,
        entry,
        target,
        stopLoss,
        exit,
        status,
        quantity,
        type,
      }),
    };

    const response = await fetch(requestUrl, requestOptions);

    if (!response.ok) {
      window.alert(`Failed to create order. Status ${response.status}`);
      return;
    }

    window.alert(`Order ${response.statusText} successfully`);

    setShowForm(false);
    setEditId("");
    setSymbol("");
    setEntry(0);
    setTarget(0);
    setStopLoss(0);
    setExit(0);
    setStatus("OPEN");
    setType("BUY");
    setQuantity(0);
    setIsEditing(false);

    fetch(`${API_BASE_URI}/orders`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  };

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No order data</p>;

  return (
    <div className="container mx-auto h-screen">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-4 text-center py-5">Orders</h1>
        <Table
          data={data}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowForm(true)}
        >
          Create Order
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
                className="border rounded w-full py-2 px-3 text-black"
                value={symbol}
                disabled={isEditing}
                onChange={(event) => setSymbol(event.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="quantity" className="block font-bold mb-2">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                className="border rounded w-full py-2 px-3 text-black"
                value={quantity}
                onChange={(event) => setQuantity(parseInt(event.target.value))}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="entry" className="block font-bold mb-2">
                Entry
              </label>
              <input
                type="number"
                id="entry"
                name="entry"
                className="border rounded w-full py-2 px-3 text-black"
                value={entry}
                onChange={(event) => setEntry(parseInt(event.target.value))}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="target" className="block font-bold mb-2">
                Target
              </label>
              <input
                type="number"
                id="target"
                name="target"
                className="border rounded w-full py-2 px-3 text-black"
                value={target}
                onChange={(event) => setTarget(parseInt(event.target.value))}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="stopLoss" className="block font-bold mb-2">
                Stop Loss
              </label>
              <input
                type="number"
                id="stopLoss"
                name="Stop Loss"
                className="border rounded w-full py-2 px-3 text-black"
                value={stopLoss}
                onChange={(event) => setStopLoss(parseInt(event.target.value))}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="exit" className="block font-bold mb-2">
                Exit
              </label>
              <input
                type="number"
                id="exit"
                name="exit"
                className="border rounded w-full py-2 px-3 text-black"
                value={exit}
                onChange={(event) => setExit(parseInt(event.target.value))}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="type" className="block font-bold mb-2">
                Type
              </label>
              <select
                id="type"
                name="Type"
                className="border rounded w-full py-2 px-3 text-black"
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="status" className="block font-bold mb-2">
                Status
              </label>
              <select
                id="status"
                name="Status"
                className="border rounded w-full py-2 px-3 text-black"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="OPEN">Open</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
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
              onClick={() => {
                setShowForm(false);
                setEditId("");
                setSymbol("");
                setEntry(0);
                setTarget(0);
                setStopLoss(0);
                setExit(0);
                setStatus("OPEN");
                setType("BUY");
                setQuantity(0);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
