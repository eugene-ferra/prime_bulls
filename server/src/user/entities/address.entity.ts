import { ApiProperty } from '@nestjs/swagger';
import { Address } from '../types/address.type.js';

export class AddressEntity {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly city: string;

  @ApiProperty()
  readonly street: string;

  @ApiProperty()
  readonly house: string;

  @ApiProperty()
  readonly flat: string;

  constructor(address: Address) {
    this.id = address.id;
    this.city = address.city;
    this.street = address.street;
    this.house = address.houseNumber;
    this.flat = address.flatNumber;
  }
}
