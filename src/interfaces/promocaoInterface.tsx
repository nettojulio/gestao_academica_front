export class Promocao {
    id: string;
    name: string;
    totalPrice: string;
    startDate: string;
    endDate: string;
    coupon: string | null;
  
    constructor(
      id: string ='',
      name: string = '',
      totalPrice: string = '',
      startDate: string = '',
      endDate: string = '',
      coupon: string | null = null
    ) {
      this.id=id;
      this.name = name;
      this.totalPrice = totalPrice;
      this.startDate = startDate;
      this.endDate = endDate;
      this.coupon = coupon;
    }
  }
  