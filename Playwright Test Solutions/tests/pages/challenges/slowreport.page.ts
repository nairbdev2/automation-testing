import { Pages } from '../pages';

export class slow_report extends Pages {
    constructor (page: any) {
        super (page)
    }


    //Getters
    get generate_report_button() {
        return this.page.locator('button[id="generate"]'); 
    }

    get submit_code_button() {
        return this.page.locator('button[type="submit"]');
    }

    get report_code() {
        return this.page.locator('strong[id="report"]');
    }

    get submit_field() {
        return this.page.locator('input[id="report-code"]');
    }

    //Getter Flag
    get slow_report_flag() {
        return this.page.locator('code[id=flag]');
    }


    //My Functions

    public async generate_submit_report(): Promise<boolean> {
        let flagObtained = false;
        let generateReports = this.generate_report_button;
        let reportCode: string;

        //Click on GenerateReports
        await generateReports.click();
        //Wait for the spinner to go back to hidden then grab innerText for reportcode
        await this.page.locator('div[id="spinner"]').waitFor({state: 'hidden'});

        reportCode = await this.report_code.innerText();

        await this.submit_field.fill(reportCode);
        await this.submit_code_button.click();

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


    //Get Flag Default
    public async get_slow_report_flag(): Promise<string> {
        return await this.slow_report_flag.innerText();
    }

}