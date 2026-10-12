import {test, expect} from '@playwright/test'
import { Pages } from '../pages/pages'
import { patience_grasshoper } from '../pages/challenges/patienceGrasshopper.page'


test.describe('Challenge 5 - Paitence Grasshopper', () => {

    test.describe.configure({mode: 'serial'});

    let Page: Pages;
    let flag: string;

    test.beforeEach(async({page}) => {
        Page = new Pages(page);
        await Page.open('');
    })

    test('Wait for the Button to be enabled and then Click when ready', async ({page}) => {

        const myPatience_Grasshoper = new patience_grasshoper(page);

        await test.step('Open the Challenge 5 - Patience Grasshoper Page', async() => {
            await Page.open('c/delayed-element/');
            await page.waitForTimeout(1*1000);
            expect(page.url()).toContain('c/delayed-element/');
        })


        await test.step('Click on Claim when Ready', async() => {
            await myPatience_Grasshoper.claim_available_button();
        })

        await test.step('Get Challenge 5 Flag', async() => {
            flag = await myPatience_Grasshoper.get_patience_grasshopper_flag();
            console.log(flag);
            await page.waitForTimeout(2*1000);
            expect(page.getByText('Solved! Your flag')).toBeVisible();
        })
    })

    test('Submit Patience Grasshoper Flag ', async({page}) => {

        await test.step('Open Main Page', async() => {
            await Page.open('');
            await page.waitForTimeout(2*1000);
        })

        await test.step('Submit Paitence Grasshoper Flag', async () => {
            console.log(flag);
            await Page.submit_flag(flag);
        })
    })
})
