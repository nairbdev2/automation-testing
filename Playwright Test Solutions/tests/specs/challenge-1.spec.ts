import { test, expect } from '@playwright/test'
import { Pages } from '../pages/pages'
import { login_page } from '../pages/challenges/login.page'


test.describe('Challenge 1', () => {
    test.describe.configure({ mode: 'serial' })

    let Page: Pages
    let flag: string

    test.beforeEach(async ({page}) => {
        Page = new Pages(page)
        await Page.open(''); //This Opens the Regular stuff

    })
    
    test('Login with retrieved credentials', async ({page}) => {
        const Login_page = new login_page(page)

        await test.step('Open login page', async () => {
            await Page.open('/c/login')
            await page.waitForTimeout(1*1000)
            expect(page.url()).toContain('/c/login')
        })

        let credentials = await Login_page.get_credentials()
        await test.step('Get Credentials', async () => {
            expect(credentials).toBeDefined()
            console.log(credentials)
        })

        await test.step('Complete login with credentials', async () => {
            await Login_page.login(credentials.user, credentials.pass)
            await page.waitForTimeout(2*1000)
        })

        await test.step('Get login flag', async () => {
            flag = await Login_page.get_login_flag()
            console.log(flag)
        })
    })

    test('Submit login flag', async ({page}) => {

        await test.step('open default page', async () => {
            await Page.open('')
            await page.waitForTimeout(1*1000)
        })

        await test.step('Submit login flag', async () => {
            console.log(flag)
            await Page.submit_flag(flag)
        })
    })
})