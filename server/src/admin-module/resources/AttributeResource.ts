import { getModelByName } from '@adminjs/prisma';
import {
  owningRelationSettingsFeature,
  RelationType,
  targetRelationSettingsFeature,
} from '@adminjs/relations';
import { ResourceWithOptions } from 'adminjs';

import { componentLoader } from '../componentLoader.js';
import { requiredFeature } from '../features/requiredValidation.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ConfigService } from '@nestjs/config';

const listProperties = ['name'];
const showProperties = ['name'];
const editProperties = ['name'];

export const createAttribiteResource = (config: ConfigService): ResourceWithOptions => ({
  resource: { model: getModelByName('Attribute'), client: new PrismaService() },
  options: {
    navigation: 'Products',
    listProperties,
    showProperties,
    editProperties,
  },

  features: [
    targetRelationSettingsFeature(),
    owningRelationSettingsFeature({
      componentLoader,
      licenseKey: config.getOrThrow('ADMIN_JS_LICENSE_KEY'),
      relations: {
        attributes: {
          type: RelationType.OneToMany,
          target: {
            joinKey: 'productAttributes',
            resourceId: 'ProductAttribute',
          },
        },
      },
    }),
    requiredFeature({ fields: ['name'] }),
  ],
});
