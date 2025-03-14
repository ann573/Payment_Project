import { AxiosResponse } from "axios";
import { instance } from ".";

export const fetchOrder = async (path: string) => {
  try {
    const res: AxiosResponse = await instance.get(path);

    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getOrderById = async (id: string) => {
  try {
    const res:AxiosResponse = await instance.get(`/orders/${id}`)
    return res.data
  } catch (error) {
    console.log(error);
  }
}
