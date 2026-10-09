import type { IProduct, TProductBasket } from "../../types";

export class ProductBasket {
  protected productList: TProductBasket = {};

  //Методы
  //получение объекта со списком товаров, которые находятся в корзине;
  getProductList(): TProductBasket {
    return { ...this.productList };
  }
  //добавление товара, который был получен в параметре, в объект корзины;
  pushProduct(product: IProduct) {
    if (product.id !== "") {
      if (this.hasProduct(product.id)) {
        this.productList[product.id].count++;
        this.updateProduct(product);
      } else {
        this.productList[product.id] = {
          title: product.title,
          price: product.price ?? null,
          count: 1,
        };
      }
    }
  }
  //удаление товара, полученного в параметре из массива корзины;
  popProduct(product: IProduct) {
    if (this.hasProduct(product.id)) {
      this.productList[product.id].count--;
      if (this.productList[product.id].count < 1) {
        delete this.productList[product.id];
      } else {
        this.updateProduct(product);
      }
    }
  }
  //очистка корзины;
  clear() {
    this.productList = {};
  }
  //получение стоимости всех товаров в корзине;
  totalSum() {
    let total = 0;
    for (const item of Object.values(this.productList)) {
      const price = item.price ?? 0;
      total += (price > 0 ? price : 0) * item.count;
    }
    return total;
  }
  //получение количества товаров в корзине;
  totalCount() {
    let total = 0;
    for (const item of Object.values(this.productList)) {
      total += item.count;
    }
    return total;
  }
  //проверка наличия товара в корзине по его id, полученного в параметр метода.
  hasProduct(id: string): boolean {
    if (id === "") return false;
    else return id in this.productList;
  }
  //обновление товара
  updateProduct(product: IProduct) {
    if (this.hasProduct(product.id)) {
      this.productList[product.id].title = product.title;
      this.productList[product.id].price = product.price ?? null;
    }
  }
}
