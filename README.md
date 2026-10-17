# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/components/communication/ — папка с классами для запросов к серверу

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент, за отображение которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get<T extends object>(uri: string): Promise<T>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом типа T, которым ответил сервер  
`post<T extends object>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse<T>(response: Response): Promise<T>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`off(event: EventName, callback: Function): void` - снимает обработчик с события.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`onAll(callback: (event: { eventName: string; data: unknown }) => void): void` - подписка на все события брокера.  
`offAll(): void` - снимает все подписки.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные
Типы объявлены в `src/types/index.ts`.

#### Алиасы
`ApiPostMethods` - `'POST' | 'PUT' | 'DELETE'` - методы HTTP-запроса, которые принимает post  
`TPayment` - `'card' | 'cash'` - способ оплаты  
`TProductId` - `string` - идентификатор товара  
`TProductList` - `IProduct[]` - массив товаров; используется и в каталоге, и в корзине  
`TErrors` - `{ [field: string]: string }` - словарь ошибок валидации: ключ - имя поля, значение - текст ошибки  

Эндпоинты API заданы константами в `src/utils/constants.ts`: `PRODUCT_ENDPOINT` (`/product`), `ORDER_ENDPOINT` (`/order`).

#### Интерфейс IApi
Контракт HTTP-клиента. Класс Api реализует этот интерфейс по структуре, LarekApi принимает IApi в конструкторе.

Методы:  
`get<T extends object>(uri: string): Promise<T>` - GET-запрос, T - тип ответа  
`post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>` - запрос с телом, по умолчанию POST  

#### Интерфейс IProduct
Интерфейс описывает единицу товара.

Поля интерфейса:  
`id: TProductId` - идентификатор товара  
`description: string` - описание товара  
`image: string` - изображение товара  
`title: string` - наименование товара  
`category: string` - категория (тип) товара  
`price: number | null` - цена товара; null, если товар бесценный  

#### Интерфейс IBuyer
Интерфейс описывает покупателя, хранит его контактные данные.

Поля интерфейса:  
`payment: TPayment | null` - способ оплаты; null, если способ не выбран  
`email: string` - E-mail покупателя  
`phone: string` - телефон покупателя  
`address: string` - адрес покупателя  

#### Интерфейс IProductListResponse
Ответ сервера на GET каталога.

Поля:  
`total: number` - количество товаров в выдаче  
`items: TProductList` - массив товаров  

#### Интерфейс IOrderRequest
Тело POST-запроса на оформление заказа. Расширяет `IBuyer`.

Поля:  
поля `IBuyer` - `payment`, `email`, `phone`, `address`  
`total: number` - сумма заказа  
`items: TProductId[]` - идентификаторы товаров  

#### Интерфейс IOrderResponse
Успешный ответ сервера на оформление заказа.

Поля:  
`id: string` - идентификатор созданного заказа  
`total: number` - сумма, которую зафиксировал сервер

### Модели данных

##### Класс ProductCatalog
Хранит список товаров каталога и товар, выбранный для подробного отображения.

Конструктор:  
`constructor(events: IEvents)` - принимает брокер событий, создаёт пустой список товаров и устанавливает товар, выбранный для подробного отображения, в null

Поля класса:  
`events: IEvents` - брокер событий  
`productList: TProductList` - массив товаров каталога  
`currentProduct: IProduct | null` - товар для подробного отображения

Методы класса:  
`setProductList(products: IProduct[]): void` - сохраняет в модели массив товаров, полученный в параметре  
`getProductList(): TProductList` - возвращает массив товаров из модели  
`getProduct(id: TProductId): IProduct | null` - возвращает товар по id; если товар не найден, возвращает null  
`setCurrentProduct(id: TProductId): void` - сохраняет в currentProduct товар для подробного отображения, найденный по id, и эмитит currentProduct:changed  
`getCurrentProduct(): IProduct | null` - возвращает товар, сохранённый для подробного отображения

##### Класс ProductBasket
Хранит товары корзины как массив `IProduct`.

Конструктор:  
`constructor(events: IEvents)` - принимает брокер событий и создаёт пустую корзину

Поля класса:  
`events: IEvents` - брокер событий  
`productList: TProductList` - массив товаров в корзине

Методы класса:  
`getProductList(): TProductList` - возвращает массив товаров, которые находятся в корзине  
`pushProduct(product: IProduct): void` - добавляет товар в массив корзины, если id товара не пустой  
`popProduct(product: IProduct): void` - удаляет товар из массива корзины по индексу, найденному через indexProduct  
`clear(): void` - очищает корзину  
`totalSum(): number` - возвращает сумму цен товаров в корзине; для цены null подставляется 0  
`totalCount(): number` - возвращает количество товаров в корзине (длину массива)  
`indexProduct(id: TProductId): number | null` - возвращает индекс товара в массиве по id; если id пустой или товар не найден, возвращает null

##### Класс Buyer
Хранит контактные данные покупателя. Поля защищённые; наружу данные отдаются через getBuyer в виде IBuyer.

Конструктор:  
`constructor(events: IEvents)` - принимает брокер событий, создаёт покупателя с пустыми строками и payment = null

Поля класса:  
`events: IEvents` - брокер событий  
`payment: TPayment | null` - вид оплаты; null, если способ не выбран  
`email: string` - E-mail покупателя  
`phone: string` - номер телефона покупателя  
`address: string` - адрес покупателя  

Методы класса:  
`setPayment(payment: TPayment): void` - записывает способ оплаты в поле payment  
`setEmail(email: string): void` - записывает email в поле email  
`setPhone(phone: string): void` - записывает телефон в поле phone  
`setAddress(address: string): void` - записывает адрес в поле address  
`getBuyer(): IBuyer` - возвращает объект с текущими данными покупателя: payment, email, phone, address  
`clear(): void` - очищает данные покупателя: payment = null, остальные поля - пустые строки  
`isValidPayment(): TErrors` - проверяет, что способ оплаты выбран; если payment равен null, возвращает объект с ключом payment, иначе пустой объект  
`isValidEmail(): TErrors` - проверяет, что email не пустой; если пустой, возвращает объект с ключом email, иначе пустой объект  
`isValidPhone(): TErrors` - проверяет, что телефон не пустой; если пустой, возвращает объект с ключом phone, иначе пустой объект  
`isValidAddress(): TErrors` - проверяет, что адрес не пустой; если пустой, возвращает объект с ключом address, иначе пустой объект 

### Слой коммуникации

#### Класс LarekApi
Класс для запросов к API магазина. Использует композицию: внутри хранит экземпляр Api (через интерфейс IApi) и вызывает его методы get и post.

Конструктор:  
`constructor(api: IApi)` - принимает объект, реализующий IApi, и сохраняет его в поле api

Поля класса:  
`api: IApi` - экземпляр для отправки HTTP-запросов

Методы класса:  
`getProductList(): Promise<IProductListResponse>` - выполняет GET-запрос на PRODUCT_ENDPOINT и возвращает промис с объектом IProductListResponse  
`createOrder(data: IOrderRequest): Promise<IOrderResponse>` - выполняет POST-запрос на ORDER_ENDPOINT, отправляет IOrderRequest и возвращает промис с IOrderResponse

### Слой Представления

Классы View отвечают только за отображение. Данные в DOM попадают через `render` и защищённые сеттеры. О действиях пользователя View сообщает колбэками, переданными в конструктор. Про модели слой не знает.

#### Класс Modal
Универсальное модальное окно. В `.modal__content` кладётся любой готовый DOM-элемент: превью, корзина, форма. Закрывается по кнопке и по клику на оверлей; клик внутри окна гасится и окно не закрывает.

Конструктор:  
`constructor(container: HTMLElement)` - принимает корневой элемент модалки `#modal-container`, навешивает обработчики закрытия

Поля класса:  
`closeButtonElement: HTMLButtonElement` - кнопка закрытия  
`contentElement: HTMLElement` - контейнер содержимого `.modal__content`  
`windowElement: HTMLElement` - внутреннее окно `.modal__container`

Методы класса:  
`open(): void` - добавляет класс `modal_active`  
`close(): void` - снимает `modal_active` и очищает содержимое  
`render(data: { content: HTMLElement }): HTMLElement` - записывает контент, открывает окно, возвращает контейнер

Сеттеры:  
`content` - кладёт переданный элемент в `.modal__content`

#### Класс Card
Базовый абстрактный класс карточки товара. Дженерик `T` - дополнительные данные дочерних карточек. Общее: заголовок и цена.

Конструктор:  
`constructor(container: HTMLElement)` - принимает корневой DOM карточки, ищет `.card__title` и `.card__price`

Поля класса:  
`titleElement: HTMLElement` - элемент названия  
`priceElement: HTMLElement` - элемент цены

Сеттеры:  
`title` - записывает название в `.card__title`  
`price` - если цена не null, показывает «N синапсов», иначе «бесценно»

#### Класс CatalogCard
Карточка товара в галерее. Наследует Card, добавляет картинку и категорию. Динамический компонент: создаётся на каждый товар, клик по телу карточки передаётся колбэком `onClick`.

Конструктор:  
`constructor(container: HTMLElement, actions?: { onClick: () => void })` - ищет `.card__image` и `.card__category`; если передан onClick, вешает его на контейнер

Поля класса:  
`imageElement: HTMLImageElement` - изображение товара  
`categoryElement: HTMLElement` - бейдж категории

Сеттеры:  
`image` - собирает полный URL из CDN_URL и значения поля image, записывает в src  
`category` - пишет текст категории и ставит CSS-модификатор из categoryMap

#### Класс PreviewCard
Подробная карточка товара в модалке. Наследует CatalogCard, добавляет описание и кнопку корзины. Создаётся один раз из шаблона `#card-preview`.

Конструктор:  
`constructor(container: HTMLElement, actions?: { onClick: () => void })` - ищет `.card__text` и `.card__button`; клик по кнопке не всплывает на карточку, вызывается onClick

Поля класса:  
`descriptionElement: HTMLElement` - описание товара  
`cardButton: HTMLButtonElement` - кнопка «Купить» / «Удалить из корзины» / «Недоступно»

Сеттеры:  
`description` - записывает описание  
`price` - вызывает сеттер родителя; если цена null, блокирует кнопку  
`buttonLabel` - записывает текст кнопки, переданный презентером

#### Класс BasketCard
Строка товара в корзине. Наследует Card, добавляет порядковый номер и кнопку удаления. Создаётся из шаблона `#card-basket`.

Конструктор:  
`constructor(container: HTMLElement, actions?: { onClick: () => void })` - ищет `.basket__item-index` и `.basket__item-delete`; onClick вешается на кнопку удаления

Поля класса:  
`indexElement: HTMLElement` - номер позиции в списке  
`deleteButton: HTMLButtonElement` - кнопка удаления

Сеттеры:  
`index` - записывает порядковый номер

#### Класс Catalog
Список готовых DOM-элементов. Про товары не знает: принимает массив HTMLElement и раскладывает их в своём контейнере. Используется и как галерея на странице, и как внутренний список корзины.

Конструктор:  
`constructor(container: HTMLElement)` - принимает контейнер списка, например `.gallery` или `.basket__list`

Сеттеры:  
`items` - заменяет детей контейнера переданным массивом элементов

#### Класс Basket
Содержимое модалки корзины. Создаётся из шаблона `#basket`. Список карточек держит через композицию: внутри поле `list` типа Catalog, привязанное к `.basket__list`.

Конструктор:  
`constructor(container: HTMLElement, actions?: { onClick: () => void })` - ищет заголовок, сумму и кнопку «Оформить»; onClick вешается на кнопку оформления; в сеттер items передаётся пустой массив, чтобы кнопка оформления была выключена до появления товаров

Поля класса:  
`list: Catalog` - вложенный список позиций корзины  
`titleElement: HTMLElement` - заголовок «Корзина»  
`totalElement: HTMLElement` - сумма заказа  
`checkoutButton: HTMLButtonElement` - кнопка «Оформить»

Сеттеры:  
`items` - отдаёт карточки во вложенный Catalog; если список пустой, блокирует кнопку оформления  
`title` - записывает заголовок; пустая строка заменяется на «Корзина»  
`total` - показывает сумму в синапсах

#### Класс Form
Базовый класс форм оформления. Дженерик `T` - дополнительные поля конкретной формы. Общее: валидность кнопки submit и текст ошибок.

Конструктор:  
`constructor(container: HTMLFormElement, actions?: { onSubmit?: () => void })` - ищет `button[type="submit"]` и `.form__errors`; submit отменяет перезагрузку страницы и вызывает onSubmit

Поля класса:  
`submitButton: HTMLButtonElement` - кнопка отправки формы  
`errorsElement: HTMLElement` - контейнер текста ошибок

Сеттеры:  
`valid` - включает или блокирует кнопку submit  
`errors` - записывает текст ошибок валидации

#### Класс Order
Первая форма заказа: способ оплаты и адрес. Наследует Form, создаётся из шаблона `#order`. Об изменении полей сообщает колбэком onChange, о нажатии «Далее» - onSubmit.

Конструктор:  
`constructor(container: HTMLFormElement, actions?: { onSubmit?: () => void; onChange?: (data: { field: 'payment' | 'address'; value: string }) => void })` - ищет кнопки `.order__buttons .button` и `input[name="address"]`, навешивает клики и input

Поля класса:  
`paymentButtons: HTMLButtonElement[]` - кнопки «Онлайн» и «При получении»  
`addressInput: HTMLInputElement` - поле адреса

Сеттеры:  
`payment` - ставит класс `button_alt-active` на выбранный способ оплаты  
`address` - записывает значение в поле адреса

#### Класс Contacts
Вторая форма заказа: email и телефон. Наследует Form, создаётся из шаблона `#contacts`. Об изменении полей сообщает onChange, о нажатии «Оплатить» - onSubmit.

Конструктор:  
`constructor(container: HTMLFormElement, actions?: { onSubmit?: () => void; onChange?: (data: { field: 'email' | 'phone'; value: string }) => void })` - ищет `input[name="email"]` и `input[name="phone"]`

Поля класса:  
`emailInput: HTMLInputElement` - поле email  
`phoneInput: HTMLInputElement` - поле телефона

Сеттеры:  
`email` - записывает email  
`phone` - записывает телефон

#### Класс Header
Шапка магазина: логотип и кнопка корзины со счётчиком. Живёт в статичной разметке `.header__container`.

Конструктор:  
`constructor(container: HTMLElement, actions?: { onClick: () => void })` - ищет `.header__basket` и `.header__basket-counter`; onClick вешается на кнопку корзины

Поля класса:  
`basketElement: HTMLElement` - кнопка корзины в шапке  
`counterElement: HTMLElement` - счётчик товаров

Сеттеры:  
`counter` - записывает количество товаров в корзине

#### Класс Success
Экран успешного оформления заказа. Создаётся из шаблона `#success`, показывается в модалке после ответа сервера.

Конструктор:  
`constructor(container: HTMLElement, actions?: { onClick?: () => void })` - ищет `.order-success__description` и `.order-success__close`; onClick вешается на кнопку «За новыми покупками!»

Поля класса:  
`descriptionElement: HTMLElement` - строка «Списано N синапсов»  
`closeButton: HTMLButtonElement` - кнопка закрытия успеха

Сеттеры:  
`total` - подставляет сумму списания в текст описания

### Презентер

Роль презентера выполняет файл `src/main.ts`. Отдельного класса нет: здесь создаются брокер, модели и представления и вешаются подписки на события.

При старте создаёт:
- `EventEmitter` - единственный брокер на всё приложение  
- модели `ProductCatalog`, `ProductBasket`, `Buyer`  
- представления `Modal`, `Header`, `Catalog`, `Basket`, `PreviewCard`, `Order`, `Contacts`, `Success`  
- HTTP-клиент `Api` и обёртку `LarekApi`

Подписки вешаются сразу, до запроса каталога. Когда данные приходят, вызывается только `catalog.setProductList` - дальше срабатывает уже `catalog:changed`.

Вспомогательные функции:  
`productInBasket(id: string): boolean` - проверяет, есть ли товар в корзине по id  
`getButtonLabel(product: IProduct): string` - возвращает текст кнопки превью: «Недоступно», если нет цены; иначе «Удалить из корзины» или «Купить»  
`collectErrors(...parts: TErrors[]): { valid: boolean; errors: string }` - склеивает объекты ошибок валидации в флаг valid и одну строку errors  
`renderBasket(): HTMLElement` - собирает BasketCard из модели корзины и вызывает Basket.render с items и total  
`renderOrder(): HTMLElement` - заполняет форму заказа данными покупателя и результатом валидации оплаты и адреса  
`renderContacts(): HTMLElement` - заполняет форму контактов данными покупателя и результатом валидации email и телефона

Данные в представления попадают в обработчиках изменения моделей. При открытии модалки вызывается `render()` без параметров: берётся уже готовый контейнер View.

Запрос каталога:  
`larekApi.getProductList()` - при успехе сохраняет `data.items` в ProductCatalog; при ошибке пишет сообщение в консоль

Обработчики событий:

`catalog:changed` - берёт список товаров из модели, для каждого создаёт CatalogCard (клик эмитит card:selected) и отдаёт массив в Catalog.render  

`card:selected` - сохраняет товар в catalog.setCurrentProduct  

`currentProduct:changed` - открывает модалку с PreviewCard: название, описание, цена, картинка, категория, текст кнопки из getButtonLabel  

`card:basket` - если выбранный товар есть и у него есть цена, добавляет его в корзину или удаляет, если он уже там; после этого закрывает модалку  

`basket:changed` - обновляет счётчик в Header; если есть выбранный товар, обновляет buttonLabel превью; перерисовывает содержимое корзины через renderBasket  

`basket:open` - кладёт в модалку контейнер корзины через viewBasket.render() без данных  

`basket:remove` - удаляет товар из модели корзины  

`basket:order` - кладёт в модалку форму заказа через viewOrder.render() без данных  

`order:changed` - пишет в Buyer способ оплаты или адрес  

`order:submit` - кладёт в модалку форму контактов через viewContacts.render() без данных  

`contacts:changed` - пишет в Buyer email или телефон  

`contacts:submit` - если способ оплаты выбран, отправляет заказ через LarekApi.createOrder; при успехе очищает корзину и покупателя и показывает Success; при ошибке выводит текст в форму контактов  

`buyer:changed` - вызывает renderOrder и renderContacts: поля форм, valid и errors

### Список событий
#### В Моделях данных:
##### {catalog:changed} - изменение каталога товаров
##### {currentProduct:changed} - изменение выбранного для просмотра товара
##### {basket:changed} - изменение содержимого корзины
##### {buyer:changed} - изменение данных покупателя
#### В Представлениях:
##### {card:selected} - выбор карточки для просмотра
##### {card:basket} - нажатие кнопки покупки товара
##### {basket:remove} - нажатие кнопки удаления товара из корзины
##### {basket:open} - нажатие кнопки открытия корзины
##### {basket:order} - нажатие кнопки оформления заказа
##### {order:submit} - нажатие кнопки перехода ко второй форме оформления заказа
##### {contacts:submit} - нажатие кнопки оплаты/завершения оформления заказа
##### {order:changed} - изменение данных в форме заказа
##### {contacts:changed} - изменение данных в форме контактов
