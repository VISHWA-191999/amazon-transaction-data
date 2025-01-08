import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const BarChartComponent = ({ selectedMonthNumber }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchBarChartData = async () => {
      const response = await axios.get(`http://localhost:4000/api/product/get-barChartData`, {
        params: { month: selectedMonthNumber },
      });
      setData(response.data);
    };
    fetchBarChartData();
  }, [selectedMonthNumber]);

  return (
    <div className="w-full h-[220px] text-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-4">Price Range Distribution</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
