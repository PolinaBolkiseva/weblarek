import type { IProduct, TProductId, TProductList } from "../../types";
import type { IEvents } from '../base/Events';

export class ProductBasket {
  protected productList: TProductList = [];

  constructor (protected events: IEvents) {};
  //Методы
  //получение массива со списком товаров, которые находятся в корзине;
  getProductList(): TProductList {
    return this.productList;
  }
  //добавление товара, который был получен в параметре, в массив корзины;
  pushProduct(product: IProduct) {
    if (product.id !== "") {
      this.productList.push(product);
    }
    this.events.emit('basket:changed');
  }
  //удаление товара, полученного в параметре из массива корзины;
  popProduct(product: IProduct) {
    const i: number | null = this.indexProduct(product.id);
    if (i && i >= 0) this.productList.slice(i, 1);
    this.events.emit('basket:changed');
  }
  //очистка корзины;
  clear() {
    this.productList = [];
    this.events.emit('basket:changed');
  }
  //получение стоимости всех товаров в корзине;
  totalSum() {
    const total = this.productList.reduce((summ, prod) => {
      const price: number = prod.price ?? 0;
      return (summ += price > 0 ? price : 0);
    }, 0);
    return total;
  }
  //получение количества товаров в корзине;
  totalCount() {
    return this.productList.length;
  }
  //проверка наличия товара в корзине по его id, полученного в параметр метода.
  //вернём номер позиции в массиве, если элемента нет, то вернём null.
  indexProduct(id: TProductId): number | null {
    if (id === "") return null;
    else
      return (
        this.productList.findIndex((el: IProduct): boolean => el.id === id) ??
        null
      );
  }
}
