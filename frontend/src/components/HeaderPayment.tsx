import { useRef, useState, useEffect } from "react";
import "../style/headerpayment.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IProduct } from "./../interface/IProduct";
import { searchProduct } from "./../service/product";
import useDebounce from "../hooks/useDebounce"; // Import hook useDebounce

import imageCart from "../assets/pictures/cart.png";
import { useAuthStore } from './../../store/useAuthStore';

const HeaderPayment = ({
  setIdProduct,
}: {
  setIdProduct: (id: string) => void;
}) => {
  const {logout} = useAuthStore()
  const nav = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [productSearch, setProductSearch] = useState<IProduct[]>([]);
  const nameUser = Cookies.get("user")?.split("@")[0];
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const debouncedSearchQuery = useDebounce(searchQuery, 800);

  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsSearch(true);
      const fetchProductData = async () => {
        const data = await searchProduct(debouncedSearchQuery);
        setProductSearch(data);
      };
      fetchProductData();
    } else {
      setIsSearch(false);
    }
  }, [debouncedSearchQuery]);

  const logoutAccount = (): void => {
    logout()
    nav("/login");

    Cookies.remove("user");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("role");
  };

  return (
    <header className="bg-primary_header h-14">
      <div className=" lg:max-w[1000px] xl:max-w-[1400px] 2xl:max-w-[1600px] xl:px-5 lg:px-10 sm:px-10 px-5 mx-auto h-full flex">
        <div className="lg:w-[30%] md:w-[35%] sm:w-2/3 w-[80%] flex items-center h-full relative mr-auto">
          <input
            type="text"
            ref={inputRef}
            className="w-full focus:outline-none rounded-md pl-8 py-2"
            placeholder="Thêm sản phẩm vào đơn"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
          <i className="ri-search-line absolute left-1 xl:text-xl"></i>
          {isSearch && (
            <div className="absolute top-full shadow-xl bg-white z-30 w-full max-h-[200px] overflow-y-auto">
              {productSearch.length !== 0 ? (
                productSearch.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex py-3 px-2 gap-3 items-center text-textColor cursor-pointer hover:bg-second"
                      onClick={() => {
                        const id = `${item._id}_${item.variants[0]._id}`;
                        setIdProduct(id);
                        setIsSearch(false);
                        if (inputRef.current) {
                          inputRef.current.value = "";
                        }
                      }}
                    >
                      <div className="w-[50px]">
                        <img src={imageCart} alt="anh" className="w-full" />
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <div className="mr-auto">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <p className="text-xs">{item.sort_title}</p>
                        </div>
                        <p className="italic">
                          Còn hàng:{" "}
                          <span className="font-medium">{item.stock}</span>
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center py-3">Không tìm thấy sản phẩm nào</p>
              )}
            </div>
          )}
        </div>

        {/* <section className="w-[40%] flex overflow-x-auto overflow-y-hidden custom-scrollbar mr-3">
          <div className="flex items-center mr-1">
            {pages.map((page) => (
              <div
                key={page}
                onClick={() => setNowPage(page)}
                className={`selected min-w-[110px] px-2 h-14 flex justify-center items-center select-none cursor-pointer whitespace-nowrap`}
                style={{ whiteSpace: "nowrap" }}
              >
                <p className="text-center font-semibold">Đơn hàng</p>

              </div>
            ))}
          </div>

        </section> */}

        <section className="xl:w-[30%] lg:w-1/3 text-white items-center gap-4 md:flex hidden">
          <div className="flex items-center gap-3 w-2/3 mr-auto">
            <i className="ri-user-line text-2xl"></i>
            <p className="cursor-default select-none ">{nameUser}</p>
          </div>
          <div title="Trang chủ" className="mr-4">
            <Link to="/admin">
              <i className="ri-home-4-line text-2xl cursor-pointer"></i>
            </Link>
          </div>
          <div
            className="cursor-pointer"
            title="Đăng xuất"
            onClick={logoutAccount}
          >
            <i className="ri-logout-box-r-line text-2xl"></i>
          </div>
        </section>

        <section className="flex items-center md:hidden relative">
          <i
            className="ri-menu-line text-white font-semibold text-xl"
            onClick={() => setIsOpen((prev) => !prev)}
          ></i>
          {isOpen && (
            <div className="bg-white absolute top-full -left-[200px] z-50 shadow-2xl w-[220px]">
              <p className="py-2 px-3 flex gap-3 items-center">
                <i className="ri-user-line border rounded-full px-1"></i>
                <span className="text-sm font-bold">{nameUser}</span>
              </p>
              <p className="border-b py-2 px-3">
                <Link to="/admin">Trang chủ</Link>
              </p>
              <div
                className="cursor-pointer border-b py-2 px-3"
                title="Đăng xuất"
                onClick={logoutAccount}
              >
                Đăng xuất
              </div>

              <i className="ri-triangle-fill absolute -top-[19px] left-full -translate-x-full text-white"></i>
            </div>
          )}
        </section>
      </div>
    </header>
  );
};

export default HeaderPayment;
