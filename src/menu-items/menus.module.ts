import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from './menu-item.entity';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { ScraperService } from './scraper.service';


@Module({
imports: [TypeOrmModule.forFeature([MenuItem])],
controllers: [MenusController],
providers: [MenusService, ScraperService],
})
export class MenusModule {}