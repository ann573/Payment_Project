import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { AppDispatch, RootState } from "../../../store/store";

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

import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import ButtonPage from "../../components/ButtonPage";
import {
  fetchCustomerById,
  fetchCustomers,
  removeOneCustomer,
  updateNewCustomer,
} from "../../features/customers/customerAction";
import useDebounce from "../../hooks/useDebounce";
import { ICustomer } from "../../interface/ICustom";
import { instance } from "../../service";
import TableSkeleton from "./../../components/skeleton/TableSkeleton";
import { customerSchema } from "../../service/schema/customer";

const CustomerPage = () => {
  const { customer, customers, error, loading } = useSelector(
    (state: RootState) => state.customers
  );
  const dispatch = useDispatch<AppDispatch>();
  const nav = useNavigate();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ICustomer>({
    resolver: zodResolver(customerSchema),
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [sort, setSort] = useState<number>(0);
  const [idDelete, setIdDelete] = useState<string>("");

  const [icon, setIcon] = useState<JSX.Element>(
    <i className="ri-filter-line"></i>
  );

  const limit = 10;

  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const handleDelete = async (id: string) => {
    await dispatch(removeOneCustomer(id)).unwrap();
    if (!error) {
      toast.success("Xóa người dùng thành công");
    } else {
      toast.error("Có lỗi vui lòng thử lại sau");
    }
    await dispatch(
      fetchCustomers({ page, limit, searchQuery: debouncedSearchQuery, sort })
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const fetchTotalOrders = async () => {
      try {
        const res: AxiosResponse = await instance.get("/customers/total");
        setTotal(Math.ceil(res.data.data / limit) || 1);
      } catch (error) {
        console.error("Error fetching total orders:", error);
      }
    };
    fetchTotalOrders();
  }, [limit]);

  useEffect(() => {
    dispatch(
      fetchCustomers({ page, limit, searchQuery: debouncedSearchQuery, sort })
    );
  }, [dispatch, page, limit, debouncedSearchQuery, sort]);

  useEffect(() => {
    dispatch(fetchCustomerById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (customer) {
      reset(customer);
    }
  }, [customer, reset]);

  const submitForm = async (value: ICustomer) => {
    await dispatch(updateNewCustomer({ data: value, id }));
    if (error) {
      toast.error("Có lỗi xảy ra");
    } else {
      setIsOpen(false);
      dispatch(
        fetchCustomers({ page, limit, searchQuery: debouncedSearchQuery, sort })
      );
      setId("");
    }
  };

  const changeDesc = () => {
    setSort((prev) => prev + 1);

    const nextSort = (sort + 1) % 3;
    switch (nextSort) {
      case 0:
        setIcon(<i className="ri-filter-line"></i>);
        break;
      case 1:
        setIcon(<i className="ri-sort-asc"></i>);
        break;
      case 2:
        setIcon(<i className="ri-sort-desc"></i>);
        break;
      default:
        setIcon(<i className="ri-filter-line"></i>);
        break;
    }
  };

  const toCusTomerDetail = (id: string) => {
    event?.preventDefault();
    nav(`/admin/customer/${id}`);
  };

  if (loading) {
    return (
      <>
        <TableSkeleton />
      </>
    );
  }
  return (
    <>
      <AlertDialog>
        <div className="bg-white px-10 py-5">
          <div className="relative">
            <input
              type="text"
              className="w-full border px-10 py-2 rounded-xl focus:outline-none"
              placeholder="Tìm kiếm khách hàng theo số điện thoại...."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <i className="ri-search-line absolute left-2 top-1/4"></i>
          </div>

          <div className="my-5">
            <table className="w-full border-collapse border border-slate-500">
              <thead>
                <tr>
                  <th className="border border-slate-600">STT</th>
                  <th className="border border-slate-600">Tên</th>
                  <th className="border border-slate-600">Số điện thoại</th>
                  <th
                    className="border border-slate-600 py-1 select-none cursor-pointer"
                    onClick={changeDesc}
                  >
                    Điểm tích lũy <span>{icon}</span>
                  </th>
                  <th className="border border-slate-600">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center font-bold">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  customers.map((item, index) => {
                    return (
                      <tr
                        key={item._id}
                        className="hover:cursor-pointer hover:bg-slate-100"
                      >
                        <td className="border border-slate-600 text-center py-4">
                          {(page - 1) * limit + (index + 1)}
                        </td>
                        <td
                          className="border border-slate-600 text-center"
                          onClick={() => toCusTomerDetail(item._id)}
                        >
                          {item.name}
                        </td>
                        <td className="border border-slate-600 text-center">
                          {item.telephone}
                        </td>
                        <td className="border border-slate-600 text-center">
                          {item.score}
                        </td>
                        <td className="border border-slate-600 text-center">
                          <AlertDialogTrigger asChild>
                            <button
                              className="bg-red-500 mr-3 p-1 rounded-md"
                              onClick={(event) => {
                                event.stopPropagation();
                                setIdDelete(item._id);
                              }}
                            >
                              Xóa
                            </button>
                          </AlertDialogTrigger>

                          <button
                            className="bg-yellow-200 p-1 rounded-md"
                            onClick={(event) => {
                              event?.stopPropagation();
                              setIsOpen(true);
                              setId(item._id);
                            }}
                          >
                            Cập nhật
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {!searchQuery && <ButtonPage setPage={setPage} page={page} total={total} />}

          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center">
                  Cập nhật khách hàng mới{" "}
                  <button
                    className="text-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    x
                  </button>
                </h2>
                <form onSubmit={handleSubmit(submitForm)}>
                  <div className="mb-3 flex flex-col gap-1">
                    <label htmlFor="name">Nhập tên khách hàng: </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Tên khách hàng"
                      className="border py-1 px-2"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-red-500 italic">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-5 flex flex-col gap-1">
                    <label htmlFor="tel">Số điện thoại: </label>
                    <input
                      type="text"
                      id="tel"
                      placeholder="Nhập số điện thoại"
                      className="border py-1 px-2"
                      {...register("telephone")}
                    />
                    {errors.telephone && (
                      <p className="text-red-500 italic">
                        {errors.telephone.message}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Cập nhật
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc muốn xóa không?</AlertDialogTitle>
            <AlertDialogDescription>
              Khi bạn xóa khách hàng sẽ biến mất hoàn toàn!!!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="hover:bg-red-500 text-white"
              onClick={() => handleDelete(idDelete)}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ToastContainer />
    </>
  );
};

export default CustomerPage;
