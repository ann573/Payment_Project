import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAuthStore } from "./../store/useAuthStore";
import LayoutAdmin from "./components/LayoutAdmin";
import AddAndUpdateProduct from "./page/admin/AddAndUpdateProduct";
import ChatPage from "./page/admin/ChatPage";
import CustomerDetail from "./page/admin/CustomerDetail";
import CustomerPage from "./page/admin/CustomerPage";
import DashBoard from "./page/admin/DashBoard";
import EmployeePage from "./page/admin/EmployeePage";
import OrderDetail from "./page/admin/OrderDetail";
import OrderPage from "./page/admin/OrderPage";
import ProductPage from "./page/admin/ProductPage";
import VariantPage from "./page/admin/VariantPage";
import LoginPage from "./page/LoginPage";
import NotFoundPage from "./page/NotFoundPage";
import PaymentPage from "./page/PaymentPage";
import RegisterPage from "./page/RegisterPage";
import VerifyPage from "./page/VerifyPage";

const App = () => {
  const location = useLocation();

  const { login } = useAuthStore();
  useEffect(() => {
    switch (location.pathname) {
      case "/":
        document.title = "Trang chủ";
        break;
      case "/admin":
        document.title = "Quản trị";
        break;
      case "/admin/product":
        document.title = "Quản trị sản phẩm";
        break;
      case "/loign":
        document.title = "Đăng nhập";
        break;
      case "/register":
        document.title = "Đăng ký";
        break;
      case "/admin/orders":
        document.title = "Quản trị đơn hàng";
        break;
      case "/admin/customer":
        document.title = "Quản trị khách hàng";
        break;
      default:
        document.title = "Ứng dụng của tôi";
    }
  }, [location]);

  useEffect(() => {
    const savedUser = localStorage.getItem("authUser");
    if (savedUser) {
      login(JSON.parse(savedUser));
    }
  }, [login]);

  return (
    <>
      <Routes>
        <Route path="/" element={<PaymentPage />} />

        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<DashBoard />} />
          <Route path="product" element={<ProductPage />} />
          <Route path="customer" element={<CustomerPage />} />
          <Route path="customer/:id" element={<CustomerDetail />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="employee" element={<EmployeePage />} />
          <Route path="variants" element={<VariantPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route
            path="product/add_and_update"
            element={<AddAndUpdateProduct />}
          />
          <Route
            path="product/add_and_update/:id"
            element={<AddAndUpdateProduct />}
          />
        </Route>

        <Route path="/verify-email/:token" element={<VerifyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
