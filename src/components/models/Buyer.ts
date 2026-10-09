import type { TPayment, IBuyer, TErrors } from "../../types";

export class Buyer implements IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  errorList: TErrors;

  constructor(
    payment: TPayment,
    email: string,
    phone: string,
    address: string,
  ) {
    this.payment = payment;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.errorList = {};
  }

  //Методы
  //сохранение данных в модели. Один общий метод или отдельные методы для каждого поля.
  // Важно учесть, что должна быть реализована возможность сохранить только одно значение,
  //  например, только адрес или только телефон, не удалив при этом значения других полей,
  //  которые уже могут храниться в классе;
  setPayment(payment: TPayment): void {
    this.payment = payment;
    this.isValidPayment();
  }

  setEmail(email: string): void {
    this.email = email;
    this.isValidEmail();
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.isValidPhone();
  }

  setAddress(address: string): void {
    this.address = address;
    this.isValidAddress();
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
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";
    this.errorList = {};
  }
  //валидация данных. Обратите внимание, что правила валидации описаны
  // в функциональных требованиях. Поле является валидным, если оно не пустое.
  // Метод валидации должен давать возможность определить не только валидность
  // каждого отдельного поля, но и предоставлять информацию об ошибке,
  // связанной с проверкой конкретного значения.
  isValidPayment(): boolean {
    if (this.payment === "") {
      this.errorList["payment"] = "способ оплаты не выбран";
      return false;
    } else {
      delete this.errorList["payment"];
      return true;
    }
  }

  isValidEmail(): boolean {
    if (this.email === "") {
      this.errorList["email"] = "способ оплаты не выбран";
      return false;
    } else {
      delete this.errorList["email"];
      return true;
    }
  }

  isValidPhone(): boolean {
    if (this.phone === "") {
      this.errorList["phone"] = "номер телефона не указан";
      return false;
    } else {
      delete this.errorList["phone"];
      return true;
    }
  }

  isValidAddress(): boolean {
    if (this.address === "") {
      this.errorList["address"] = "адрес не указан";
      return false;
    } else {
      delete this.errorList["address"];
      return true;
    }
  }

  isValid(): boolean {
    return (
      this.isValidPayment() &&
      this.isValidEmail() &&
      this.isValidPhone() &&
      this.isValidAddress()
    );
  }
}
