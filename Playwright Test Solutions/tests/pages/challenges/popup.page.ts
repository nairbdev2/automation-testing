
import { Pages } from '../pages'
import { expect } from '@playwright/test'

export class popup_page extends Pages {
    constructor (page: any) {
        super(page)
    }

    // GETTERS
    get close_overlay_button() {
        return this.page.locator('button[class="close-x"]')
    }

    get cookies_box() {
        return this.page.locator('div[class="row"]');
    }

    get popup_flag() {
        return this.page.locator('code[id=flag]');
    }

    get continue_button() {
        return this.page.locator('button[id="continue"]');
    }


    // FUNCTIONS
    public async popup_handler(): Promise<boolean> {
        let flagObtained = false;
        

        //Note: DIV Overlay is active
        await this.cookies_box.getByText('Accept All').click();

        await expect(this.close_overlay_button).toBeVisible({timeout: 5000}); // Timeout 5 seconds
        await this.close_overlay_button.click();

        //Access Main Div
        await this.continue_button.click();
        
        //Flag Check Here
        try {
            await this.page.getByText('Solved! Your flag').waitFor({state: 'visible', timeout: 5000});
            flagObtained = true;
        } catch {
            flagObtained = false;
        }

        return flagObtained;
    }
    
    public async get_popup_flag() {
        return await this.popup_flag.innerText();
    }

}