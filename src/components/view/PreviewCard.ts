// src/components/view/PreviewCard.ts
import { ensureElement } from "../../utils/utils";
import { CatalogCard } from "./CatalogCard";

// Добавка подробной карточки к общим данным ICard.
interface IPreviewExtra {
  description: string;
  buttonLabel : string;
}

// Карточка просмотра — статичный элемент: события не эмитит,
// а получает готовые коллбеки через конструктор.
interface IPreviewCardActions {
  onClick: () => void; // клик по кнопке корзины
}

// VIEW — подробная карточка товара. Заголовок, цену
// у Card, от себя добавляет описание.
export class PreviewCard extends CatalogCard<IPreviewExtra> {
  protected descriptionElement: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IPreviewCardActions) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );

    this.cardButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    // Клик по кнопке → вызвать переданный обработчик.
    if (actions?.onClick) {
      this.cardButton.addEventListener("click", (event) => {
        event.stopPropagation();
        actions.onClick();
      });
    }
  }

  // Сеттер protected: снаружи компонент обновляется только через render().
  protected set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  protected set price(value: number | null) {
    super.price = value;
    this.cardButton.disabled = value === null;
  }

  protected set buttonLabel(value: string) {
    this.cardButton.textContent = value;
  }
}
