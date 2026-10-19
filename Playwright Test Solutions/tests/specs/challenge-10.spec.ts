import {test, expect} from '@playwright/test'
import {Pages} from '../pages/pages'
import {frameception_page} from '../pages/challenges/frameception.page'


test.describe('Challenge 10 - Framception!', () => {

    //Set to Serial
    test.describe.configure({mode: 'serial'});

    //Initiate Page & Flag
    let Page: Pages;
    let flag: string;

    //Set to Main Challenge Page
    test.beforeEach(async({page}) => {
        Page = new Pages(page);
        await Page.open('');
    })

    // Main TEST

    test ('Find the Secret Code in Level 3 iframe and submit Code in Level 1 iframe', async ({page}) => {
        const myFrameception = new frameception_page(page);

        // Change Webpage to Challenge
        await test.step('Open Challenge 10 Page - Frameception', async() => {
            await Page.open('c/iframe-nested/');
            await page.waitForTimeout(1*1000);
            expect(page.url()).toContain('c/iframe-nested/');
        })

        // Execute the Task 
        await test.step('Find Secret Code and submit the code!', async() => {
            expect(await myFrameception.fill_iframe()).toBe(true);
        })


        // Set the Challenge Flag
        await test.step('Set Challenge Flag', async() => {
            flag = await myFrameception.get_frameception_flag();
            console.log(flag);
        })
    })

    // Submit Flag TEST
    test ('Submit Frame-ception TEST', async ({page}) => {
        await test.step('Open Main Page', async() => {
            await Page.open('');
            await page.waitForTimeout(2*1000);
        })

        await test.step('Submit The Flag set from Completing Challenge', async() => {
            console.log(flag);
            await Page.submit_flag(flag);
        })
    })
})