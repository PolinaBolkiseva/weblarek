import "./scss/styles.scss";
import { apiProducts } from "./utils/data";
import { Api } from "./components/base/Api";
import { LarekApi } from "./components/communication/LarekApi";
import { API_URL } from "./utils/constants";
import { Buyer } from "./components/models/Buyer";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { ProductBasket } from "./components/models/ProductBasket";

import { Catalog } from "./components/view/Catalog";
import { CatalogCard } from "./components/view/CatalogCard";
import { PreviewCard } from "./components/view/PreviewCard";
import { Basket } from './components/view/Basket';
import { BasketCard } from './components/view/BasketCard';
import { Modal } from './components/view/Modal';
import { Header } from './components/view/Header'

import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/Events';
import { IProduct } from './types' 

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

function productInBasket(id: string): boolean {
  return (basket.indexProduct(id) ?? -1) >= 0;
}

/*
console.log("--- Покупатель ---");
console.log("После конструктора:", buyer.getBuyer());
console.log("isValidPayment:", buyer.isValidPayment());
console.log("isValidEmail:", buyer.isValidEmail());
console.log("isValidPhone:", buyer.isValidPhone());
console.log("isValidAddress:", buyer.isValidAddress());
buyer.setPayment("card");
buyer.setEmail("polya-sonya@test.com");
buyer.setPhone("+79990001122");
buyer.setAddress("Восточная");
console.log("После сохранения полей:", buyer.getBuyer());
console.log("isValidPayment:", buyer.isValidPayment());
console.log("isValidEmail:", buyer.isValidEmail());
console.log("isValidPhone:", buyer.isValidPhone());
console.log("isValidAddress:", buyer.isValidAddress());
buyer.clear();
console.log("После clear:", buyer.getBuyer());
console.log("isValidPayment:", buyer.isValidPayment());
console.log("isValidEmail:", buyer.isValidEmail());
console.log("isValidPhone:", buyer.isValidPhone());
console.log("isValidAddress:", buyer.isValidAddress());
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
  console.log("indexProduct:", basket.indexProduct(firstLocal.id));
  basket.popProduct(firstLocal);
  console.log("После popProduct:", basket.getProductList());
  console.log("totalSum:", basket.totalSum());
  console.log("totalCount:", basket.totalCount());
  basket.clear();
  console.log("После clear:", basket.getProductList());
  console.log("indexProduct после clear:", basket.indexProduct(firstLocal.id));
  console.log("totalSum:", basket.totalSum());
  console.log("totalCount:", basket.totalCount());
}
*/
// --- Участники ---

// Единственный брокер на всё приложение.
const events = new EventEmitter();

// Модалка живёт в статичной разметке страницы.
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));

// Шапочка
const header = new Header(ensureElement<HTMLElement>('.header__container'), {
  onClick: () => events.emit('basket:open'),
});

const viewBasket = new Basket(cloneTemplate<HTMLElement>('#basket'), {
  onClick: () => events.emit('basket:order'),
});

// Подробную карточку тоже создаём один раз — статичный компонент.
const preview = new PreviewCard(cloneTemplate<HTMLElement>('#card-preview'), {
  onClick: () => events.emit('card:basket'),
});

// Модели данных
const buyer = new Buyer(events);
const catalog = new ProductCatalog(events);
const basket = new ProductBasket(events);

// Каталог живёт в статичной разметке страницы.
const viewCatalog = new Catalog(ensureElement<HTMLElement>('.gallery'));

// --- Отладка ---
events.onAll(({ eventName, data }) => console.log(eventName, data));

function renderBasket() {
  const items = basket.getProductList().map((item, index) =>
    new BasketCard(cloneTemplate<HTMLElement>('#card-basket'), {
      onClick: () => events.emit('basket:remove', item),
    }).render({
      title: item.title,
      price: item.price,
      index: index + 1,
    })
  );

  return viewBasket.render({
    items,
    total: basket.totalSum(),
  });
}

events.on('basket:open', () => {
  modal.render({ content: renderBasket() });
});

events.on('basket:remove', (item: IProduct) => {
  basket.popProduct(item);
});

// Каталог изменился → забрать товары у модели и перерисовать карточки.
events.on('catalog:changed', () => {
  console.log("Каталог после ответа сервера:", catalog.getProductList());
  const cards = catalog.getProductList().map((item) =>
    new CatalogCard(cloneTemplate<HTMLElement>('#card-catalog'), {
      // Клик по телу карточки: сообщаем факт — какой товар выбрали.
      onClick: () => events.emit('card:selected', item),
    }).render({
      title: item.title,
      price: item.price,
      category: item.category,
      image: item.image
    })
  );

  viewCatalog.render({ items: cards });
});

events.on('basket:changed', () => {
  header.render({ counter: basket.totalCount() });

  const product = catalog.getCurrentProduct();
  if (product) {
    preview.render({ inBasket: productInBasket(product.id) });
  }

  renderBasket();
});

// Выбрали товар → показать подробную карточку в модалке.
events.on('card:selected', (item: IProduct) => {
  catalog.setCurrentProduct(item.id);
  modal.render({
    content: preview.render({
      title: item.title,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
      inBasket: productInBasket(item.id),
    }),
  });
});

//по клику добавляем в корзину / удаляем из корзины
events.on('card:basket', () => {
  const product = catalog.getCurrentProduct();
  if (!product || product.price === null) return;
  if (productInBasket(product.id)) {
    basket.popProduct(product);
  } else {
    basket.pushProduct(product);
  }
});

console.log("--- Запрос каталога с сервера ---");
larekApi
  .getProductList()
  .then((data) => {
    catalog.setProductList(data.items);
  })
  .catch((error) => {
    console.error("Ошибка запроса каталога:", error);
  });
