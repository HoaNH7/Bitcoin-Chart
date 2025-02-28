import axios from "axios";
import { UTCTimestamp } from "lightweight-charts";

const BINANCE_API_URL = "https://api.binance.com/api/v3/klines";

export const fetchBitcoinData = async (interval: string = "1m", limit: number = 50) => {
  try {
    const response = await axios.get(BINANCE_API_URL, {
      params: {
        symbol: "BTCUSDT",
        interval,
        limit,
      },
    });

    type KlineData = [number, string, string, string, string, string];

    return response.data.map((data: KlineData) => ({
      time: (data[0] / 1000) as UTCTimestamp,
      open: parseFloat(data[1]),
      high: parseFloat(data[2]),
      low: parseFloat(data[3]),
      close: parseFloat(data[4]),
      volume: parseFloat(data[5]),
    }));
    
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu Bitcoin:", error);
    return [];
  }
};
