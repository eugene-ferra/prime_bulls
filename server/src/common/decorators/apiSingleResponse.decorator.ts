import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export function ApiSingleResponse<TModel extends Function>(model: TModel) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status: 200,
      schema: {
        properties: {
          status: {
            type: 'number',
          },
          body: {
            type: 'object',
            $ref: getSchemaPath(model),
          },
        },
      },
    }),
  );
}
