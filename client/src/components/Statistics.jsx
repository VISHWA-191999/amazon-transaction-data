import React, { useState, useEffect } from "react";
import axios from "axios";

const Statistics = ({ selectedMonthNumber }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    const fetchStatistics = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/get-statistics`,
        { params: { month: selectedMonthNumber } }
      );
      setStatistics(response.data);
    };
    fetchStatistics();
  }, [selectedMonthNumber]);

  return (
    <div className="grid grid-cols-3 items-center gap-2">
      <div className="p-4 bg-blue-100 rounded">
        <h2 className="text-lg font-bold">Total Sale Amount</h2>
        <p>{statistics.totalSaleAmount}</p>
      </div>
      <div className="p-4 bg-green-100 rounded">
        <h2 className="text-lg font-bold">Sold Items</h2>
        <p>{statistics.soldItems}</p>
      </div>
      <div className="p-4 bg-red-100 rounded">
        <h2 className="text-lg font-bold">Unsold Items</h2>
        <p>{statistics.unsoldItems}</p>
      </div>
    </div>
  );
};

export default Statistics;
