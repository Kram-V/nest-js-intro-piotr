import { BadRequestException } from '@nestjs/common';

export class WrongTaskStatusException extends BadRequestException {
  constructor() {
    super('Wrong task status transition!');
  }
}
