export type ApiPostMethods = "POST" | "PUT" | "DELETE";
export type TPayment = "card" | "cash";
export type TProductId = string;
export type TProductList = IProduct[];

export type TErrors = {
  [field: string]: string; //поле: описание ошибки
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
  payment: TPayment|null;
  email: string;
  phone: string;
  address: string;
}

export interface IProductListResponse {
  total: number;
  items: TProductList;
}

export interface IOrderRequest extends IBuyer{
    total: number; 
    items: TProductId[]; 
}  

export interface IOrderResponse {
  id: string;
  total: number;
}
