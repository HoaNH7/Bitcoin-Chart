"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, IChartApi, UTCTimestamp } from "lightweight-charts";
import { fetchBitcoinData } from "../services/api";

type BitcoinDataPoint = {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type ChartProps = {
  interval: string;
};

const BitcoinChart: React.FC<ChartProps> = ({ interval }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [oneMinuteAgoPrice, setOneMinuteAgoPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400, 
      layout: { background: { color: "#0b0f19" }, textColor: "#fff" },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.1)" },
        horzLines: { color: "rgba(255, 255, 255, 0.1)" },
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderUpColor: "#26a69a",
      borderDownColor: "#ef5350",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    const volumeSeries = chart.addHistogramSeries({
      priceScaleId: "",
      color: "rgba(0, 150, 136, 0.8)",
      priceFormat: { type: "volume" },
      scaleMargins: {
        top: 0.7, 
        bottom: 0, 
      },
    });

    chartRef.current = chart;

    const resizeObserver = new ResizeObserver(() => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    });

    resizeObserver.observe(chartContainerRef.current);

    fetchBitcoinData(interval)
      .then((data: BitcoinDataPoint[]) => {
        if (data.length > 0) {
          const formattedData = data.map((d) => ({
            time: (d.time / 1000) as UTCTimestamp,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
          }));
          candleSeries.setData(formattedData);

          const volumeData = data.map((d) => ({
            time: (d.time / 1000) as UTCTimestamp,
            value: d.volume,
          }));
          volumeSeries.setData(volumeData);

          setCurrentPrice(formattedData[formattedData.length - 1].close);
          if (formattedData.length > 1) {
            setOneMinuteAgoPrice(formattedData[formattedData.length - 2].close);
          }
        }
      })
      .catch(() => {
        setError("Lỗi khi tải dữ liệu");
      });

    return () => {
      chart.remove();
      resizeObserver.disconnect();
    };
  }, [interval]);

  const handleFetchPrice = () => {
    fetchBitcoinData("1m", 2)
      .then((data: BitcoinDataPoint[]) => {
        if (data.length > 0) {
          setCurrentPrice(data[data.length - 1].close);
          if (data.length > 1) {
            setOneMinuteAgoPrice(data[data.length - 2].close);
          }
        }
      })
      .catch(() => {
        setError("Lỗi khi lấy giá Bitcoin");
      });
  };

  return (
    <div className="w-full h-[85vh] flex items-center justify-center bg-gray-900 text-white p-4 sm:p-6">
      <div className="w-full max-w-5xl bg-gray-800 p-6 rounded-lg shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Bitcoin BTC</h2>
          <button
            onClick={handleFetchPrice}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 sm:mt-0"
          >
            Cập nhật giá
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h3 className="text-3xl sm:text-4xl font-bold">
            ${currentPrice?.toLocaleString() ?? "Đang tải..."}
          </h3>
          {currentPrice && oneMinuteAgoPrice && (
            <p
              className={`text-lg sm:text-xl ${
                currentPrice >= oneMinuteAgoPrice ? "text-green-500" : "text-red-500"
              }`}
            >
              {currentPrice >= oneMinuteAgoPrice ? "▲" : "▼"}{" "}
              {((currentPrice - oneMinuteAgoPrice) / oneMinuteAgoPrice * 100).toFixed(2)}%
            </p>
          )}
        </div>

        <div ref={chartContainerRef} className="w-full h-[400px] mt-4" />

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default BitcoinChart;
