import React from "react";
import { IProduct } from "../interface/IProduct";
import { ICustomer } from "./../interface/ICustom";
import { ToastContainer } from "react-toastify";

interface Props {
  products: IProduct[];
  quantities: { [key: string]: number };
  customer: ICustomer | null | undefined;
  endInvoice: endInvoice;
}

type endInvoice = {
  quantities: number;
  total: number;
  discount: number;
  toPay: string;
  givenMoney: string;
  other: string;
};

const Invoice: React.FC<Props> = ({
  products,
  quantities,
  customer,
  endInvoice,
}) => {
  const date = new Date();
  const formattedDate = date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalQuantities = Object.entries(quantities).reduce(
    (sum, [, value]) => sum + value,
    0
  );

  return (
    <>
      <div className="px-2">
        <h2 className="text-center text-xl font-semibold mt-3 mb-5">
          Hóa đơn thanh toán
        </h2>

        <p className="mb-3">
          Khách hàng:{" "}
          <span className="font-bold italic">
            {customer?.name || "Khách hàng"}
          </span>
        </p>
        <p className="mb-3">
          Số điện thoại:{" "}
          <span className="font-bold italic">{customer?.telephone || ""}</span>
        </p>
        <p className="mb-3">Ngày bán: {formattedDate}</p>
        <hr />
        <div className="grid grid-cols-4 gap-2 my-2">
          {/* Tiêu đề */}
          <div className="text-center font-bold text-xs">Sản phẩm</div>
          <div className="text-center font-semibold text-xs">ĐG</div>
          <div className="text-center font-semibold text-xs">SL</div>
          <div className="text-center font-semibold text-xs">TT</div>
        </div>
        {/* Danh sách sản phẩm */}
        {products.map((item, index) => {
          const selectedVariantIndex = item.variants.findIndex(
            (variant) => `${item._id}_${variant._id}` === item.idVariant
          );
          const selectedVariant =
            item.variants[selectedVariantIndex] || item.variants[0];
          return (
            <div key={index} className="grid grid-cols-4 gap-2 text-xs">
              <div className="col-span-4">
                {item.name} - {selectedVariant.size}
              </div>
              <div className="text-center col-start-2">
                {selectedVariant.price.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </div>

              <div className="text-center">{quantities[item.idVariant]}</div>
              <div className="text-center">
                {(
                  selectedVariant.price * quantities[item.idVariant]
                ).toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}
              </div>
            </div>
          );
        })}
        <hr className="my-3" />
        <div className="flex justify-between text-xs my-1">
          <p>Tổng số lượng: </p>
          <p>{totalQuantities}</p>
        </div>
        <div className="flex justify-between text-xs my-1">
          <p>Tổng tiền hàng: </p>
          <p>{endInvoice.toPay}</p>
        </div>
        <div className="flex justify-between text-xs my-1">
          <p>Chiết khấu: </p>
          <p>{endInvoice.discount} %</p>
        </div>
        <div className="flex justify-between text-sm font-semibold my-1">
          <p>Khách phải trả: </p>
          <p>
            {endInvoice.total.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            })}
          </p>
        </div>
        <div className="flex justify-between text-xs my-1">
          <p>Tiền khách đưa: </p>
          <p className="flex gap-[3px]">
            {endInvoice.givenMoney || endInvoice.total}₫
          </p>
        </div>
        <div className="flex justify-between text-xs my-1">
          <p>Tiền thừa: </p>
          <p className="flex gap-[3px]">{endInvoice.other}₫</p>
        </div>
        <hr className="my-5" />
        <p className="text-center text-sm italic">
          Cám ơn quý khách đã tin tưởng mua hàng
        </p>
      </div>

      <ToastContainer />
    </>
  );
};

export default Invoice;
