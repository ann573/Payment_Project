export interface IProduct {
    _id: string;
    name: string;
    price: number;
    sort_title: string;
    stock: number;
    variants: {
      _id: string;
      attribute: {
        _id: string;
        attributeId: string;
        name: string;  // name thuộc về đối tượng attribute trong mảng
      };  // Đây là một mảng các đối tượng attribute
      size: string;
      stock: number;
      price: number;
    }[];
    idVariant: string;
  }
  

export interface IProductBefore {
  name: string;
  price: number;
  sku: string;
  sort_title: string;
  quantity: number;
}
