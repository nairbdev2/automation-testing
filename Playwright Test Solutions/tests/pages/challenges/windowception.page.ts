import { Pages } from "../pages"
import { Expect } from "@playwright/test"

export class windowception_page extends Pages {
    constructor(page: any) {
        super(page);
    }

    // GETTERS

    //Note: Specify the iframe by using framelocator then use locators freely
    get frame_onPage() {
        return this.page.frameLocator('iframe[id="form-frame"]')
    }
    
    get task_name() {
        return this.page.locator('div[id=task] strong')
    }

    get windowception_flag() {
        return this.page.locator('code[id=flag]')
    }

    get fullname_field() {
        let getFrame = this.frame_onPage;
        return getFrame.locator('input[id="full-name"]')
    }

    get submit_button() {
        let getFrame = this.frame_onPage;
        return getFrame.locator('button[type="submit"]')
    }


    //FUNCTIONS
    public async fill_iframe_window(): Promise<boolean> {
        let flagObtained = false;

        // let myFrame = this.frame_onPage;
        let taskGiven = this.task_name.innerText();

        // console.log("Frame Located?: ", this.frame_onPage);
        // console.log("FullName Field?: ", this.fullname_field.innerText());
        // console.log("Submit button?: ", this.submit_button.innerText());

        await this.fullname_field.fill(await taskGiven);
        await this.submit_button.click();

        //Flag Checker
        try {
            await this.page.getByText('Solved! Your flag').waitFor({state: 'visible', timeout: 5000});
            flagObtained = true;
        } catch {
            flagObtained = false;
            console.log("Failed to Set flagObtained to true.");
        }
        return flagObtained;
    }

    public async get_windowception_flag() {
        return await this.windowception_flag.innerText();
    }

}


