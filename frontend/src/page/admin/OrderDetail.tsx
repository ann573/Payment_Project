import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { fetchOrderById } from "../../features/orders/orderAction";
const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const orderId: string = id || "";
  const order = useAppSelector((state) => state.orders.order);

  console.log(order);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      dispatch(fetchOrderById(orderId));
    })();
  }, [orderId, dispatch]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
    });
  };
  return (
    <>
      <section className="bg-white p-5">
        <h1 className="text-xl font-semibold border-b pb-2">
          Chi tiết đơn hàng{" "}
          <span className="text-blue-500 font-bold">{order?._id}</span>
        </h1>
        <div className="my-5 flex justify-between">
          <div>
            <h3>
              Nhân viên thanh toán:{" "}
              <span className="text-lg font-semibold">
                {order?.employee.name || "Nhân viên"}
              </span>
            </h3>
            <h3 className="my-2 ">
              Ngày tạo:{" "}
              <span className="font-bold">
                {formatDate(order?.createdAt || "")}
              </span>
            </h3>
          </div>
          <div>
            <h3>
              Khách hàng:{" "}
              <span className="font-bold">
                {order?.customer?.name || "Khách hàng"}
              </span>
            </h3>
            <h3 className="my-2 ">
              Số điện thoại:{" "}
              <span className="font-bold">
                {order?.customer?.telephone || " "}
              </span>
            </h3>
          </div>
        </div>

        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-center text-black">STT</TableHead>
                <TableHead className="text-center text-black">Tên sản phẩm</TableHead>
                <TableHead className="text-center text-black">Số lượng</TableHead>
                <TableHead className="text-center text-black">Phân loại</TableHead>
                <TableHead className="text-center text-black">Đơn giá</TableHead>
                <TableHead className="text-center text-black">Tổng tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order?.products.map((item, index) => (
                <TableRow key={index} className="border-t">
                  <TableCell className="text-center py-2">{index}</TableCell>
                  <TableCell className="text-center py-2">
                    {item?.name}
                  </TableCell>
                  <TableCell className="text-center py-2">
                    {item?.quantity}
                  </TableCell>
                  <TableCell className="text-center py-2">
                    {item?.variant}
                  </TableCell>
                  <TableCell className="text-center py-2">
                    {item?.price.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </TableCell>
                  <TableCell className="text-center py-2">
                    {(item?.price * item.quantity).toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-xl">Tổng tiền: </TableCell>
                  <TableCell className="text-center text-xl">{order?.total.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</TableCell>
                </TableRow>
              </TableFooter>
          </Table>
        </div>
      </section>
    </>
  );
};

export default OrderDetail;
