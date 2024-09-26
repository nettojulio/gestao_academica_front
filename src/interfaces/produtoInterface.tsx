export class Produto {
    idProduct: string;
    nameProduct: string;
    brandProduct: string;
    priceProduct: string;
    size: string;
    descriptionProduct: string;
  
    constructor(
      idProduct: string = '',
      nameProduct: string = '',
      brandProduct: string = '',
      priceProduct: string = '',
      size: string = '',
      descriptionProduct: string = ''
    ) {
      this.idProduct = idProduct;
      this.nameProduct = nameProduct;
      this.brandProduct = brandProduct;
      this.priceProduct = priceProduct;
      this.size = size;
      this.descriptionProduct = descriptionProduct;
    }
  }
  