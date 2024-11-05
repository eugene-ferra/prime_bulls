import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { Pagination } from '../types/IPagination.type.js';

export function ApiPaginatedResponse<TModel extends Function>(model: TModel) {
  return applyDecorators(
    ApiExtraModels(Pagination, model),
    ApiResponse({
      status: 200,
      schema: {
        properties: {
          status: {
            type: 'number',
          },
          body: {
            allOf: [
              {
                $ref: getSchemaPath(Pagination),
              },
              {
                properties: {
                  docs: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                },
              },
            ],
          },
        },
      },
    }),
  );
}
