import {test, expect} from '@playwright/test'
import { Pages } from '../pages/pages'
import { popup_page } from '../pages/challenges/popup.page'

test.describe('Challenge 8 - Popup Challenge!', () => {


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

    //Main Test
    test ('Accept the Cookies, Reject Newsletter, then Click on Continue Button TEST', async ({page}) => {
        const myPopup_page =  new popup_page(page);

        await test.step('Open Challenge 8 Page - Popup Page', async() => {
            await Page.open('c/overlays/');
            await page.waitForTimeout(1*1000);
            expect(page.url()).toContain('c/overlays/');
        })

        await test.step('Accept Cookies Reject Popup, and Click Continue', async() => {
            //await page.waitForTimeout(2*1000);
            expect(await myPopup_page.popup_handler()).toBe(true);

        })
        
        await test.step('Set Challenge Flag', async() => {
            flag = await myPopup_page.get_popup_flag();
            console.log(flag);
        })
    })
    
    // Submit Flag Test
    test ('Submit Popup Flag TEST', async ({page}) => {
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