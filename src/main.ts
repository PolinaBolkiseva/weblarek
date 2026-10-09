import "./scss/styles.scss";
import { Api } from "./components/base/Api";
import { LarekApi } from "./components/comunication/LarekApi";
import { API_URL } from "./utils/constants";
import { Buyer } from "./components/models/Buyer";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { ProductBasket } from "./components/models/ProductBasket";

const larekApi = new LarekApi(new Api(API_URL));
const buyer = new Buyer(
  "cash",
  "polya-sonya@test.com",
  "+79990001122",
  "Восточная",
);
const catalog = new ProductCatalog();
const basket = new ProductBasket();

larekApi
  .getProductList()
  .then((data) => {
    catalog.setProductList(data.items);
    console.log("Ответ каталога: ", data);
    console.log("Товары в модели: ", catalog.getProductList());

    const firstProduct = catalog.getProductList()[0];
    if (firstProduct) {
      basket.pushProduct(firstProduct);
    }
    console.log("Корзина: ", basket.getProductList());

    return larekApi.createOrder({
      ...buyer.getBuyer(),
      total: basket.totalSum(),
      items: Object.keys(basket.getProductList()),
    });
  })
  .then((order) => {
    console.log("Ответ заказа: ", order);
    console.log("id заказа: ", order.id, "сумма: ", order.total);
  })
  .catch((error) => {
    console.error("Ошибка запроса: ", error);
  });
