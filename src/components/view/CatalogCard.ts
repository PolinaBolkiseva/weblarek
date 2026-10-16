// src/components/views/CatalogCard.ts
//import { ensureElement } from '../../utils/utils';
import { Card } from './Card';

// Обработчики действий пользователя на карточке. Карточка — динамический
// компонент: события не эмитит, а получает готовые коллбеки через конструктор.
/*interface ICatalogCardActions {
  onClick: () => void; // клик по телу карточки — подробности
  onReceipt: () => void; // клик по кнопке «Поступление товара»
}*/
// VIEW — карточка товара в списке. Заголовок, цену и остаток наследует
// у Card, от себя добавляет кнопку «Поступление товара».
export class CatalogCard extends Card {
  //protected receiptButton: HTMLButtonElement;

  constructor(container: HTMLElement /*, actions?: ICatalogCardActions*/) {
    super(container);
/*
    this.receiptButton = ensureElement<HTMLButtonElement>('.card__receipt', this.container);
  
    // Клик по телу карточки → подробности о товаре.
    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    } 
    // Клик по кнопке → вызвать переданный обработчик.
    if (actions?.onReceipt) {
      this.receiptButton.addEventListener('click', (event) => {
        event.stopPropagation();
        actions.onReceipt();
      });
    } */
  }
}