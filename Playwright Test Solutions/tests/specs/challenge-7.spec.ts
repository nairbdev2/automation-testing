
import {test, expect} from '@playwright/test'
import { Pages } from '../pages/pages'
import { endless_feed } from '../pages/challenges/endlessfeed.page'

test.describe ('Challenge 7 - Endless Feed', () => {

    //Set to Serial
    test.describe.configure({mode:'serial'});

    //Initiate Page & Flag
    let Page: Pages;
    let flag: string;

    //Set To Main Challenge Page
    test.beforeEach(async({page}) => {
        Page = new Pages(page);
        await Page.open('');
    })


    test ('Grab the given task to select and scroll down and click on button and get Flag', async({page}) => {
        const myEndless_feed = new endless_feed(page);

        await test.step('Open Challenge 7 - Endless Feed Page', async () => {
            await Page.open('c/infinite-scroll/');
            await page.waitForTimeout(1*1000);
            expect(page.url()).toContain('c/infinite-scroll/');
        })

        await test.step('Scroll and Click on the button', async() => {
            //Make sure the flag obtained and true
            expect(await myEndless_feed.scroll()).toBe(true);
        })

        await test.step('Set Challenge Flag', async() => {
            flag = await myEndless_feed.get_endless_feed_flag();
            console.log(flag);
            await page.waitForTimeout(2*1000);
            //Removed expect since checked on page object file with boolean
            //expect(page.getByText('Solved! Your flag')).toBeVisible();
        })
    })

    test ('Submit Endless Feed Flag Test', async ({page}) => {
        await test.step('Open Main Page', async() => {
            await Page.open('');
            await page.waitForTimeout(2*1000);
            //expect(page.url()).toContain('');
        })

        await test.step('Submit the Flag set from completing challenge', async () => {
            console.log(flag);
            await Page.submit_flag(flag);
        })
    })


});
