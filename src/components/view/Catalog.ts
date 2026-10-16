// src/components/views/Catalog.ts
import { Component } from '../base/Component';

// Данные каталога — готовые DOM-элементы карточек.
interface ICatalog {
  items: HTMLElement[];
}

// VIEW — список карточек. Про товары не знает ничего:
// принимает готовые элементы и раскладывает их в контейнере.
export class Catalog extends Component<ICatalog> {
  constructor(container: HTMLElement) {
    super(container);
  }

  // Сеттер protected: снаружи компонент обновляется только через render().
  protected set items(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}