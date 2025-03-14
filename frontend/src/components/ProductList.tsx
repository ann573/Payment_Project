import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { IProduct } from "../interface/IProduct";

interface ProductListProps {
  products: IProduct[];
  quantities: { [key: string]: number };
  handleDelete: (productId: string) => void;
  handleDecrement: (productId: string, variantId: string) => void;
  handleIncrease: (productId: string, variantId: string) => void;
  setQuantities: React.Dispatch<
    React.SetStateAction<{ [key: string]: number }>
  >;
  setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  setIsOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  quantities,
  handleDelete,
  handleDecrement,
  handleIncrease,
  setQuantities,
  setProducts,
  setTotal,
  setIsOpenMobile,
}) => {
  const handleVariantChange = (product: IProduct, newIndex: number) => {
    const newVariantId = product.variants[newIndex]._id;
    const newIdVariant = `${product._id}_${newVariantId}`;
    const oldIdVariant = product.idVariant;

    if (newIdVariant === oldIdVariant) return; // Nếu không thay đổi variant thì không làm gì cả

    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((p) =>
        p.idVariant === oldIdVariant ? { ...p, idVariant: newIdVariant } : p
      );

      // Kiểm tra xem có sản phẩm nào đã có `idVariant` mới chưa
      const existingProductIndex = updatedProducts.findIndex(
        (p) => p.idVariant === newIdVariant
      );

      if (existingProductIndex !== -1) {
        // Nếu đã tồn tại sản phẩm trùng, chỉ gộp số lượng và xóa dòng trùng
        setQuantities((prev) => {
          const updatedQuantities = { ...prev };

          // Chỉ cộng dồn nếu `newIdVariant` đã tồn tại từ trước
          if (newIdVariant in updatedQuantities) {
            updatedQuantities[newIdVariant] += prev[oldIdVariant] || 1;
          } else {
            // Nếu chưa tồn tại, giữ nguyên số lượng cũ thay vì tăng thêm
            updatedQuantities[newIdVariant] = prev[oldIdVariant] || 1;
          }

          delete updatedQuantities[oldIdVariant]; // Xóa key cũ
          return updatedQuantities;
        });

        // Xóa dòng trùng, giữ nguyên vị trí dòng đầu tiên
        return updatedProducts.filter((p, index) => {
          return index === existingProductIndex || p.idVariant !== newIdVariant;
        });
      }

      return updatedProducts;
    });
  };

  useEffect(() => {
    const total = products.reduce((sum, product) => {
      const quantity = quantities[product.idVariant] || 1;
      const price =
        product.variants.find(
          (v) => `${product._id}_${v._id}` === product.idVariant
        )?.price || 0;
      return sum + quantity * price;
    }, 0);
    setTotal(total);
  }, [products, quantities, setTotal]);
  return (
    <>
      <div className="md:h-[85%] h-[90%] border-b-[6px] ">
        {!products.length ? (
          <div className="flex flex-col items-center justify-center h-full text-textColor select-none">
            <img
              src="https://dunlopilloshop.com/template/img/emptycart.png"
              alt="empty"
              className="lg:w-1/12 md:w-1/5 w-3/12"
            />
            <p className="my-3 md:text-base text-sm">
              Đơn hàng của bạn chưa có sản phẩm nào
            </p>
            <p className="border px-2 py-1 rounded-md">Thêm sản phẩm ngay</p>
          </div>
        ) : (
          <div>
            {products.map((product, index) => {
              const selectedVariantIndex = product.variants.findIndex(
                (variant) =>
                  `${product._id}_${variant._id}` === product.idVariant
              );
              const selectedVariant =
                product.variants[selectedVariantIndex] || product.variants[0];

              return (
                <div
                  key={product.idVariant}
                  className="even:bg-blue-100 grid grid-cols-12 p-3 items-center border rounded-lg shadow-sm lg:gap-3 gap-1"
                >
                  <div className="flex justify-between items-center">
                    <p className="sm:text-base text-xs">{index + 1}</p>
                    <i
                      className="ri-delete-bin-6-line sm:text-xl text-sm cursor-pointer"
                      onClick={() => handleDelete(product.idVariant)}
                    ></i>
                  </div>
                  <div>
                    <p className="font-semibold xl:text-2xl lg:text-xl sm:text-sm text-center">
                      {product.sort_title}
                    </p>
                  </div>

                  <div className="col-span-3">
                    <p className="xl:text-xl font-semibold lg:text-lg sm:text-base text-sm">{product.name}</p>
                    <p className="text-sm italic">Mặc định</p>
                  </div>

                  <div className="flex items-center lg:col-span-1 col-span-2">
                    <button
                      className="bg-gray-300 hover:bg-gray-400 sm:text-xl text-xs font-semibold w-[20px] sm:h-[25px] h-4 flex items-center justify-center rounded-l-md"
                      onClick={() =>
                        handleDecrement(product._id, selectedVariant._id)
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantities[product.idVariant] || 1}
                      onChange={(e) => {
                        const value = Math.max(1, Number(e.target.value));
                        setQuantities((prev) => ({
                          ...prev,
                          [product.idVariant]: value,
                        }));
                      }}
                      className="xl:w-9 w-5 sm:h-[25px] h-4 xl:text-base text-xs text-center border border-gray-300"
                      min="1"
                    />
                    <button
                      className="bg-gray-300 hover:bg-gray-400 w-5 sm:h-[25px] h-4 flex items-center justify-center sm:text-xl font-semibold px-2 rounded-r-md  text-xs"
                      onClick={() =>
                        handleIncrease(product._id, selectedVariant._id)
                      }
                    >
                      +
                    </button>
                  </div>

                  <div className="xl:col-start-7 col-start-8 lg:col-span-3 col-span-2 flex justify-center gap-3 items-center">
                    <label htmlFor="" className="lg:inline hidden"> {"Phân loại"}: </label>
                    <select
                      value={selectedVariantIndex}
                      onChange={(e) =>
                        handleVariantChange(product, Number(e.target.value))
                      }
                      className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:border-blue-500 block lg:w-[33%] w-2/3 p-1 cursor-pointer"
                    >
                      {product.variants.map((item, idx) => (
                        <option key={idx} value={idx}>
                          {item.size}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="xl:col-start-10 col-start-10 flex justify-center lg:text-base text-xs">
                    <p>
                      {selectedVariant.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </div>

                  <div className="flex justify-end items-center lg:text-lg font-semibold lg:col-span-2  col-start-12 text-sm">
                    <p>
                      {(
                        selectedVariant.price *
                        (quantities[product.idVariant] || 1)
                      ).toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className=" lg:grid-cols-4 grid-cols-2 xl:text-xl lg:text-lg text-sm h-[15%] px-3 xl:py-5 py-3 xl:gap-10 gap-5 md:grid hidden">
        <Link
          className="bg-[#e3eefc] rounded-xl font-medium flex items-center justify-center text-center py-2 md:py-0"
          to="/admin"
        >
          Trang quản trị
        </Link>
        <Link
          className="bg-[#e3eefc] rounded-xl font-medium flex items-center justify-center text-center"
          to="/admin/product"
        >
          Quản lý sản phẩm
        </Link>
        <Link
          className="bg-[#e3eefc] rounded-xl font-medium flex items-center justify-center text-center"
          to="/admin/orders"
        >
          Quản lý đơn hàng
        </Link>
        <Link
          className="bg-[#e3eefc] rounded-xl font-medium flex items-center justify-center text-center"
          to="/admin/customer"
        >
          Quản lý khách hàng
        </Link>
      </div>

      <div className="md:hidden py-5 px-10 h-[10%] flex items-center">
        <button
          className="bg-gradient-to-r from-cyan-500 to-blue-500 w-full text-white py-2 rounded-lg font-semibold"
          onClick={() => {
            setIsOpenMobile(prev =>  !prev);
          }}
        >
          Chi tiết thanh toán{" "}
        </button>
      </div>
    </>
  );
};

export default ProductList;
