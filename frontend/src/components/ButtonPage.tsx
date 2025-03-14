
interface ButtonProps {
  setPage: (value: number | ((prevPage: number) => number)) => void;
  page: number;
  total: number
}
const ButtonPage: React.FC<ButtonProps> = ({ setPage, page,total }) => {
  const handleNextPage = () => setPage((prevPage) => Math.min(prevPage + 1, total));
  const handlePrevPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1));
  
  
  return (
    <>
      <div className="flex justify-between items-center mt-5">
        <button
          onClick={handlePrevPage}
          className="bg-gray-300 p-2 rounded-md"
          disabled={page === 1}
        >
          Trang trước
        </button>
        <div className="font-bold text-xl">Trang {page}/{total}</div>
        <button onClick={handleNextPage} className="bg-gray-300 p-2 rounded-md">
          Trang sau
        </button>
      </div>
    </>
  );
};

export default ButtonPage;
