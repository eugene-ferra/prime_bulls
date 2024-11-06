import { Module } from '@nestjs/common';
import { UserService } from './services/user.service.js';
import { UserController } from './controllers/user.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { FileModule } from '../file/file.module.js';
import { ProductModule } from '../product/product.module.js';
import { AddressService } from './services/address.service.js';
import { PasswordService } from './services/password.service.js';
import { AvatarService } from './services/avatar.service.js';
import { FavouriteService } from './services/favourite.service.js';
import { UserHelperService } from './services/userHelper.service.js';
import { AddressController } from './controllers/address.controller.js';
import { AvatarController } from './controllers/avatar.controller.js';
import { FavouriteController } from './controllers/favourite.controller.js';

@Module({
  imports: [FileModule, ProductModule],
  controllers: [UserController, AddressController, AvatarController, FavouriteController],
  providers: [
    PrismaService,
    UserService,
    AddressService,
    PasswordService,
    AvatarService,
    FavouriteService,
    UserHelperService,
  ],
  exports: [UserService],
})
export class UserModule {}
