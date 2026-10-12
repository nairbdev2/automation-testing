import {test, expect} from '@playwright/test'
import {Pages} from '../pages/pages'
import {slow_report} from '../pages/challenges/slowreport.page'


test.describe('Challenge 6 - Slow Report', () => {


    test.describe.configure({mode: 'serial'});

    let Page: Pages;
    let flag: string;

    test.beforeEach(async({page}) => {
        Page = new Pages(page);
        await Page.open('');
    });

    test('Generate the Report and wait then Submit the Report', async ({page}) => {
        const mySlowReport = new slow_report(page);

        await test.step('Open the Challenge 6 - Slow Report Page', async() => {
            await Page.open('c/async-load/');
            await page.waitForTimeout(1*1000);
            expect(page.url()).toContain('c/async-load/');
        })

        await test.step('Run the Report and Submit after waiting!', async() => {
            await mySlowReport.generate_submit_report();
        })

        await test.step('Get the Challenge 6 Flag', async () => {
            flag = await mySlowReport.get_slow_report_flag();
            console.log(flag);
            await page.waitForTimeout(2*1000);
            expect(page.getByText('Solved! Your flag')).toBeVisible();
        })
    })

    
    // Submit Flag
    test ('Submit Challenge 6 Flag to Open  Main Page', async({page}) => {
        await test.step('Open Main Page', async() => {
            await Page.open('');
            await page.waitForTimeout(2*1000);
        })

        await test.step('Submit Slow Report Flag', async() => {
            console.log(flag);
            await Page.submit_flag(flag);
        });
    });
})