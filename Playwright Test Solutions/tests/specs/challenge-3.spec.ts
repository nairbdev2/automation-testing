import {test, expect} from '@playwright/test'
import {Pages} from '../pages/pages'
import {spreadsheetHunt_page} from '../pages/challenges/spreadsheetHunt.page'

test.describe ('Challenge 3', () => {

    test.describe.configure ({ mode: 'serial' }) // Run sequential not parallel

    let Page: Pages
    let flag: string

    test.beforeEach(async ({page}) => {
        Page = new Pages(page);
        await Page.open(''); // Open Main Webpage which is the localhost
    });

    test ('Open the spreadsheet Hunt Challenge Page and scrape the table', async ({page}) => { 
        const spreadsheethunt_page = new spreadsheetHunt_page(page);

        await test.step('Open the Spreadsheet Hunt Page and Expect correct output', async () => {
            await Page.open('c/table-scrape/');
            await page.waitForTimeout(1*1000);
            expect(page.url()).toContain('c/table-scrape/');
        });

        await test.step('Gather Sum of all Pages based on Task Department', async () => {
            await spreadsheethunt_page.submitTotal();
            await page.waitForTimeout(2*1000);
        });

        await test.step('Get SpreadSheet Hunter Flag', async () => {
            flag = await spreadsheethunt_page.get_spreadsheet_flag();
            console.log(flag);
            await page.waitForTimeout(2*1000);
            expect(page.getByText('Solved! Your flag')).toBeVisible();
        });
    });

    test ('Submit SpreadSheet Hunter Flag', async ({page}) => {
        await test.step('Open Default Page', async () => {
            await Page.open('');
            await page.waitForTimeout(1*1000);
        });

        await test.step('Submit Spreadsheet Hunter Flag', async () => {
            console.log(flag);
            await Page.submit_flag(flag);
        });

    });
});
