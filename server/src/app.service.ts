import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const test = '343';

    console.log(test);

    return 'Hello World!';
  }
}
