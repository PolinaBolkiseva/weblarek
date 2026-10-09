export type ApiPostMethods = "POST" | "PUT" | "DELETE";
export type TPayment = "card" | "cash" | "";
export type TProductId = string;
export type TProductList = IProduct[];
export type TProductBasket = {
  [id_product: string]: {
    title: string;
    price: number | null;
    count: number;
  };
};

export type TErrors = {
  [object: string]: string; //объект: описание ошибки
};

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: TProductId;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IProductListResponse {
  count: number;
  items: TProductList;
}

export interface IOrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: TProductId[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}
