import type { IProduct, TProductList, TProductId } from "../../types";
import type { IEvents } from "../base/Events";

export class ProductCatalog {
  protected productList: TProductList;
  protected currentProduct: IProduct | null;

  constructor(protected events: IEvents) {
    this.productList = [];
    this.currentProduct = null;
  }

  //Методы
  //сохранение массива товаров полученного в параметрах метода;
  setProductList(products: IProduct[]): void {
    this.productList = products;
    this.events.emit("catalog:changed");
  }

  //получение массива товаров из модели;
  getProductList(): TProductList {
    return this.productList;
  }
  //получение одного товара по его id;
  getProduct(id: TProductId): IProduct | null {
    return (
      this.productList.find((el: IProduct): boolean => el.id === id) ?? null
    );
  }
  //сохранение товара для подробного отображения;
  setCurrentProduct(id: TProductId): void {
    this.currentProduct = this.getProduct(id);
    this.events.emit("currentProduct:changed");
  }
  //получение товара для подробного отображения.
  getCurrentProduct(): IProduct | null {
    return this.currentProduct;
  }
}
