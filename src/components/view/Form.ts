import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface IForm {
  valid: boolean;
  errors: string;
}

interface IFormActions {
  onSubmit?: () => void;
}

export class Form<T = object> extends Component<IForm & T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLFormElement, actions?: IFormActions) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );
    this.errorsElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      actions?.onSubmit?.();
    });
  }

  protected set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  protected set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
