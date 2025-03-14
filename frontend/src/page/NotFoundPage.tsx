import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <>
      <section className="flex flex-col justify-center items-center pt-10 font-bold">
        <h1 className="text-9xl">404</h1>
        <p className="text-7xl my-5">NOT FOUND PAGE</p>
        <Link to={"/"} className="hover:underline">Quay lại trang chủ</Link>
      </section>
    </>
  );
};

export default NotFoundPage;
