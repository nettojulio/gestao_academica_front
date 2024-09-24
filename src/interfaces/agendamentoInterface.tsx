// agendamentoInterface.ts

import { Service } from "@/interfaces/barbeiroInterface";

export interface Agendamento {
  clientName: string;
  clientNumber: string;
  barber: {
    idBarber: string;
    name: string;
    email: string;
    cpf: string;
    address: {
      street: string;
      city: string;
      neighborhood: string;
      number: number;
      state: string;
    };
    salary: number;
    admissionDate: string;
    workload: number;
    services: Service[];
    contato: string;
    idServices: number[];
    password: string;
    start: string;
    end: string;
  };
  serviceType: {
    idService: number;
    nameService: string;
    descriptionService: string;
    valueService: number;
    timeService: {
      hour: number;
      minute: number;
      second: number;
      nano: number;
    };
  }[];
  startTime: string;
  endTime: string;
}
