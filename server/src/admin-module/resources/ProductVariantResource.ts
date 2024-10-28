import { getModelByName } from '@adminjs/prisma';
import { targetRelationSettingsFeature } from '@adminjs/relations';
import { ResourceWithOptions } from 'adminjs';

import { requiredFeature } from '../features/requiredValidation.js';
import { PrismaService } from '../../prisma/prisma.service.js';

export const createProductVariantResource = (): ResourceWithOptions => ({
  resource: { model: getModelByName('ProductVariant'), client: new PrismaService() },
  options: {
    navigation: 'Products',
    properties: {},
    listProperties: ['variant', 'label', 'effectType', 'amount'],
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
    requiredFeature({ fields: ['label', 'variant', 'product', 'amount'] }),
  ],
});
