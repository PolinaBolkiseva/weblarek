import { apiProducts } from './utils/data';
import './scss/styles.scss';
import { Buyer } from './components/models/Buyer';
import { ProductCatalog } from './components/models/ProductCatalog';
import { ProductBasket } from './components/models/ProductBasket';

const myBuyer = new Buyer('cash', 'polya-sonya', '+7...', 'Восточная...');
console.log('myBuyer: ', myBuyer.getBuyer()) ;

const myProductCatalog = new ProductCatalog ();
myProductCatalog.setProductList(apiProducts.items); 
console.log('Массив товаров из каталога: ', myProductCatalog.getProductList()) ;

const myProductBasket= new ProductBasket ();
myProductBasket.pushProduct(myProductCatalog.getProductList()[0]);
console.log('Массив товаров из корзины: ', myProductBasket.getProductList()) ;