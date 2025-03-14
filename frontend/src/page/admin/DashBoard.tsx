import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { instance } from "../../service";
import CountUp from "react-countup";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type OrdersWeek = {
  date: string;
  totalRevenue: number;
  orderCount: number;
};
const DashBoard = () => {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [orderWeek, setOrderWeek] = useState<OrdersWeek[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resToday: AxiosResponse = await instance.get("/orders/today");
        setTotalAmount(resToday.data.data.totalAmount);
        setTotalOrders(resToday.data.data.totalOrders);

        const resWeek: AxiosResponse = await instance.get("/orders/week");
        setOrderWeek(resWeek.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number | string) => {
    return value.toLocaleString("vi", { style: "currency", currency: "VND" });
  };

  return (
    <>
      <section className="bg-white mb-10">
        <h1 className="p-3 md:text-xl text-lg font-semibold">
          Kết quả kinh doanh trong ngày
        </h1>
        <div className="grid grid-cols-11 border-t">
          <div className="flex items-center justify-center md:gap-5 gap-3 py-3 col-span-5">
            <i className="ri-money-dollar-circle-fill md:text-3xl text-xl bg-green-500 text-white py-1 px-2 rounded-full"></i>
            <div>
              <h2 className="font-medium md:text-base text-sm">Doanh thu</h2>
              <p className="font-bold md:text-xl text-lg text-[#22c55e]">
                {<CountUp start={10000} end={totalAmount} duration={2} />} đ
              </p>
            </div>
          </div>
          <div className="h-full w-px bg-gray-300 mx-auto "></div>
          <div className="flex items-center justify-center md:gap-5 gap-3  grid-cols-5 col-span-5">
            <i className="ri-list-ordered md:text-3xl text-xl bg-yellow-500 text-white py-1 px-2 rounded-full"></i>
            <div>
              <h2 className="font-medium md:text-base text-sm">Đơn hàng mới</h2>
              <p className="font-bold md:text-xl text-lg text-[#eab308]">
                {<CountUp start={1000} end={totalOrders} duration={2} />}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white md:p-10 p-1 mb-10 flex flex-col justify-center">
        <h2 className="text-center text-2xl font-bold mb-5">
          Biểu đồ doanh thu
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={orderWeek} margin={{ left: 40, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
              style={{ fontSize: "14px" }}
            />
            <Tooltip
              formatter={(value) => {
                if (Array.isArray(value)) {
                  return formatCurrency(value[0]);
                }
                return formatCurrency(value);
              }}
            />{" "}
            <Legend />
            <Bar
              dataKey="totalRevenue"
              fill="#8884d8"
              barSize={30}
              name="Doanh thu"
            />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="bg-white md:p-10 p-1">
        <h2 className="text-center text-2xl font-bold mb-5">
          Biểu đồ đơn hàng
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={orderWeek}>
            <CartesianGrid strokeDasharray="10 10" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar
              dataKey="orderCount"
              fill="#82ca9d"
              barSize={30}
              name="Số lượng đơn hàng"
            />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </>
  );
};

export default DashBoard;
