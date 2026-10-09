import type { IProduct, TProductList } from "../../types";

export class ProductCatalog {
  protected productList: TProductList;
  protected currentProduct: IProduct | null;

  constructor() {
    this.productList = [];
    this.currentProduct = null;
  }

  //Методы
  //сохранение массива товаров полученного в параметрах метода;
  setProductList(ArrProduct: IProduct[]): void {
    this.productList = [];
    for (const product of ArrProduct) {
      this.productList.push(product);
    }
  }

  //получение массива товаров из модели;
  getProductList(): TProductList {
    return [...this.productList];
  }
  //получение одного товара по его id;
  getProduct(id: string): IProduct | null {
    if (id === "") return null;
    else
      return (
        this.productList.find((el: IProduct): boolean => el.id === id) ?? null
      );
  }
  //сохранение товара для подробного отображения;
  setCurrentProduct(id: string): void {
    this.currentProduct = this.getProduct(id);
  }
  //получение товара для подробного отображения.
  getCurrentProduct(): IProduct | null {
    return this.currentProduct;
  }
}
