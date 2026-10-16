// src/components/view/CatalogCard.ts
import { ensureElement } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants'
import { Card } from './Card';

export interface ICatalogExtra {
  image: string;
  category: string;
}

// Обработчики действий пользователя на карточке. Карточка — динамический
// компонент: события не эмитит, а получает готовые коллбеки через конструктор.
interface ICatalogCardActions {
  onClick: () => void; // клик по телу карточки — подробности
}
// VIEW — карточка товара в списке. Наследует заголовок и цену, добавляет картинку и категорию.
export class CatalogCard<T = object> extends Card<ICatalogExtra&T>{
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement , actions?: ICatalogCardActions) {
    super(container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    // Клик по телу карточки → подробности о товаре.
    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    } 
  }

  protected set image(value: string) {
    this.imageElement.src = CDN_URL+value;
  }

  protected set category(value: string) {
    this.categoryElement.textContent = value;
    const modifier = categoryMap[value as keyof typeof categoryMap];
    this.categoryElement.className = modifier
      ? `card__category ${modifier}`
      : 'card__category';
  }
}
