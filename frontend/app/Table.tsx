import React, { useState } from "react";

type TableRow = {
  _id: string;
  title: string;
  symbol: string;
  price: number;
  type: string;
};

type TableProps = {
  data: TableRow[];
  handleDelete: (_id: string) => void;
  handleEdit: (
    editId: string,
    symbol: string,
    price: number,
    type: string
  ) => void;
};

function Table(props: TableProps) {
  const { data, handleDelete, handleEdit } = props;

  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th className="px-4 py-2">Title</th>
          <th className="px-4 py-2">Symbol</th>
          <th className="px-4 py-2">Price</th>
          <th className="px-4 py-2">Type</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row._id}>
            <td className="border px-4 py-2">{row.title}</td>
            <td className="border px-4 py-2">{row.symbol}</td>
            <td className="border px-4 py-2">{row.price}</td>
            <td className="border px-4 py-2">{row.type}</td>
            <td className="border px-4 py-2">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                onClick={() =>
                  handleEdit(row._id, row.symbol, row.price, row.type)
                }
              >
                Edit
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                onClick={() => handleDelete(row._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
