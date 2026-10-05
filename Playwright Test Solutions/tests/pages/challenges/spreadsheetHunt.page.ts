import { Pages } from '../pages'

export class spreadsheetHunt_page extends Pages {

    constructor (page:any) {
        super(page)
    }

    // Grabbers

    get task_department() {
        return this.page.locator('div[id="task"] strong');
    }

    get next_Button() {
        return this.page.locator('button[id="next"]');
    }

    get total_field() {
        return this.page.locator('input[id="total"]');
    }

    get submit_total_button() {
        return this.page.locator('button[type="submit"]');
    }

    get spreadsheetHunter_flag() {
        return this.page.locator('code[id="flag"]');
    }




    // Functions

    //Get Total Sum from Current Page Function (Usually would pass String specified by Department but for this challenge the task will give department)
    public async get_total() : Promise<number> {
        let totalSum = 0;

        const department = (await this.task_department.innerText()).trim(); // Cast as String 
        const rows = this.page.locator('table[id="data-table"] tbody tr[data-row]');
        const rowCount = await rows.count();
            
        for (let i = 0; i < rowCount; i++) {

            const currentRow = rows.nth(i);

            const currentRowDepartment = (await currentRow.locator('td').nth(2).innerText()).trim(); // Cast as String for Comparison

            //Verify if the department matches the department in the row, if so add to totalSum
            if (department === currentRowDepartment) {
                
                // Parse Value as number and add number to totalSum
                const amountText = (await currentRow.locator('td').nth(3).innerText()).trim();
                totalSum += parseFloat(amountText.replace(/[$,]/g,''));
            }

        }

        return totalSum;
    }

    //Locate Next and get sum (Usually would pass String specified by Department but for this challenge the task will give department)
    public async calculateTotal(): Promise<number> {

        // Initialized Variable to 0
        let totalSum = 0;

        // Grab Next Button
        const next_button = this.next_Button;

        let pageCounter = 1;

        console.log(`Next visible: ${await next_button.isVisible()}`);
        console.log(`Next enabled: ${await next_button.isEnabled()}`);

        // Loop through all Pages until Next button is no longer visible or enabled
        while (await next_button.isVisible() && await next_button.isEnabled()) {


            // Call get_total function to iterate
            totalSum += await this.get_total();

            console.log(`Page ${pageCounter}: ${totalSum}`);
            pageCounter +=1;

            await next_button.click(); // Click on Next button
            await this.page.waitForTimeout(1*1000); //Wait as Button is not ready yet...
        }

        //Get Final Page as it only does next page iterating calculatio
        totalSum += await this.get_total();


        return totalSum;
    }

    public async submitTotal(): Promise<void> {

        const totalSum = await this.calculateTotal(); // Currently a Number
        await this.total_field.fill(totalSum.toString()); // Parse as toString for .fill()
        await this.submit_total_button.click();
        
    }

    public async get_spreadsheet_flag(): Promise<string> {
        return await this.spreadsheetHunter_flag.innerText();
    }



}