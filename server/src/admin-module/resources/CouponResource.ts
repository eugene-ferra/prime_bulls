import { getModelByName } from '@adminjs/prisma';
import { ConfigService } from '@nestjs/config';
import { ResourceWithOptions } from 'adminjs';
import { PrismaService } from '../../prisma/prisma.service.js';
import { requiredFeature } from '../features/requiredValidation.js';

export const createCouponResource = (config: ConfigService): ResourceWithOptions => ({
  resource: { model: getModelByName('Coupon'), client: new PrismaService() },
  options: {
    navigation: 'Orders',
  },
  features: [requiredFeature({ fields: ['code', 'discount', 'expiredAt'] })],
});
