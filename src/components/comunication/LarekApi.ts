import type {
  IApi,
  IProductListResponse,
  IOrderRequest,
  IOrderResponse,
} from "../../types";

export class LarekApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProductList(): Promise<IProductListResponse> {
    return this.api.get<IProductListResponse>("/product");
  }

  createOrder(data: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>("/order", data);
  }
}
