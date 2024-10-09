import { getModelByName } from '@adminjs/prisma';
import {
  owningRelationSettingsFeature,
  RelationType,
  targetRelationSettingsFeature,
} from '@adminjs/relations';
import { ResourceWithOptions } from 'adminjs';

import { componentLoader } from '../componentLoader.js';
import { requiredFeature } from '../features/requiredValidation.js';
import { slugifyFeature } from '../features/slugifyFeature.js';
import { PrismaService } from '../../prisma-service/prisma-service.service.js';
import { ConfigService } from '@nestjs/config';

const editProperties = ['name', 'isActive'];
const showProperties = ['name', 'isActive', 'createdAt', 'relations'];
const listProperties = ['name', 'isActive', 'createdAt'];

export const createTopicResource = (config: ConfigService): ResourceWithOptions => ({
  resource: { model: getModelByName('Topic'), client: new PrismaService() },
  options: {
    navigation: 'Posts',
    editProperties,
    showProperties,
    listProperties,
  },
  features: [
    targetRelationSettingsFeature(),
    owningRelationSettingsFeature({
      componentLoader,
      licenseKey: config.getOrThrow('ADMIN_JS_LICENSE_KEY'),
      relations: {
        topics: {
          type: RelationType.ManyToMany,
          junction: {
            joinKey: 'topic',
            inverseJoinKey: 'post',
            throughResourceId: 'PostTopic',
          },
          target: {
            resourceId: 'Post',
          },
        },
      },
    }),
    requiredFeature({ fields: ['name'] }),
    slugifyFeature({ slugField: 'slug', slugFromField: 'name' }),
  ],
});
