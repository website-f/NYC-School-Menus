import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MenuItem } from './menu-items/menu-item.entity';
import { MenusModule } from './menu-items/menus.module';


@Module({
imports: [
ConfigModule.forRoot({ isGlobal: true }),
TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (cfg: ConfigService) => ({
    type: 'sqlite',
    database: cfg.get('DB_PATH') || './db.sqlite',
    entities: [MenuItem],
    synchronize: true, 
  }),
}),
MenusModule,
],
})
export class AppModule {}