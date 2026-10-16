import "./scss/styles.scss";
import { Api } from "./components/base/Api";
import { LarekApi } from "./components/communication/LarekApi";
import { API_URL } from "./utils/constants";
import { Buyer } from "./components/models/Buyer";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { ProductBasket } from "./components/models/ProductBasket";

import { Catalog } from "./components/view/Catalog";
import { CatalogCard } from "./components/view/CatalogCard";
import { PreviewCard } from "./components/view/PreviewCard";
import { Basket } from "./components/view/Basket";
import { BasketCard } from "./components/view/BasketCard";
import { Order } from "./components/view/Order";
import { Contacts } from "./components/view/Contacts";
import { Success } from "./components/view/Success";
import { Modal } from "./components/view/Modal";
import { Header } from "./components/view/Header";

import { cloneTemplate, ensureElement } from "./utils/utils";
import { EventEmitter } from "./components/base/Events";
import { IProduct, TErrors, TPayment } from "./types";

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

function productInBasket(id: string): boolean {
  return basket.indexProduct(id) != null;
}

function collectErrors(...parts: TErrors[]): {
  valid: boolean;
  errors: string;
} {
  const merged: TErrors = Object.assign({}, ...parts);
  return {
    valid: Object.keys(merged).length === 0,
    errors: Object.values(merged).join("; "),
  };
}

// --- Участники ---

// Единственный брокер на всё приложение.
const events = new EventEmitter();

// Модалка живёт в статичной разметке страницы.
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"));

// Шапочка
const header = new Header(ensureElement<HTMLElement>(".header__container"), {
  onClick: () => events.emit("basket:open"),
});

// Корзина
const viewBasket = new Basket(cloneTemplate<HTMLElement>("#basket"), {
  onClick: () => events.emit("basket:order"),
});

// Оформление заказа
const viewOrder = new Order(cloneTemplate<HTMLFormElement>("#order"), {
  onChange: (data) => events.emit("order:changed", data),
  onSubmit: () => events.emit("order:submit"),
});

// Форма с контактами
const viewContacts = new Contacts(cloneTemplate<HTMLFormElement>("#contacts"), {
  onChange: (data) => events.emit("contacts:changed", data),
  onSubmit: () => events.emit("contacts:submit"),
});

// Заказ оплачен
const viewSuccess = new Success(cloneTemplate<HTMLElement>("#success"), {
  onClick: () => modal.close(),
});

// Подробную карточку тоже создаём один раз — статичный компонент.
const preview = new PreviewCard(cloneTemplate<HTMLElement>("#card-preview"), {
  onClick: () => events.emit("card:basket"),
});

// Модели данных
const buyer = new Buyer(events);
const catalog = new ProductCatalog(events);
const basket = new ProductBasket(events);

// Каталог живёт в статичной разметке страницы.
const viewCatalog = new Catalog(ensureElement<HTMLElement>(".gallery"));

function renderBasket() {
  const items = basket.getProductList().map((item, index) =>
    new BasketCard(cloneTemplate<HTMLElement>("#card-basket"), {
      onClick: () => events.emit("basket:remove", item),
    }).render({
      title: item.title,
      price: item.price,
      index: index + 1,
    }),
  );

  return viewBasket.render({
    items,
    total: basket.totalSum(),
  });
}

function renderOrder() {
  const data = buyer.getBuyer();
  const status = collectErrors(buyer.isValidPayment(), buyer.isValidAddress());
  return viewOrder.render({
    payment: data.payment,
    address: data.address,
    valid: status.valid,
    errors: status.errors,
  });
}

function renderContacts() {
  const data = buyer.getBuyer();
  const status = collectErrors(buyer.isValidEmail(), buyer.isValidPhone());
  return viewContacts.render({
    email: data.email,
    phone: data.phone,
    valid: status.valid,
    errors: status.errors,
  });
}

events.on("basket:open", () => {
  modal.render({ content: renderBasket() });
});

events.on("basket:order", () => {
  modal.render({ content: renderOrder() });
});

events.on(
  "order:changed",
  ({ field, value }: { field: string; value: string }) => {
    if (field === "payment") buyer.setPayment(value as TPayment);
    if (field === "address") buyer.setAddress(value);
  },
);

events.on("order:submit", () => {
  const status = collectErrors(buyer.isValidPayment(), buyer.isValidAddress());
  if (!status.valid) return;
  modal.render({ content: renderContacts() });
});

events.on(
  "contacts:changed",
  ({ field, value }: { field: string; value: string }) => {
    if (field === "email") buyer.setEmail(value);
    if (field === "phone") buyer.setPhone(value);
  },
);

events.on("contacts:submit", () => {
  const status = collectErrors(
    buyer.isValidPayment(),
    buyer.isValidAddress(),
    buyer.isValidEmail(),
    buyer.isValidPhone(),
  );
  if (!status.valid) return;

  const data = buyer.getBuyer();
  if (data.payment === null) return;

  larekApi
    .createOrder({
      payment: data.payment,
      email: data.email,
      phone: data.phone,
      address: data.address,
      total: basket.totalSum(),
      items: basket.getProductList().map((item) => item.id),
    })
    .then((result) => {
      const total = result.total;
      basket.clear();
      buyer.clear();
      modal.render({ content: viewSuccess.render({ total }) });
    })
    .catch((error) => {
      viewContacts.render({ errors: String(error), valid: false });
    });
});

events.on("buyer:changed", () => {
  const orderStatus = collectErrors(
    buyer.isValidPayment(),
    buyer.isValidAddress(),
  );
  viewOrder.render({
    payment: buyer.getBuyer().payment,
    valid: orderStatus.valid,
    errors: orderStatus.errors,
  });

  const contactStatus = collectErrors(
    buyer.isValidEmail(),
    buyer.isValidPhone(),
  );
  viewContacts.render({
    valid: contactStatus.valid,
    errors: contactStatus.errors,
  });
});

events.on("basket:remove", (item: IProduct) => {
  basket.popProduct(item);
});

// Каталог изменился → забрать товары у модели и перерисовать карточки.
events.on("catalog:changed", () => {
  const cards = catalog.getProductList().map((item) =>
    new CatalogCard(cloneTemplate<HTMLElement>("#card-catalog"), {
      // Клик по телу карточки: сообщаем факт — какой товар выбрали.
      onClick: () => events.emit("card:selected", item),
    }).render({
      title: item.title,
      price: item.price,
      category: item.category,
      image: item.image,
    }),
  );

  viewCatalog.render({ items: cards });
});

events.on("basket:changed", () => {
  header.render({ counter: basket.totalCount() });

  const product = catalog.getCurrentProduct();
  if (product) {
    preview.render({ inBasket: productInBasket(product.id) });
  }

  renderBasket();
});

// Выбрали товар → показать подробную карточку в модалке.
events.on("card:selected", (item: IProduct) => {
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
events.on("card:basket", () => {
  const product = catalog.getCurrentProduct();
  if (!product || product.price === null) return;
  if (productInBasket(product.id)) {
    basket.popProduct(product);
  } else {
    basket.pushProduct(product);
  }
  modal.close();
});

larekApi
  .getProductList()
  .then((data) => {
    catalog.setProductList(data.items);
  })
  .catch((error) => {
    console.error("Ошибка запроса каталога:", error);
  });
