import type { TProductBasket, IBuyer , TErrors} from '../../types';

class Order {
  protected buyer: IBuyer;
  protected productList: TProductBasket = {};
  protected errors: TErrors;
  constructor ( buyer: IBuyer, 
                productList: TProductBasket = {}
              ) 
  {
    this.errors = {};
    this.buyer = buyer;

    //проверка покупателя....

    if (Object.keys(productList).length === 0)
      this.errors ['productList'] = 'В заказ не добавлены товары.';
    else
      this.productList = { ...productList }; //structuredClone(productList);
  }
}