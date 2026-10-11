import {test, expect} from '@playwright/test'
import { Pages } from '../pages/pages'
import { form_gauntlet } from '../pages/challenges/formGauntlet.page'

test.describe ('Challenge 4 - Form Gauntlet', () => {

    test.describe.configure({mode: 'serial' })

    let Page: Pages;
    let flag: string;

    // Set Page to Main Page
    test.beforeEach(async ({page}) => {
        Page = new Pages(page);
        await Page.open('');
    });


    /** Fill out the form based on task */

    test('Fill out the Form based on the Task Given', async ({page}) => {
        
        //New form_gauntlet Page
        const formGauntlet = new form_gauntlet(page);

        await test.step('Open the Form Gauntlet Page', async () => {
            await Page.open('c/form-controls/');
            await page.waitForTimeout(1*1000);
            expect(page.url()).toContain('c/form-controls/');
        });

        await test.step ('Complete the form with the given task', async() =>{
            await formGauntlet.fillInForm();
            await page.waitForTimeout(2*1000);
        });

        await test.step('Get Form Gauntlet Flag', async() => {
            flag = await formGauntlet.get_formGauntlet_flag();
            console.log(flag);
            await page.waitForTimeout(2*1000);
            expect(page.getByText('Solved! Your Flag')).toBeVisible();
        });
    });

    test ('Submit Form Gauntlet Flag', async ({page}) => {
        await test.step('Open Default Page', async() => {
            await Page.open('');
            await page.waitForTimeout(2*1000);
        })

        await test.step('Submit The Gauntlet Flag', async() => {
            console.log('flag');
            await Page.submit_flag(flag);
        })

    })

})

