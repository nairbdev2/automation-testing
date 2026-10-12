import { expect } from '@playwright/test';
import { Pages } from '../pages'

export class patience_grasshoper extends Pages {
    constructor (page: any) {
        super(page)
    }


    get claim_button() {
        return this.page.locator('button[class="claim"]')
    }

    
    get patience_grasshopper_flag() {
        return this.page.locator('code[id=flag]');
    }


    /** Click Claim Button when Available */
    public async claim_available_button(): Promise<void> {

        const myClaimButton = this.claim_button;

        //If Disabled just wait using expect until Enabled to click timeout 11 seconds
        await expect(myClaimButton).toBeEnabled({timeout: 11000});
        await myClaimButton.click();
    }

    public async get_patience_grasshopper_flag(): Promise<string> {
        return await this.patience_grasshopper_flag.innerText();
    }

}