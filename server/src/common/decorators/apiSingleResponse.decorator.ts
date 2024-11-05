import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export function ApiSingleResponse<TModel extends Function>(model: TModel, status = 200) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status: status,
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
