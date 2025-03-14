import { instance } from "@/service";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AppDispatch, RootState } from "../../../store/store";
import {
  fetchProducts,
  removeOneProduct,
} from "../../features/products/productsAction";
import useDebounce from "../../hooks/useDebounce";
import ButtonPage from "./../../components/ButtonPage";

import TableSkeleton from "./../../components/skeleton/TableSkeleton";
import Cookies from "js-cookie";

const ProductPage = () => {
  const { products, error, loading } = useSelector(
    (state: RootState) => state.products
  );
  const role = Cookies.get("role");

  const [page, setPage] = useState<number>(1);
  const limit = 5;
  const [total, setTotal] = useState<number>(0);
  const [topProduct, setTopProduct] = useState<
    {
      _id: string;
      totalSold: number;
    }[]
  >([
    {
      _id: "Sản phẩm",
      totalSold: 100,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có muốn xóa sản phẩm không")) {
      dispatch(removeOneProduct(id));
      if (!error) {
        toast.success("Xóa sản phẩm thành công");
      } else {
        console.log(error);
        toast.error("Có lỗi vui lòng thử lại sau");
      }
    }
  };

  useEffect(() => {
    dispatch(fetchProducts({ page, limit, searchQuery: debouncedSearchQuery }));
  }, [dispatch, page, limit, debouncedSearchQuery]);

  useEffect(() => {
    (async () => {
      const res: AxiosResponse = await instance.get("/products/total");
      setTotal(() => {
        return Math.ceil(res.data.data / limit) || 1;
      });

      const resTop: AxiosResponse = await instance.get("/orders/top");
      setTopProduct([...resTop.data.data]);
    })();
  }, []);

  useEffect(() => {
    if (products.length === 0 && page > 1) {
      setPage(1);
    }
  }, [products, page]);

  return (
    <>
      <section className="bg-white p-5">
        <div className="relative">
          <input
            type="text"
            className="w-full border px-10 py-2 rounded-xl focus:outline-none"
            placeholder="Tìm kiếm sản phẩm...."
            onChange={handleSearchChange}
          />
          <i className="ri-search-line absolute left-2 top-1/4"></i>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : (
          <>
            {role === "boss" && (
              <button className="mt-3 bg-green-500 text-white py-2 px-3 rounded-md font-semibold">
                <Link to={"/admin/product/add_and_update"}>Thêm sản phẩm</Link>
              </button>
            )}

            <div className="my-5">
              <table className="w-full border-collapse border border-slate-500 min-h-[516px]">
                <thead>
                  <tr>
                    <th className="border border-slate-600">STT</th>
                    <th className="border border-slate-600">Tên sản phẩm</th>
                    <th className="border border-slate-600">Mã sản phẩm</th>
                    <th className="border border-slate-600">Phân loại</th>
                    <th className="border border-slate-600">Tồn kho</th>
                    <th className="border border-slate-600">Giá</th>
                    {role === "boss" && (
                      <th className="border border-slate-600">Hoạt động</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, index) =>
                    item.variants.map((variant, variantIndex) => (
                      <tr key={variant._id}>
                        {/* Chỉ hiển thị STT, tên sản phẩm và mã sản phẩm cho biến thể đầu tiên */}
                        {variantIndex === 0 && (
                          <>
                            <td
                              className="border border-slate-600 p-2 text-center "
                              rowSpan={item.variants.length}
                            >
                              {(page - 1) * limit + (index + 1)}
                            </td>
                            <td
                              className="border border-slate-600 p-2 text-center"
                              rowSpan={item.variants.length}
                            >
                              {item.name}
                            </td>
                            <td
                              className="border border-slate-600 p-2 text-center"
                              rowSpan={item.variants.length}
                            >
                              {item.sort_title}
                            </td>
                          </>
                        )}

                        {/* Biến thể của sản phẩm */}
                        <td className="border border-slate-600 p-2 text-center">
                          {variant.attribute?.name}
                        </td>
                        <td className="border border-slate-600 p-2 text-center">
                          {variant.stock}
                        </td>
                        {/* Giá của biến thể */}
                        <td className="border border-slate-600 p-2 text-center">
                          {variant.price?.toLocaleString("vi", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </td>

                        {/* Hành động (Xóa, Cập nhật) */}
                        {variantIndex === 0 && role === "boss" && (
                          <td
                            className="border border-slate-600 p-2 text-center "
                            rowSpan={item.variants.length}
                          >
                            <button
                              className="bg-red-500 text-white p-1 rounded-md mr-1"
                              onClick={() => handleDelete(item._id)}
                            >
                              Xóa
                            </button>

                            <button
                              className="bg-yellow-200 p-1 rounded-md"
                              onClick={() => {}}
                            >
                              <Link
                                to={`/admin/product/add_and_update/${item._id}`}
                              >
                                Cập nhật
                              </Link>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <ButtonPage setPage={setPage} page={page} total={total} />
          </>
        )}

        <ToastContainer />
      </section>

      <section className="bg-white mt-5">
        <div className="p-6">
          <h2 className="md:text-2xl text-lg font-bold mb-4">
            Top Sản Phẩm Bán Chạy Trong Tuần
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {topProduct.map((product) => (
              <div
                key={product._id}
                className="bg-white shadow-lg rounded-2xl p-4 flex flex-col items-start justify-between transition-transform hover:scale-105"
              >
                <div className="text-lg font-semibold">{product._id}</div>
                <div className="text-sm text-gray-500">
                  Đã bán: <span className="font-bold">{product.totalSold}</span>{" "}
                  sản phẩm
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductPage;
