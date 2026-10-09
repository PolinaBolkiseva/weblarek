import type {
  IApi,
  IProductListResponse,
  IOrderRequest,
  IOrderResponse,
} from "../../types";
import { PRODUCT_ENDPOINT, ORDER_ENDPOINT } from "../../utils/constants";

export class LarekApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProductList(): Promise<IProductListResponse> {
    return this.api.get<IProductListResponse>(PRODUCT_ENDPOINT);
  }

  createOrder(data: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>(ORDER_ENDPOINT, data);
  }
}
