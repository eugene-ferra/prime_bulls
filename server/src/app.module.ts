import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';
import { AdminModuleModule } from './admin-module/admin-module.module.js';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module.js';
import { PostModule } from './post/post.module.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { MailModule } from './mail/mail.module.js';
import { FileModule } from './file/file.module.js';
import { CommentModule } from './comment/comment.module.js';
import { ReviewModule } from './review/review.module.js';
import { CartModule } from './cart/cart.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '../.env', isGlobal: true }),
    AdminModuleModule,
    ProductModule,
    PostModule,
    UserModule,
    AuthModule,
    MailModule,
    FileModule,
    CommentModule,
    ReviewModule,
    CartModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
