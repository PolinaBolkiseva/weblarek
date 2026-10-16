import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface IBasket {
  counter : number;
}

interface IBasketAction {
  onClick: () => void;
}

export class Header extends Component<IBasket> {
  protected basketElement: HTMLElement;
  protected counterElement: HTMLElement;

  constructor (container: HTMLElement, actions?: IBasketAction) {
    super(container); 

    this.basketElement = ensureElement<HTMLElement>('.header__basket', this.container);
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);

    // Клик по телу корзины → открыть корзину.
    if (actions?.onClick) {
      this.basketElement.addEventListener('click', actions.onClick);
    } 
  }

  protected set counter (count : number) {
    this.counterElement.textContent = String(count);
  }
}