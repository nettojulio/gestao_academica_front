export class Estoque {
    idStock: string;
    idProduct: string;
    quantity: number;
    batchNumber: string;
    expirationDate: string;
    acquisitionDate: string;
  
    constructor(
      idStock: string = '',
      idProduct: string = '',
      quantity: number = 0,
      batchNumber: string = '',
      expirationDate: string = '',
      acquisitionDate: string = ''
    ) {
      this.idStock = idStock;
      this.idProduct = idProduct;
      this.quantity = quantity;
      this.batchNumber = batchNumber;
      this.expirationDate = expirationDate;
      this.acquisitionDate = acquisitionDate;
    }
  }
  