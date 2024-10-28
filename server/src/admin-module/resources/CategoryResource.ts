import { getModelByName } from '@adminjs/prisma';
import { owningRelationSettingsFeature, RelationType } from '@adminjs/relations';
import uploadFileFeature from '@adminjs/upload';
import { ResourceWithOptions } from 'adminjs';

import { componentLoader } from '../componentLoader.js';
import { requiredFeature } from '../features/requiredValidation.js';
import { slugifyFeature } from '../features/slugifyFeature.js';
import { MinioProvider } from '../providers/MinioProvider.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ConfigService } from '@nestjs/config';

const showProperties = ['name', 'Icon', 'isActive', 'createdAt', 'relations'];
const listProperties = ['id', 'name', 'Icon', 'isActive', 'createdAt'];
const filterProperties = ['id', 'name', 'isActive', 'createdAt'];
const editProperties = ['name', 'Icon', 'isActive'];

export const createCategoryResource = (config: ConfigService): ResourceWithOptions => ({
  resource: { model: getModelByName('Category'), client: new PrismaService() },
  options: {
    showProperties,
    listProperties,
    filterProperties,
    editProperties,
    navigation: 'Products',
  },
  features: [
    owningRelationSettingsFeature({
      componentLoader,
      licenseKey: config.getOrThrow('ADMIN_JS_LICENSE_KEY'),
      relations: {
        products: {
          type: RelationType.OneToMany,
          target: {
            joinKey: 'category',
            resourceId: 'Product',
          },
        },
      },
    }),
    uploadFileFeature({
      componentLoader,
      provider: new MinioProvider('categories', {
        baseUrl: '',
      }),
      validation: {
        mimeTypes: ['image/png', 'image/svg+xml'],
        maxSize: 1 * 1024 * 1024,
      },
      properties: {
        key: 'iconUrl',
        mimeType: 'mimeType',
        file: 'Icon',
      },
    }),
    slugifyFeature({ slugField: 'slug', slugFromField: 'name' }),
    requiredFeature({ fields: ['name'] }),
  ],
});
