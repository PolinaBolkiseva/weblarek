import "./scss/styles.scss";
import { apiProducts } from "./utils/data";
import { Api } from "./components/base/Api";
import { LarekApi } from "./components/communication/LarekApi";
import { API_URL } from "./utils/constants";
import { Buyer } from "./components/models/Buyer";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { ProductBasket } from "./components/models/ProductBasket";

const api = new Api(API_URL);
const larekApi = new LarekApi(api);
const buyer = new Buyer("", "", "", "");
const catalog = new ProductCatalog();
const basket = new ProductBasket();

console.log("--- Покупатель ---");
console.log("После конструктора:", buyer.getBuyer());
console.log("isValid при пустых полях:", buyer.isValid());
console.log("Ошибки валидации:", buyer.getErrorList());
buyer.setPayment("card");
buyer.setEmail("polya-sonya@test.com");
buyer.setPhone("+79990001122");
buyer.setAddress("Восточная");
console.log("После сохранения полей:", buyer.getBuyer());
console.log("isValidPayment:", buyer.isValidPayment());
console.log("isValidEmail:", buyer.isValidEmail());
console.log("isValidPhone:", buyer.isValidPhone());
console.log("isValidAddress:", buyer.isValidAddress());
console.log("isValid:", buyer.isValid());
console.log("Ошибки после заполнения:", buyer.getErrorList());
buyer.clear();
console.log("После clear:", buyer.getBuyer());
console.log("Ошибки после clear:", buyer.getErrorList());
buyer.setPayment("cash");
buyer.setEmail("polya-sonya@test.com");
buyer.setPhone("+79990001122");
buyer.setAddress("Восточная");
console.log("Покупатель для заказа:", buyer.getBuyer());

console.log("--- Каталог ---");
catalog.setProductList(apiProducts.items);
console.log("Список товаров:", catalog.getProductList());
const firstLocal = catalog.getProductList()[0];
const secondLocal = catalog.getProductList()[1];
if (firstLocal) {
  console.log("Товар по id:", catalog.getProduct(firstLocal.id));
  catalog.setCurrentProduct(firstLocal.id);
  console.log("Товар для подробного отображения:", catalog.getCurrentProduct());
}

console.log("--- Корзина ---");
if (firstLocal) {
  basket.pushProduct(firstLocal);
  basket.pushProduct(firstLocal);
  if (secondLocal) basket.pushProduct(secondLocal);
  console.log("После трёх добавлений:", basket.getProductList());
  console.log("totalSum:", basket.totalSum());
  console.log("totalCount:", basket.totalCount());
  console.log("hasProduct:", basket.hasProduct(firstLocal.id));
  basket.updateProduct({ ...firstLocal, title: "Обновлённое название" });
  console.log("После updateProduct:", basket.getProductList());
  console.log("totalSum:", basket.totalSum());
  console.log("totalCount:", basket.totalCount());
  basket.popProduct(firstLocal);
  console.log("После popProduct:", basket.getProductList());
  console.log("totalSum:", basket.totalSum());
  console.log("totalCount:", basket.totalCount());
  basket.clear();
  console.log("После clear:", basket.getProductList());
  console.log("hasProduct после clear:", basket.hasProduct(firstLocal.id));
  console.log("totalSum:", basket.totalSum());
  console.log("totalCount:", basket.totalCount());
}

console.log("--- Запрос каталога с сервера ---");
larekApi
  .getProductList()
  .then((data) => {
    catalog.setProductList(data.items);
    console.log("Каталог после ответа сервера:", catalog.getProductList());
  })
  .catch((error) => {
    console.error("Ошибка запроса каталога:", error);
  });
