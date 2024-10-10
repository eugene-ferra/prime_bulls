import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseQueryPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        const parsedArray = this.parseArray(value[key]);
        if (parsedArray) {
          value[key] = parsedArray;
        }

        if (value[key] === 'true' || key === 'false') value[key] = key === 'true';
        if (!isNaN(+value[key])) value[key] = +value[key];
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
