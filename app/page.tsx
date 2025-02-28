"use client";

import React, { useState } from "react";
import BitcoinChart from "./components/BitcoinChart";
import { lightTheme, darkTheme } from "./utils/theme";
import { Sun, Moon } from "lucide-react";

const Home: React.FC = () => {
  const [interval, setInterval] = useState("1m");
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      <h1 className="text-2xl font-bold mb-4">Biểu Đồ Bitcoin</h1>
  
      <div className="flex items-center justify-center gap-4 mb-6" >
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
  
        <select
          className="bg-white text-black dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md p-2"
          onChange={(e) => setInterval(e.target.value)}
          value={interval}
        >
          <option value="1m">1 phút</option>
          <option value="5m">5 phút</option>
          <option value="1h">1 giờ</option>
          <option value="1d">1 ngày</option>
        </select>
      </div>
  
      <div className="w-full max-w-5xl">
        <BitcoinChart interval={interval} />
      </div>
    </div>
  );
  
};

export default Home;
