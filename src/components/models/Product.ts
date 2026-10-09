import type { IProduct } from '../../types';

class Product implements IProduct {
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
                price?: number) 
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


}
