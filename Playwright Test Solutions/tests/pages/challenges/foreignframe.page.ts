import { Pages } from '../pages'
import { expect } from '@playwright/test'


export class foreignframe_page extends Pages {
    constructor(page: any) {
        super(page);
    }

    // GETTERS
    get foreignFrame() {
        return this.page.frameLocator('iframe[id=embassy]')
    }

    get code_field() {
        return this.page.locator('input[id=code]')
    }

    get code_submit_button() {
        return this.page.locator('button[type=submit]');
    }

    get foreignframe_flag() {
        return this.page.locator('code[id=flag]');
    }

    get reveal_code_button() {
        let foreignframe = this.foreignFrame;
        return foreignframe.locator('button[id=reveal]');
    }

    get code_from_foreignFrame() {
        let foreignframe = this.foreignFrame;
        return foreignframe.locator('code[id=code-display]')
    }

    
    // FUNCTIONS
    public async fill_iframe(): Promise<boolean> {
        let flagObtained = false;

        //Complete Task
        await this.reveal_code_button.click();
        
        let codeObtained = (await this.code_from_foreignFrame.innerText()).trim();
        await this.code_field.fill(codeObtained);
        await this.code_submit_button.click();        

        //Flag Checker
        try {
            await this.page.getByText('Solved! Your flag').waitFor({state:'visible', timeout: 5000});
            flagObtained = true;
        } catch {
            flagObtained = false;
            console.log("Failed to set FlagObtained to TRUE");
        }
        return flagObtained;
    }

    public async get_foreign_flag() {
        return await this.foreignframe_flag.innerText();
    }


}