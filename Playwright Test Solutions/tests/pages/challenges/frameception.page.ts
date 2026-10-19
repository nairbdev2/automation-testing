
import { Pages } from "../pages"
import { Expect } from "@playwright/test"

export class frameception_page extends Pages {
    constructor(page: any) {
        super(page);
    }

    // GETTERS
    get frame_lvl_1() {
        return this.page.frameLocator('iframe[id="level-1"]');
    }

    get frame_lvl_2() {
        let frame1 = this.frame_lvl_1;
        return frame1.frameLocator('iframe[id="level-2"]');
    }

    get frame_lvl_3() {
        let frame2 = this.frame_lvl_2;
        return frame2.frameLocator('iframe[id="level-3"]');
    }

    get code_field() {
        let mainFrame = this.frame_lvl_1;
        return mainFrame.locator('input[id="code"]');
    }

    get code_submit_button() {
        let mainFrame = this.frame_lvl_1;
        return mainFrame.locator('button[type="submit"]');
    }

    get frameception_flag() {
        return this.page.locator('code[id=flag]');
    }

    get secret_code() {
        let frame3 = this.frame_lvl_3;
        return frame3.locator('strong[id="secret"]')
    }


    // Functions
    public async fill_iframe(): Promise<boolean> {
        let flagObtained = false;

        let secretCode = await this.secret_code.innerText();
        // console.log('Secret Code??: ', secretCode);
        await this.code_field.fill(secretCode);
        await this.code_submit_button.click();

        //Flag Checker
        try {
            await this.page.getByText('Solved! Your flag').waitFor({state: 'visible', timeout: 5000});
            flagObtained = true;
        } catch {
            flagObtained = false;
            console.log("Failed to Set FlagObtained to TRUE.");
        }
        return flagObtained;
    }

    public async get_frameception_flag() {
        return await this.frameception_flag.innerText();
    }

}

