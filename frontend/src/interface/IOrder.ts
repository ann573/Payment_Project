export interface IOrder {
  _id: string;
  total: number;
  score: number;
  telephone: string;
  createdAt: string;
  products: [
    {
      name: string;
      price: number;
      quantity: number;
      variant: string;
      _id: string;
      idVariant: string;
    }
  ];
  customer: {
    _id: string;
    name: string;
    telephone: string;
  };
  employee: {
    _id: string;
    name: string;
  };
}
