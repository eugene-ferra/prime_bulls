import { getModelByName } from '@adminjs/prisma';
import { targetRelationSettingsFeature } from '@adminjs/relations';
import { ResourceWithOptions } from 'adminjs';
import { PrismaService } from '../../prisma-service/prisma-service.service.js';

export const createPostTopicResource = (): ResourceWithOptions => ({
  resource: { model: getModelByName('PostTopic'), client: new PrismaService() },
  options: { actions: { list: { isVisible: false, isAccessible: false } } },
  features: [targetRelationSettingsFeature()],
});
