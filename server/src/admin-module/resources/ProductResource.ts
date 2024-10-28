import { getModelByName } from '@adminjs/prisma';
import {
  owningRelationSettingsFeature,
  RelationType,
  targetRelationSettingsFeature,
} from '@adminjs/relations';
import uploadFileFeature from '@adminjs/upload';
import { ResourceWithOptions } from 'adminjs';

import { componentLoader, CustomComponents } from '../componentLoader.js';
import { requiredFeature } from '../features/requiredValidation.js';
import { slugifyFeature } from '../features/slugifyFeature.js';
import { MinioProvider } from '../providers/MinioProvider.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ConfigService } from '@nestjs/config';

const list = ['id', 'cover', 'basePrice', 'salePercent', 'title', 'category', 'isActive', 'createdAt'];
const show = [
  'title',
  'basePrice',
  'salePercent',
  'subtitle',
  'coverImage',
  'coverImageAltText',
  'description',
  'category',
  'isActive',
  'createdAt',
  'relations',
];
const edit = [
  'title',
  'subtitle',
  'basePrice',
  'salePercent',
  'coverImage',
  'coverImageAltText',
  'description',
  'category',
  'isActive',
];
const filter = ['id', 'title', 'basePrice', 'category', 'isActive', 'createdAt'];

export const createProductResource = (config: ConfigService): ResourceWithOptions => ({
  resource: { model: getModelByName('Product'), client: new PrismaService() },
  options: {
    navigation: 'Products',
    showProperties: show,
    listProperties: list,
    filterProperties: filter,
    editProperties: edit,
    properties: {
      description: { type: 'richtext' },
      cover: {
        isRequired: true,
        components: {
          list: CustomComponents.PreviewImage,
        },
        props: {
          baseUrl: `${config.getOrThrow('MINIO_PROTOCOL')}://${config.getOrThrow('MINIO_HOST')}:${parseInt(config.getOrThrow('MINIO_PORT'))}/products/`,
          field: 'coverImageUrl',
        },
      },
    },
  },
  features: [
    targetRelationSettingsFeature(),
    owningRelationSettingsFeature({
      componentLoader,
      licenseKey: config.getOrThrow('ADMIN_JS_LICENSE_KEY'),
      relations: {
        variants: {
          type: RelationType.OneToMany,
          target: {
            joinKey: 'product',
            resourceId: 'ProductVariant',
          },
        },
        attributes: {
          type: RelationType.OneToMany,
          target: {
            joinKey: 'product',
            resourceId: 'ProductAttribute',
          },
        },
        images: {
          type: RelationType.OneToMany,
          target: {
            joinKey: 'product',
            resourceId: 'ProductImage',
          },
        },
      },
    }),
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
        file: 'coverImage',
        key: 'coverImageUrl',
        mimeType: 'coverImageMimeType',
      },
    }),
    slugifyFeature({ slugField: 'slug', slugFromField: 'title' }),
    requiredFeature({ fields: ['title', 'basePrice', 'description', 'category'] }),
  ],
});
