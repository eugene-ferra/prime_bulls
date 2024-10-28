import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseQueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        if (typeof value[key] === 'string') {
          const parsedArray = this.parseArray(value[key]);
          if (parsedArray) {
            value[key] = parsedArray;
          }
        }

        if (!isNaN(+value[key])) value[key] = +value[key];
        if (value[key] === 'true' || value[key] === 'false') value[key] = value[key] === 'true';
      }
    }

    return value;
  }

  private parseArray(value: string): number[] | null {
    const parsedArray = value
      .split(',')
      .map((num) => {
        const parsedNum = Number(num.trim());
        return isNaN(parsedNum) ? null : parsedNum;
      })
      .filter((num) => num !== null);

    return parsedArray.length > 0 ? parsedArray : null;
  }
}
