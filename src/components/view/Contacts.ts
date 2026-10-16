import { ensureElement } from "../../utils/utils";
import { Form } from "./Form";

interface IContactsData {
  email: string;
  phone: string;
}

interface IContactsActions {
  onSubmit?: () => void;
  onChange?: (data: { field: "email" | "phone"; value: string }) => void;
}

export class Contacts extends Form<IContactsData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, actions?: IContactsActions) {
    super(container, actions);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );

    this.emailInput.addEventListener("input", () => {
      actions?.onChange?.({ field: "email", value: this.emailInput.value });
    });

    this.phoneInput.addEventListener("input", () => {
      actions?.onChange?.({ field: "phone", value: this.phoneInput.value });
    });
  }

  protected set email(value: string) {
    this.emailInput.value = value;
  }

  protected set phone(value: string) {
    this.phoneInput.value = value;
  }
}
