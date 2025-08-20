import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { MealType } from './menu-item.entity';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async scrapeMenus(mealType?: MealType) {
    const results: any[] = [];

    const urls: { [key in MealType]: string } = {
      breakfast: process.env.BREAKFAST_URL!,
      lunch: process.env.LUNCH_URL!,
    };

    const types = mealType ? [mealType] : (['breakfast', 'lunch'] as MealType[]);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    for (const type of types) {
      const url = urls[type];
      this.logger.log(`Opening page: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2' });

      await page.waitForSelector('#menuTable tbody');

      const items = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('#menuTable tbody tr'));
        const menuItems: { date: string; itemName: string }[] = [];

        rows.forEach(row => {
          const dateCell = row.querySelector('td[scope="row"]');
          const ul = row.querySelector('td ul');

          if (!dateCell || !ul) return;

          const dateText = dateCell.textContent?.trim() ?? '';
          const liItems = Array.from(ul.querySelectorAll('li')).map(li => li.textContent?.trim() ?? '');

          liItems.forEach(itemName => {
            menuItems.push({ date: dateText, itemName });
          });
        });

        return menuItems;
      });

      this.logger.log(`Scraped ${items.length} items for ${type}`);

      results.push({
        mealType: type,
        sourceUrl: url,
        items,
      });
    }

    await browser.close();
    return results;
  }
}
