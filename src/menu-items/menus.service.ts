import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem, MealType } from './menu-item.entity';
import { ScraperService } from './scraper.service';

@Injectable()
export class MenusService {
  private readonly logger = new Logger(MenusService.name);

  constructor(
    @InjectRepository(MenuItem) private repo: Repository<MenuItem>,
    private scraper: ScraperService,
  ) {}

  async find(mealType?: MealType) {
    const where = mealType ? { mealType } : {};
    return this.repo.find({
      where,
      order: { date: 'ASC', mealType: 'ASC', id: 'ASC' },
    });
  }

  async scrapeAndStore(mealType?: MealType) {
    this.logger.log(`Starting scrape for mealType: ${mealType ?? 'ALL'}`);

    const batches = await this.scraper.scrapeMenus(mealType);

    this.logger.log(`Scraper returned ${batches.length} batches`);
    this.logger.debug(`Batches content: ${JSON.stringify(batches, null, 2)}`);

    let inserted = 0,
      skipped = 0;

    for (const batch of batches) {
      this.logger.log(
        `Processing batch for mealType=${batch.mealType}, sourceUrl=${batch.sourceUrl}, items=${batch.items.length}`,
      );

      for (const item of batch.items) {
        try {
          this.logger.debug(
            `Inserting item: date=${item.date}, itemName=${item.itemName}, mealType=${batch.mealType}`,
          );

          await this.repo.insert({
            mealType: batch.mealType,
            date: item.date,
            itemName: item.itemName,
            sourceUrl: batch.sourceUrl,
          });

          inserted++;
        } catch (e: any) {
          this.logger.warn(
            `Skipped duplicate/failed insert: ${item.itemName} (${e.message})`,
          );
          skipped++;
        }
      }
    }

    this.logger.log(
      `Scraping finished. Inserted=${inserted}, Skipped=${skipped}`,
    );

    return { inserted, skipped, sources: batches.map((b) => b.sourceUrl) };
  }
}
