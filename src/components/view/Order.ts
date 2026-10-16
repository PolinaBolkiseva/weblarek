import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Form } from "./Form";
import type { TPayment } from "../../types";

interface IOrderData {
  payment: TPayment | null;
  address: string;
}

interface IOrderActions {
  onSubmit?: () => void;
  onChange?: (data: { field: "payment" | "address"; value: string }) => void;
}

export class Order extends Form<IOrderData> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, actions?: IOrderActions) {
    super(container, actions);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      ".order__buttons .button",
      this.container,
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    );

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        actions?.onChange?.({ field: "payment", value: button.name });
      });
    });

    this.addressInput.addEventListener("input", () => {
      actions?.onChange?.({ field: "address", value: this.addressInput.value });
    });
  }

  protected set payment(value: TPayment | null) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle("button_alt-active", button.name === value);
    });
  }

  protected set address(value: string) {
    this.addressInput.value = value;
  }
}
