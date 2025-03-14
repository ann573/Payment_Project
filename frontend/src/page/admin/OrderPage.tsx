import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { fetchOrders } from "../../features/orders/orderAction";
import ButtonPage from "./../../components/ButtonPage";
import { instance } from "../../service";
import { AxiosResponse } from "axios";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const OrderPage = () => {
  const { orders, loading } = useAppSelector((state) => state.orders);
  const dispatch = useAppDispatch();

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const limit = 10;

  useEffect(() => {
    (async () => {
      dispatch(fetchOrders({ page, limit }));

      const res: AxiosResponse = await instance.get("/orders/total");

      setTotal(() => {
        return Math.ceil(res.data.data / limit) || 1;
      });
    })();
  }, [page, limit, dispatch]);

  useEffect(() => {
    if (orders.length === 0 && page > 1) {
      setPage(1);
    }
  }, [orders, page]);

  if (loading) {
    return (
      <>
        <section className="bg-white p-5">
          <div className="w-full">
            <Skeleton className="h-10 mb-5 w-1/3" />
          </div>
          <div>
            <Skeleton className="h-8 mb-5" />
            <Skeleton className="h-8 mb-5" />
            <Skeleton className="h-8 mb-5" />
            <Skeleton className="h-8 mb-5" />
            <Skeleton className="h-8 mb-5" />
            <Skeleton className="h-8 mb-5" />
            <Skeleton className="h-8 mb-5" />
            <Skeleton className="h-8 mb-5" />
            <Skeleton className="h-8 mb-5" />
          </div>
        </section>
      </>
    );
  }
  return (
    <section className="bg-white ">
      <h1 className="text-xl pt-3 pb-1 mb-2 px-5 font-bold border-b">
        Tất cả đơn hàng của bạn{" "}
      </h1>

      <div className="py-5 px-10">
        <table className="w-full ">
          <thead>
            <tr className="border-b text-lg">
              <th className="text-left pb-2 px-5">ID đơn hàng</th>
              <th className="text-left pb-2 px-5">Tổng tiền</th>
              <th className="text-left pb-2 px-5">Khách hàng</th>
              <th className="text-left pb-2 px-5">Nhân viên thanh toán</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  Không có đơn hàng nào
                </td>
              </tr>
            ) : (
              orders.map((item) => (
                <tr className="even:bg-slate-50" key={item._id}>
                  <td className="text-blue-400 px-4 py-3">
                    <Link
                      className="hover:border-blue-400 hover:border-b cursor-pointer"
                      to={`/admin/orders/${item._id}`}
                    >
                      {item._id}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    {item.total.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td className="px-4 py-2">
                    {item.customer?.name || "Khách hàng"}
                  </td>
                  <td className="px-4 py-2">{item.employee?.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {orders.length === 10 || page !== 1 ? (
        <div className="py-5 px-10">
          <ButtonPage setPage={setPage} page={page} total={total} />
        </div>
      ) : (
        <></>
      )}
    </section>
  );
};

export default OrderPage;
