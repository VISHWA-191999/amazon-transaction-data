import React, { useState } from "react";
import Statistics from "../components/Statistics";
import TransactionTable from "../components/TransactionTable";
import PieChartComponent from "../components/Piechart";
import BarChartComponent from "../components/Barchart";

import { getMonthNumber, months } from "../constant/data";

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [selectedMonthNumber, setSelectedMonthNumber] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setSelectedMonthNumber(getMonthNumber(e.target.value));
    // console.log(getMonthNumber(e.target.value))
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className=" p-2 text-center h-screen">
      <h1 className="text-2xl font-bold  mb-2 text-white">Dashboard</h1>

      {/* Month and Search */}
      <div className="flex justify-between  gap-4 mb-2 w-full">
        <div className=" flex justify-between rounded-md gap-4 w-1/6   ">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="p-2 border border-gray-300 rounded flex-1 mb-2 h-full "
          >
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded w-full "
        />
      </div>

      {/* Components */}
      {/* <div className="grid grid-cols-2 grid-rows-2 gap-6 mb-6">
        <Statistics selectedMonth={selectedMonth} />
        <BarChartComponent selectedMonth={selectedMonth} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChartComponent selectedMonth={selectedMonth} />
        <TransactionTable selectedMonth={selectedMonth} searchQuery={searchQuery} />
      </div> */}
      <div className="flex flex-col gap-2 ">
        <div className="flex justify-between gap-2 ">
          <div className="w-full p-2 bg-black">
            <TransactionTable
              selectedMonthNumber={selectedMonthNumber}
              searchQuery={searchQuery}
            />
          </div>
          <div className=" w-[60%] p-2 bg-black">
            <BarChartComponent selectedMonthNumber={selectedMonthNumber} />
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <div className="w-full p-2 bg-black">
            <PieChartComponent selectedMonthNumber={selectedMonthNumber} />
          </div>
          <div className=" w-full flex p-2 bg-black">
            <Statistics selectedMonthNumber={selectedMonthNumber} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
