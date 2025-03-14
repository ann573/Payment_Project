import { AxiosResponse } from "axios";
import { instance } from ".";
import { IProduct, IProductBefore } from './../interface/IProduct';
import { IResponse } from './../interface/IResponse';

export const searchProduct = async (query: string) => {
    query = query.toUpperCase()
    const res : AxiosResponse<IResponse> = await instance.get(`/products/search?sort_title=${query}`)
    return res.data.data
}

export const getProductById = async (id: string | number): Promise<IProduct> => {
    const res : AxiosResponse<IResponse> = await instance.get(`/products/${id}`)
    return res.data.data
}

export const getAllProducts = async (): Promise<IProduct[]> => {
    const res : AxiosResponse<IResponse> = await instance.get(`/products`)
    return res.data.data
}


export const createProducts = async (product: IProductBefore): Promise<IProduct> => {
    const { data }: { data: IProduct }  = await instance.post(`/products`,product)
    return data
}

export const updateProducts = async (dataBody: IProductBefore, id:string) =>{
    const {data}: { data: IProduct } = await instance.patch(`/products/${id}`, dataBody) 
    return data
}   

export const removeProduct = async (id:string) =>{
    const res: AxiosResponse<IProduct> = await instance.delete(`/products/${id}`) 
    return res
}