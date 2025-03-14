import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchCustomerById } from "../../features/customers/customerAction";

const CustomerDetail = () => {
  const { id } = useParams<string>();
  const { customer } = useSelector((state: RootState) => state.customers);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (id) dispatch(fetchCustomerById(id));
  }, [id, dispatch]);
  console.log(customer);
  return (
    <section className="bg-white p-5">
      <h1 className="text-2xl font-bold border-b pb-2 mb-5">
        Chi tiết khách hàng
      </h1>
      <h3>
        Tên khách hàng: <span className="font-bold">{customer?.name}</span>{" "}
      </h3>
      <h3 className="my-2">
        Số điện thoại: <span className="font-bold">{customer?.telephone}</span>{" "}
      </h3>
      <div className="mb-8">
        <h3>
          Số điểm đã tích lũy được:{" "}
          <span className="font-bold">{customer?.score} điểm</span>
        </h3>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th>ID đơn hàng</th>
            <th>Tổng giá trị</th>
          </tr>
        </thead>
        <tbody>
          {(customer?.orders?.length ?? 0) === 0 ? (
            <tr>
              <td colSpan={2} className="text-center pt-5 font-bold text-2xl underline">Chưa có đơn hàng nào</td>
            </tr>
          ) : (
            customer?.orders?.map((order, index) => (
              <tr
                key={index}
                className="cursor-pointer hover:bg-slate-100 border-t"
              >
                <td className="text-center py-3  ">
                  <Link className="hover:text-blue-500 hover:border-b hover:border-b-blue-500" to={`/admin/orders/${order._id}`}>{order._id}</Link>
                </td>
                <td className="text-center py-3">
                  {order.total.toLocaleString("vi", {
                    style: "currency",
                    currency: "VND",
                  })}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
};

export default CustomerDetail;
