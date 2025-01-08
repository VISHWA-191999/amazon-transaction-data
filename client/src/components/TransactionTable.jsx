import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionTable = ({ selectedMonthNumber, searchQuery }) => {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    console.log(selectedMonthNumber)
    const fetchTransactions = async () => {
      const response = await axios.get(
        `http://localhost:4000/api/product/get-transactions`,
        {
          params: {
            month: selectedMonthNumber,
            search: searchQuery,
            page,
          },
        }
      );
      setTransactions(response.data.transactions);
      setTotal(response.data.total);
    };
    fetchTransactions();
  }, [selectedMonthNumber, searchQuery, page]);

  return (
    <div className="w-full ">
      <div className="max-h-[200px] overflow-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-300 sticky top-0  ">
            <tr className="text-sm h-full ">
              <th className="border border-white border-solid px-4 ">Title</th>
              <th className="border border-white border-solid px-4 py-0.5">Description</th>
              <th className="border border-white border-solid px-4 py-2">Price</th>
              <th className="border border-white border-solid px-4 py-2">Category</th>
              <th className="border border-white border-solid px-4 py-2">Sold</th>
              <th className="border border-white border-solid px-4 py-2">Date of Sale</th>
              <th className="border border-white border-solid px-4 py-2">Image</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn._id} className="border border-white border-solid text-white text-xs hover:bg-gray-700">
                <td className="border py-1 text-start">{txn.title}</td>
                <td className="border py-1 line-clamp-5 text-start">{txn.description}</td>
                <td className="border py-1">{txn.price}</td>
                <td className="border py-1">{txn.category}</td>
                <td className="border py-1">{txn.sold ? "Yes" : "No"}</td>
                <td className="border py-1">
                  {new Date(txn.dateOfSale).toLocaleDateString()}
                </td>
                <td className="border py-1 ">
                  <img src={txn.image} alt="" className="w-10 h-10 object-cover mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className={`px-4 py-2 rounded transition-colors ${
            page === 1
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
          }`}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-white">
          Page {page} of {Math.ceil(total / 10)}
        </span>
        <button
          onClick={() => setPage((prev) => (prev * 10 >= total ? prev : prev + 1))}
          className={`px-4 py-2 rounded transition-colors ${
            page * 10 >= total
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
          }`}
          disabled={page * 10 >= total}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
