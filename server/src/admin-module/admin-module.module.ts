import { Module } from '@nestjs/common';

import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/prisma';
import { createProductResource } from './resources/ProductResource.js';
import { createProductVariantResource } from './resources/ProductVariantResource.js';
import { createCategoryResource } from './resources/CategoryResource.js';
import { createAttribiteResource } from './resources/AttributeResource.js';
import { createProductAttribiteResource } from './resources/ProductAttribute.js';
import { createProductImageResource } from './resources/ProductImageResource.js';
import { createVaraintResource } from './resources/VariantResource.js';
import { createPostResource } from './resources/PostResource.js';
import { createTopicResource } from './resources/TopicResource.js';
import { createPostTopicResource } from './resources/PostTopicResource.js';
import { AdminModule } from '@adminjs/nestjs';
import { componentLoader } from './componentLoader.js';
import { dark, light } from '@adminjs/themes';
import { ConfigService } from '@nestjs/config';

AdminJS.registerAdapter({
  Resource: Resource,
  Database: Database,
});

@Module({
  imports: [
    AdminModule.createAdminAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [
            createProductResource(config),
            createProductVariantResource(),
            createCategoryResource(config),
            createAttribiteResource(config),
            createProductAttribiteResource(config),
            createProductImageResource(config),
            createVaraintResource(config),
            createPostResource(config),
            createTopicResource(config),
            createPostTopicResource(),
          ],
          componentLoader: componentLoader,
          availableThemes: [light, dark],
          defaultTheme: 'dark',
          branding: {
            companyName: 'Prime Bulls',
          },
        },
        // TODO implement advanced role-based auth
        auth: {
          authenticate: async (email: string, password: string) => {
            const DEFAULT_ADMIN = {
              email: config.getOrThrow('ADMIN_JS_LOGIN'),
              password: config.getOrThrow('ADMIN_JS_PASSWORD'),
            };

            if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
              return Promise.resolve(DEFAULT_ADMIN);
            }
            return null;
          },
          cookiePassword: config.getOrThrow('ADMIN_JS_SECRET'),
          cookieName: 'adminjs',
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: config.getOrThrow('ADMIN_JS_SECRET'),
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AdminModuleModule {}
