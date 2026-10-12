import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Base page class for all page objects.
 */
export class Pages {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Gets the flag input field locator.
     */
    get flag_field() {
        return this.page.locator(`input[id="flag-input"]`)
    }

    /**
     * Gets the submit button locator.
     */
    get submit_button() {
        return this.page.locator(`button[id="flag-submit"]`)
    }

    /**
     * Gets Reset Button locator.
     */
    get reset_all_button() {
        return this.page.locator('button[id="reset"]');
    }

    get reset_confirm_button() {
        return this.page.locator('button[id="reset-confirm"]')
    }

    /** Opens the specified path in the browser.
     * @param path The path to open.
     */
    async open(path:string) {
        await this.page.goto(path);
    }

    /**
     * Submits the provided flag using the flag input field and submit button.
     * @param flag The flag to submit.
     */
    async submit_flag(flag: string) {
        await this.flag_field.fill(flag)
        await this.submit_button.click()
        await this.page.waitForTimeout(2*1000)
    }

    /** Reset Progress on main page */

    async reset_all_flags() {
        await this.page.goto('');
        await this.reset_all_button.click();
        await this.page.waitForTimeout(1*1000);
        await this.reset_confirm_button.click();
    }

}