import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";

interface IBasketCardExtra {
  index: number;
}

interface IBasketCardActions {
  onClick: () => void;
}

export class BasketCard extends Card<IBasketCardExtra> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IBasketCardActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    if (actions?.onClick) {
      this.deleteButton.addEventListener("click", actions.onClick);
    }
  }

  protected set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
