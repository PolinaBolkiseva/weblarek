// src/components/view/ReceiptForm.ts
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
//import type { TReceiptReason } from '../../types'


// Данные, которые форма умеет показывать.
interface IReceiptForm {
  title: string; // заголовок «Поступление: <товар>»
  stock: string; // строка «Текущий остаток: N шт»
  //reason: TReceiptReason | null; // выбранная причина (null — не выбрана)
  quantity: string; // значение поля количества
  valid: boolean; // можно ли проводить (управляет disabled у submit)
  errors: string; // текст ошибок валидации
}

// VIEW — форма документа поступления. Статичный компонент: создаётся один раз
// из шаблона и переиспользуется через render().
export class ReceiptForm extends Component<IReceiptForm> {
  protected titleElement: HTMLElement;
  protected stockElement: HTMLElement;
  protected reasonButtons: HTMLButtonElement[];
  protected quantityInput: HTMLInputElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(protected events: IEvents, protected container: HTMLFormElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.receipt__title', this.container);
    this.stockElement = ensureElement<HTMLElement>('.receipt__stock', this.container);
    this.reasonButtons = ensureAllElements<HTMLButtonElement>(
      '.receipt__reasons .button',
      this.container
    );
    this.quantityInput = ensureElement<HTMLInputElement>('.receipt__input', this.container);
    this.submitButton = ensureElement<HTMLButtonElement>('.receipt__submit', this.container);
    this.errorsElement = ensureElement<HTMLElement>('.receipt__errors', this.container);

    // Кнопки-переключатели: при клике View только сообщает о выборе.
    this.reasonButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.events.emit('form:changed', { field: 'reason', value: button.name });
      });
    });

    // Поле количества — на каждый ввод уведомляем презентер.
    this.quantityInput.addEventListener('input', () => {
      this.events.emit('form:changed', {
        field: 'quantity',
        value: this.quantityInput.value,
      });
    });

    // Submit — это «проведение» документа.
    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('receipt:submitted');
    });
  }

  // Сеттеры protected: снаружи компонент обновляется только через render().
  protected set title(value: string) {
    this.titleElement.textContent = value;
  }

  protected set stock(value: string) {
    this.stockElement.textContent = value;
  }

 /* protected set reason(value: TReceiptReason | null) {
    this.reasonButtons.forEach((button) => {
      button.classList.toggle('button_alt-active', button.name === value);
    });
  }*/

  protected set quantity(value: string) {
    this.quantityInput.value = value;
  }

  protected set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  protected set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}