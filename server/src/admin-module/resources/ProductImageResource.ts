import { getModelByName } from '@adminjs/prisma';
import { targetRelationSettingsFeature } from '@adminjs/relations';
import uploadFileFeature from '@adminjs/upload';
import { ResourceWithOptions } from 'adminjs';

import { componentLoader, CustomComponents } from '../componentLoader.js';
import { requiredFeature } from '../features/requiredValidation.js';
import { MinioProvider } from '../providers/MinioProvider.js';
import { PrismaService } from '../../prisma-service/prisma-service.service.js';
import { ConfigService } from '@nestjs/config';

const listProperties = ['Cover', 'mimeType', 'altText'];
const editProperties = ['Image', 'altText', 'product'];

export const createProductImageResource = (config: ConfigService): ResourceWithOptions => ({
  resource: { model: getModelByName('ProductImage'), client: new PrismaService() },
  options: {
    listProperties,
    editProperties,
    properties: {
      Cover: {
        components: {
          list: CustomComponents.PreviewImage,
        },
        props: {
          baseUrl: `${config.getOrThrow('MINIO_PROTOCOL')}://${config.getOrThrow('MINIO_HOST')}:${parseInt(config.getOrThrow('MINIO_PORT'))}/products/`,
          field: 'url',
        },
      },
    },
    actions: {
      list: {
        isAccessible: false,
        isVisible: false,
      },
      show: {
        isAccessible: false,
        isVisible: false,
      },
    },
  },

  features: [
    targetRelationSettingsFeature(),
    uploadFileFeature({
      componentLoader,
      provider: new MinioProvider('products', {
        baseUrl: '',
      }),
      validation: {
        mimeTypes: ['image/png', 'image/jpg', 'image/jpeg'],
        maxSize: 2 * 1024 * 1024,
      },
      properties: {
        key: 'url',
        file: 'Image',
        mimeType: 'mimeType',
      },
    }),
    requiredFeature({ fields: ['product'] }),
  ],
});
