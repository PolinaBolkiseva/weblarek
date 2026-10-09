import type { IProduct } from '../../types';

export class Product implements IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  
  constructor ( id: string,
                description: string,
                image: string,
                title: string,
                category: string,
                price?: number | null) 
  {
    if (id != '')
        this.id = id;
    else 
        throw new Error('id обязательно и должно быть непустой строкой');
    this.description = description;
    this.image = image;
    if (title != '')
        this.title = title;
    else 
        throw new Error(' у товара должно быть наименование (title)');
    this.category = category;
    if (price)
        this.price = price;
    else 
        this.price = null;  
  }

// Методы
  setPrice (newPrice: number): void {
    if (newPrice > 0)
        this.price = newPrice;
    else if (newPrice = 0)
        this.price = null;
  }

  getPrice (): number {
    if (this.price == null)
        return 0;
    else
        return this.price;
  }
}
