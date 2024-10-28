import { getModelByName } from '@adminjs/prisma';
import { owningRelationSettingsFeature, RelationType } from '@adminjs/relations';
import uploadFileFeature from '@adminjs/upload';
import { ResourceWithOptions } from 'adminjs';

import { componentLoader, CustomComponents } from '../componentLoader.js';
import { requiredFeature } from '../features/requiredValidation.js';
import { slugifyFeature } from '../features/slugifyFeature.js';
import { MinioProvider } from '../providers/MinioProvider.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ConfigService } from '@nestjs/config';

const list = ['id', 'title', 'cover', 'coverImageAltText', 'isActive', 'createdAt'];
const show = ['title', 'coverImage', 'coverImageAltText', 'content', 'isActive', 'createdAt', 'relations'];
const filter = ['id', 'title', 'isActive', 'createdAt'];
const edit = ['title', 'coverImage', 'coverImageAltText', 'content', 'isActive'];

export const createPostResource = (config: ConfigService): ResourceWithOptions => ({
  resource: { model: getModelByName('Post'), client: new PrismaService() },
  options: {
    navigation: 'Posts',
    editProperties: edit,
    showProperties: show,
    filterProperties: filter,
    listProperties: list,
    properties: {
      content: { type: 'richtext' },
      cover: {
        isRequired: true,
        components: {
          list: CustomComponents.PreviewImage,
        },
        props: {
          baseUrl: `${config.getOrThrow('MINIO_PROTOCOL')}://${config.getOrThrow('MINIO_HOST')}:${parseInt(config.getOrThrow('MINIO_PORT'))}/posts/`,
          field: 'coverImageUrl',
        },
      },
    },
  },

  features: [
    owningRelationSettingsFeature({
      componentLoader,
      licenseKey: config.getOrThrow('ADMIN_JS_LICENSE_KEY'),
      relations: {
        topics: {
          type: RelationType.ManyToMany,
          junction: {
            joinKey: 'post',
            inverseJoinKey: 'topic',
            throughResourceId: 'PostTopic',
          },
          target: {
            resourceId: 'Topic',
          },
        },
      },
    }),
    uploadFileFeature({
      componentLoader,
      provider: new MinioProvider('posts', {
        baseUrl: '',
      }),
      validation: {
        mimeTypes: ['image/png', 'image/jpg', 'image/jpeg'],
        maxSize: 2 * 1024 * 1024,
      },
      properties: {
        key: 'coverImageUrl',
        mimeType: 'coverMimeType',
        file: 'coverImage',
      },
    }),
    slugifyFeature({ slugField: 'slug', slugFromField: 'title' }),
    requiredFeature({ fields: ['title', 'content'] }),
  ],
});
