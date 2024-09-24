export class Address {
  street: string;
  number: number;
  neighborhood: string;
  city: string;
  state: string;

  constructor(
    street: string,
    number: number,
    neighborhood: string,
    city: string,
    state: string
  ) {
    this.street = street;
    this.number = number;
    this.neighborhood = neighborhood;
    this.city = city;
    this.state = state;
  }
}

export class Service {
  id: number;
  name: string;
  description: string;
  time: number;
  value: number;

  constructor(id: number, name: string, description: string, time: number, value: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.time = time;
    this.value = value;
  }
}

export class Barbeiro {
  idBarber: string;
  name: string;
  email: string;
  password: string;
  contato: string;
  cpf: string;
  address: Address;
  salary: number;
  admissionDate: string;
  workload: number;
  start: string;
  end: string;
  idServices: number[]; // Alterado para aceitar uma lista de IDs de serviços como strings
  services: Service[]; 
  profilePhoto?: File;

  constructor(
    idBarber: string,
    name: string,
    email: string,
    password: string,
    contato: string,
    cpf: string,
    address: Address,
    salary: number,
    admissionDate: string,
    workload: number,
    start: string,
    end: string,
    idServices: number[], // Alterado para aceitar uma lista de IDs de serviços como strings
    services: Service[],
    profilePhoto?: File
  ) {
    this.idBarber = idBarber;
    this.name = name;
    this.email = email;
    this.password = password,
    this.services= services; 
    this.contato = contato;
    this.cpf = cpf;
    this.address = address;
    this.salary = salary;
    this.start = start;
    this.end = end;
    this.admissionDate = admissionDate;
    this.workload = workload;
    this.idServices = idServices;
    this.profilePhoto = profilePhoto;
  }
}
