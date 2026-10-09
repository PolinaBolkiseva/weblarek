import type { IProduct, TProductId, TProductList } from '../../types';

class ProductCatalog {
  
  protected productList: TProductList;
  protected currentProduct: IProduct | null;

  constructor () 
  {
    this.productList = new Set<TProductId>();
    this.currentProduct = null;
  }

//Методы
  //сохранение массива товаров полученного в параметрах метода;
  //получение массива товаров из модели;
  //получение одного товара по его id;
  //сохранение товара для подробного отображения;
  //получение товара для подробного отображения.
}
