import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { Catalog } from "./Catalog";

interface IBasketView {
  items: HTMLElement[];
  total: number;
  title: string;
}

interface IBasketActions {
  onClick: () => void;
}

export class Basket extends Component<IBasketView> {
  protected list: Catalog; //воспользуемся композицией классов
  protected titleElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected checkoutButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IBasketActions) {
    super(container);

    this.list = new Catalog(
      ensureElement<HTMLElement>(".basket__list", this.container),
    );
    this.titleElement = ensureElement<HTMLElement>(
      ".modal__title",
      this.container,
    );
    this.totalElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this.checkoutButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );

    if (actions?.onClick) {
      this.checkoutButton.addEventListener("click", actions.onClick);
    }
  }

  protected set items(items: HTMLElement[]) {
    this.list.render({ items });
    this.checkoutButton.disabled = items.length === 0;
  }

  protected set title(value: string) {
    this.titleElement.textContent = value === "" ? "Корзина" : value;
  }

  protected set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }
}
