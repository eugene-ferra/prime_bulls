import { getModelByName } from '@adminjs/prisma';
import {
  owningRelationSettingsFeature,
  RelationType,
  targetRelationSettingsFeature,
} from '@adminjs/relations';
import { ResourceWithOptions } from 'adminjs';

import { componentLoader } from '../componentLoader.js';
import { requiredFeature } from '../features/requiredValidation.js';
import { PrismaService } from '../../prisma-service/prisma-service.service.js';
import { ConfigService } from '@nestjs/config';

const listProperties = ['attribute', 'value'];
const showProperties = ['attribute', 'value'];
const editProperties = ['attribute', 'value', 'product'];

export const createProductAttribiteResource = (config: ConfigService): ResourceWithOptions => ({
  resource: { model: getModelByName('ProductAttribute'), client: new PrismaService() },
  options: {
    showProperties,
    listProperties,
    editProperties,
    actions: {
      list: {
        isVisible: false,
        isAccessible: false,
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
            resourceId: 'Attribute',
          },
        },
      },
    }),
    requiredFeature({ fields: ['attribute', 'value', 'product'] }),
  ],
});
