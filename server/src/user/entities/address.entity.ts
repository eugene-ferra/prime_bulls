import { Address } from '../types/address.type.js';

export class AddressEntity {
  id: number;
  city: string;
  street: string;
  house: string;
  flat: string;

  constructor(address: Address) {
    this.id = address.id;
    this.city = address.city;
    this.street = address.street;
    this.house = address.houseNumber;
    this.flat = address.flatNumber;
  }
}
