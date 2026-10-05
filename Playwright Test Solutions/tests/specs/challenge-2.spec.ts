import { test, expect } from '@playwright/test'
import { Pages } from '../pages/pages'
import { shapeshift_page } from '../pages/challenges/shapeshift.page'

test.describe('Challenge 2', () => {

    test.describe.configure({ mode: 'serial'}); //Run sequential not parallel

    let Page: Pages;
    let flag: string;

    test.beforeEach(async ({page}) => {
        Page = new Pages(page);
        await Page.open(''); //Open Main Webpage which is the localhost
    });

    /** Clicking the button with the randomly generated Dynamic ID */
    test('Clicking the button with the randomly generated Dynamic ID', async ({page}) => {
        const ShapeShift_page = new shapeshift_page(page)

        /** Open the correct Challenge Page and Expect correct output */
        await test.step('Open Shapeshifter Challenge Page', async () => {

            await Page.open('c/dynamic-ids/');
            await page.waitForTimeout(1*1000); // Sleep for 1 second to allow elements to load
            expect (page.url()).toContain('c/dynamic-ids/');
        });

        // Click on the Shapeshifter!!
        await test.step('Click on the Shapeshifter Button', async () => {

            await ShapeShift_page.shapeshifter();
            await page.waitForTimeout(2*1000); 
        });

        /** Grab the Flag */
        await test.step('Get the Shapeshifter flag', async () => {
            flag = await ShapeShift_page.get_shape_shifter_flag();
            console.log(flag);
            await page.waitForTimeout(2*1000);
            expect(page.getByText('Solved! Your flag')).toBeVisible();
        });
    });


    /** Submit the Shape Shifter Flag */
    test ('Submit the Shape Shifter Flag', async ({page}) => {

        await test.step('Open main page', async () => {
            await Page.open(''); //Opens Default Main Page
            await page.waitForTimeout(1*1000); //Sleep for 1 second to allow elements to load
            expect(page.url()).toContain(''); 
        });

        await test.step('Submit Shapeshift Flag', async () => {
            console.log(flag);
            await Page.submit_flag(flag);
        });
    });
});
