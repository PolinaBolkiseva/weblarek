// src/components/view/Card.ts
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

// Общие данные любой карточки товара.
export interface ICard {
  title: string;
  price: number | null;
}

// Базовый класс товарных View. Держит общее: элементы заголовка, цены + их сеттеры.
// Дочерние классы добавляют своё (кнопку,
// описание) через параметр T.
export abstract class Card<T = object> extends Component<ICard & T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container,
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container,
    );
  }

  // Сеттеры protected: снаружи компонент обновляется только через render().
  protected set title(value: string) {
    this.titleElement.textContent = value;
  }

  protected set price(value: number | null) {
    this.priceElement.textContent =
      value !== null ? `${value} синапсов` : `бесценно`;
  }
}
