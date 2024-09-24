export class Servico {
    id: string;
    name: string;
    description: string;
    value: number;
    time: number;
  
    constructor(
      id: string = '',
      name: string = '',
      description: string = '',
      value: number = 0,
      time: number = 0
    ) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.value = value;
      this.time = time;
    }
  }
  