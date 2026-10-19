import {test, expect} from '@playwright/test'
import { Pages } from '../pages/pages'
import { windowception_page } from '../pages/challenges/windowception.page'

test.describe('Challenge 9 - Window in a Window!', () => {

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
    test ('Gather the Task Name given, Submit the Task Name given in the Iframe TEST', async({page}) => {
        const myWindowception = new windowception_page(page);

        // Change Webpage to Challenge
        await test.step('Open Challenge 9 Page - Window in Window', async() => {
            await Page.open('c/iframe-basic/');
            await page.waitForTimeout(1*1000);
            expect(page.url()).toContain('c/iframe-basic/');
        })

        // Execute the Task
        await test.step('Obtain the name string given, submit the give name string in the form', async() => {
            expect(await myWindowception.fill_iframe_window()).toBe(true);
        })

        // Set the Challenge Flag
        await test.step('Set Challenge Flag', async() => {
            flag = await myWindowception.get_windowception_flag();
            console.log(flag);
        })

    })

    // Submit Flag TEST
    test ('Submit Window in Window TEST', async({page}) => {
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