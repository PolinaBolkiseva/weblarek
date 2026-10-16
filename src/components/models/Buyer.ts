import type { TPayment, IBuyer, TErrors } from "../../types";
import type { IEvents } from "../base/Events";

export class Buyer {
  protected payment: TPayment | null;
  protected email: string;
  protected phone: string;
  protected address: string;

  constructor(protected events: IEvents) {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
  }

  //Методы
  //сохранение данных в модели. Один общий метод или отдельные методы для каждого поля.
  // Важно учесть, что должна быть реализована возможность сохранить только одно значение,
  //  например, только адрес или только телефон, не удалив при этом значения других полей,
  //  которые уже могут храниться в классе;
  setPayment(payment: TPayment): void {
    this.payment = payment;
    this.events.emit("buyer:changed");
  }

  setEmail(email: string): void {
    this.email = email;
    this.events.emit("buyer:changed");
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit("buyer:changed");
  }

  setAddress(address: string): void {
    this.address = address;
    this.events.emit("buyer:changed");
  }
  //получение всех данных покупателя;
  getBuyer(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  //очистка данных покупателя;
  clear(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
    this.events.emit("buyer:changed");
  }
  //валидация данных. Обратите внимание, что правила валидации описаны
  // в функциональных требованиях. Поле является валидным, если оно не пустое.
  // Метод валидации должен давать возможность определить не только валидность
  // каждого отдельного поля, но и предоставлять информацию об ошибке,
  // связанной с проверкой конкретного значения.
  isValidPayment(): TErrors {
    const errorObj: TErrors = {};
    if (this.payment === null) errorObj["payment"] = "способ оплаты не выбран";
    return errorObj;
  }

  isValidEmail(): TErrors {
    const errorObj: TErrors = {};
    if (this.email.trim() === "") errorObj["email"] = "E-mail не указан";
    return errorObj;
  }

  isValidPhone(): TErrors {
    const errorObj: TErrors = {};
    if (this.phone.trim() === "")
      errorObj["phone"] = "номер телефона не указан";
    return errorObj;
  }

  isValidAddress(): TErrors {
    const errorObj: TErrors = {};
    if (this.address.trim() === "") errorObj["address"] = "адрес не указан";
    return errorObj;
  }
}
