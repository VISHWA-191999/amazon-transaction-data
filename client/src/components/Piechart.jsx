import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

const PieChartComponent = ({ selectedMonthNumber }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPieChartData = async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-pieChartData`, {
        params: { month: selectedMonthNumber },
      });
      setData(response.data);
    };
    fetchPieChartData();
  }, [selectedMonthNumber]);

  return (
    <div className="w-full h-[150px]  shadow rounded p-4 flex items-center justify-around">
      <h2 className="text-2xl font-bold mb-4 text-white">Category Distribution</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={65}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
