import { Controller, Get, Query, BadRequestException, Render } from '@nestjs/common';
import { MenusService } from './menus.service';
import { QueryMenusDto } from './dto/query-menus.dto';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  async list(@Query() q: QueryMenusDto) {
    return this.menusService.find(q.mealType);
  }

  @Get('scrape')
  async scrape(@Query('mealType') mealType?: 'breakfast' | 'lunch') {
    if (mealType && !['breakfast', 'lunch'].includes(mealType)) {
      throw new BadRequestException('mealType must be breakfast or lunch');
    }
    const result = await this.menusService.scrapeAndStore(mealType);
    return {
      inserted: result.inserted,
      skipped: result.skipped,
      sources: result.sources,
    };
  }

  @Get('ui')
  @Render('menus')
  async showUI() {
    const menus = await this.menusService.find();

    const grouped = menus.reduce((acc, menu) => {
      if (!acc[menu.mealType]) acc[menu.mealType] = {};
      if (!acc[menu.mealType][menu.date]) acc[menu.mealType][menu.date] = [];
      acc[menu.mealType][menu.date].push(menu.itemName);
      return acc;
    }, {} as Record<string, Record<string, string[]>>);

    const result = Object.entries(grouped).map(([mealType, dates]) => ({
      mealType,
      dates: Object.entries(dates).map(([date, items]) => ({
        date,
        items,
      })),
    }));

    return { menus: result };
  }
}
