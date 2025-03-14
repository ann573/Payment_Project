import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { customerSchema } from "../service/schema/customer";
import { createCustomer, searchCustomer } from "./../service/customer";
import { toast, ToastContainer } from "react-toastify";
import { ICustomer } from "../interface/ICustom";

interface PopupCustomerProps {
  setIsOpen: (value: boolean) => void;
  setCustomerSelect: (customer: ICustomer) => void;
}

type FormValues = {
  name: string;
  telephone: string;
};

const PopupCustomer: React.FC<PopupCustomerProps> = ({
  setIsOpen,
  setCustomerSelect,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(customerSchema),
  });

  const submitForm = async (value: FormValues) => {
    const formattedTel = value.telephone.padStart(10, "0");
    const searchResult = await searchCustomer(formattedTel);
    if (searchResult.length !== 0) {
      toast.error("Số điện thoại đã có ", {
        autoClose: 2000,
        pauseOnHover: false,
      });
    } else {
      const data = await createCustomer({ ...value, telephone: formattedTel });
      setCustomerSelect(data);
      setIsOpen(false);
    }
  };
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center">
            Thêm khách hàng mới{" "}
            <button className=" text-gray-700" onClick={() => setIsOpen(false)}>
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
                <p className="text-red-500 italic">{errors.name.message}</p>
              )}
            </div>
            <div className="mb-5 flex flex-col gap-1">
              <label htmlFor="name">Số điện thoại: </label>
              <input
                type="text"
                id="name"
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
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Thêm khách hàng
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default PopupCustomer;
