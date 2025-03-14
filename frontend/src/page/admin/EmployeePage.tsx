import ModelAddEmployee from "@/components/ModelAddEmployee";
import { instance } from "@/service";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
type TRevenueEmployee = {
  name: string;
  totalRevenue: number;
};

type TResTotal = {
  totalAmount: number;
  totalOrders: number;
};

export type TEmployee = {
  _id: string;
  email: string;
  name: string;
};

const EmployeePage = () => {
  const [revenue, setRevenue] = useState<TRevenueEmployee[]>();
  const [total, setTotal] = useState<TResTotal>({
    totalAmount: 0,
    totalOrders: 0,
  });
  const [employees, setEmployee] = useState<TEmployee[]>([]);
  const role = Cookies.get("role");

  const [editingName, setEditingName] = useState<string>("");
  const [newName, setNewName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await instance.get("/users/order-employee");
      setRevenue([...res.data.data]);

      const resTotal = await instance.get("/orders/today");
      setTotal({ ...resTotal.data.data });

      const resEmployee = await instance.get("/users/employee");
      setEmployee([...resEmployee.data.data]);
    };
    fetchData();
  }, []);

  const formatCurrency = (value: number | string) => {
    return value.toLocaleString("vi", { style: "currency", currency: "VND" });
  };

  const handleEditClick = (employee: TEmployee) => {
    setEditingName(employee._id);
    setNewName(employee.name);
  };

  const handleSaveClick = async (employeeId: string) => {
    try {
      const res = await instance.patch(`/users/${employeeId}`, {
        name: newName,
      });
      if (res.status === 200) {
        const index = employees.findIndex((item) => item._id === employeeId);
        setEmployee((prev) => {
          prev[index].name = newName;
          return prev;
        });
      }
      setEditingName(""); // Ngừng chế độ chỉnh sửa
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await instance.delete(`/users/${id}`);
    if (res.status === 200) {
      setEmployee((prev) => {
        return prev.filter((item) => item._id !== res.data.data._id);
      });
      setRevenue((prev) => {
        return prev && prev.filter((item) => item.name !== res.data.data.name);
      });
      toast.success("Xóa thành công");
    }
  };
  return (
    <>
      {role !== "boss" ? (
        <div className="text-center text-3xl font-bold h-full">
          Chỉ chủ cửa hàng mới xem được trang này
        </div>
      ) : (
        <>
          <section className="bg-white py-5 flex w-full flex-grow flex-wrap items-center justify-center mb-5 gap-10 lg:px-0 sm:px-5 px-3">
            <div
              className={`w-full ${
                revenue && revenue?.length > 2 ? "lg:w-full" : "lg:w-[70%]"
              }`}
            >
              <ResponsiveContainer width={"100%"} height={400}>
                <BarChart
                  width={500}
                  height={300}
                  data={revenue}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 30,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) => formatCurrency(value)}
                    style={{ fontSize: "14px" }}
                  />
                  <Tooltip
                    formatter={(value) => {
                      if (Array.isArray(value)) {
                        return formatCurrency(value[0]);
                      }
                      return [formatCurrency(value), "Doanh thu"];
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="totalRevenue"
                    fill="#0089ff"
                    activeBar={<Rectangle fill="green" stroke="blue" />}
                    name={"Doanh thu"}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col items-center justify-center lg:w-1/2 w-full px-10 sticky bg-white border py-1 rounded-lg">
              <div className="mb-3">
                <h2 className="text-2xl font-semibold text-center">
                  Doanh thu hôm nay
                </h2>
                <h3 className="text-center font-bold text-green-500 text-lg">
                  {total.totalAmount && formatCurrency(total.totalAmount)}{" "}
                  <i className="ri-funds-fill"></i>
                </h3>
                <h3 className="text-center italic">
                  Tổng cộng: {total.totalOrders} đơn hàng
                </h3>
              </div>
              <div className="w-full">
                {revenue &&
                  revenue.map((item, index) => (
                    <div
                      key={index}
                      className="text-left flex justify-between border-b pb-1 mb-5"
                    >
                      <p className="font-bold">{item.name}</p>
                      <p>{formatCurrency(item.totalRevenue)}</p>
                    </div>
                  ))}
              </div>
            </div>
          </section>

          <section className="bg-white sm:px-10 px-3 py-3">
            <div className="flex justify-between items-center flex-wrap mb-4 gap-y-4">
              <h2 className="text-xl font-bold border-b  pb-2">
                Danh sách nhân viên
              </h2>
              <ModelAddEmployee />
            </div>

            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 sm:p-4 p-2">
              {employees &&
                employees.map((employee) => (
                  <div
                    key={employee._id}
                    className="sm:p-4 p-2 flex items-center justify-between space-x-4 hover:shadow-lg transition-shadow rounded-xl border-2"
                  >
                    <div className="flex gap-3">
                      <img
                        src="https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-user-icon-png-image_1796659.jpg"
                        alt={employee.name}
                        className="xs:w-16 xs:h-16 h-8 rounded-full"
                      />
                      <div className="flex flex-col justify-center p-0">
                        {editingName === employee._id ? (
                          <div>
                            <input
                              type="text"
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              className="border p-1 rounded"
                            />
                            <button
                              onClick={() => handleSaveClick(employee._id)}
                              className="ml-2 text-blue-500"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={() => {
                                setEditingName("");
                                setNewName("");
                              }}
                              className="ml-2 text-red-500"
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <div>
                            <h2 className="text-lg font-bold">
                              {employee.name}
                            </h2>
                          </div>
                        )}
                        <p className="text-sm text-gray-500">Nhân viên</p>
                        <p className="text-sm font-semibold text-green-500">
                          {employee.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <button
                        onClick={() => handleEditClick(employee)}
                        className="text-blue-500"
                      >
                        <i className="ri-edit-line"></i>
                      </button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="text-red-500">
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Bạn có chắc muốn xóa nhân viên này không
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Nếu bạn nhấn đồng ý, nhân viên sẽ bị xóa mãi mãi
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(employee._id)}
                              className="bg-green-500 hover:bg-blue-500"
                            >
                              Đồng ý
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </>
      )}

      <ToastContainer autoClose={1000} />
    </>
  );
};
export default EmployeePage;
