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
}