import { test, expect } from '@playwright/test'
import { Pages } from '../pages/pages'

test.describe('Reset All Flags', () => {
    test.describe.configure({ mode: 'serial' })

    let Page: Pages

    test.beforeEach(async ({page}) => {
        Page = new Pages(page)
        await Page.open(''); //This Opens the Regular stuff

    })
    
    test('Reset All Flags', async({page}) => {
        await test.step('Reset All Progress in Beginning', async() => {
            await Page.reset_all_flags;
            expect(page.getByText('0 / 19 solved'));
        });
    });

});