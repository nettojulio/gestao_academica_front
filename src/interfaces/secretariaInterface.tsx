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



export class Secretaria {
  idSecretary: string;
  name: string;
  email: string;
  password: string;
  contact: string;
  cpf: string;
  address: Address;
  salary: number;
  admissionDate: string;
  workload: number;
  start: string;
  end: string;
  profilePhoto?: File;

  constructor(
    idSecretary: string,
    name: string,
    email: string,
    password: string,
    contact: string,
    cpf: string,
    address: Address,
    salary: number,
    admissionDate: string,
    workload: number,
    start: string,
    end: string,
    profilePhoto?: File
  ) {
    this.idSecretary = idSecretary;
    this.name = name;
    this.email = email;
    this.password = password,
    this.contact = contact;
    this.cpf = cpf;
    this.address = address;
    this.salary = salary;
    this.start = start;
    this.end = end;
    this.admissionDate = admissionDate;
    this.workload = workload;
    this.profilePhoto = profilePhoto;
  }
}
