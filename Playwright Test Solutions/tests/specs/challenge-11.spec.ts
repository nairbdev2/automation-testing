import { test, expect } from '@playwright/test'
import { Pages } from '../pages/pages'
import { foreignframe_page } from '../pages/challenges/foreignframe.page'

test.describe('Challenge 11 - Foreign Embassy!', () => {
    
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

    // Main Test
    test ('Reveal the Foreign Embassy Code then Submit the Code!', async({page}) => {
        //Initialized Page
        const myForeignFrame = new foreignframe_page(page);
        
        //Change Webpage to Challenge
        await Page.open('c/iframe-cross-origin/');
        await page.waitForTimeout(1*1000);
        expect(page.url()).toContain('c/iframe-cross-origin/');

        //Execute Task Test
        await test.step('Reveal the Foreign Embassy Code, insert Code into Field, then click Submit', async() => {
            expect(await myForeignFrame.fill_iframe()).toBe(true);
        })

        // Set the Challenge Flag
        await test.step('Set the Challenge Flag', async() => {
            flag = await myForeignFrame.get_foreign_flag();
            console.log(flag);
        })
    })

    // Submit Flag Test 
    test('Submit Foreign Frame TEST', async({page}) => {
        await test.step('Open Main Page', async() => {
            await Page.open('');
            await page.waitForTimeout(2*1000);
        })

        await test.step('Submit the Flag set from Completing Challenge', async() => {
            console.log(flag);
            await Page.submit_flag(flag);
        })
    })

})