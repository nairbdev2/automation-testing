import { Pages } from '../pages'

export class form_gauntlet extends Pages {
    constructor(page:any) {
        super(page)
    }


    // My Getters

    get country_task() {
        return this.page.locator('table[id="wanted"] tbody tr').nth(0).locator('td').nth(1);
    }

    get plan_task() {
        return this.page.locator('table[id="wanted"] tbody tr').nth(1).locator('td').nth(1);
    }

    get newsletter_task() {
        return this.page.locator('table[id="wanted"] tbody tr').nth(2).locator('td').nth(1);
    }

    get startDate_task() {
        return this.page.locator('table[id="wanted"] tbody tr').nth(3).locator('td').nth(1);
    }
    
    get volume_task() {
        return this.page.locator('table[id="wanted"] tbody tr').nth(4).locator('td').nth(1);
    }

    get favoriteColor_task() {
        return this.page.locator('table[id="wanted"] tbody tr').nth(5).locator('td').nth(1);
    }

    // formGauntlet Flag Default Getter
    get formGauntlet_flag () {
        return this.page.locator('code[id=flag]');
    }

    // ********************************** /
    // My Functions 

    /** Fill out the form based on the task */
    public async fillInForm(): Promise<boolean> {
        const countryTask = (await this.country_task.innerText()).toString();
        const planTask = (await this.plan_task.innerText()).toString().toLowerCase();
        const newsletterTask = (await this.newsletter_task.innerText()).toString();
        const startDateTask = (await this.startDate_task.innerText()).toString();
        const volumeTask = (await this.volume_task.innerText()).toString();
        const favoriteColorTask = (await this.favoriteColor_task.innerText()).toString();
        let flagObtained = false;

        //Set Country
        this.page.locator('select[id="country"]').selectOption({label: countryTask});

        //Set Plan
        const planRadio =  this.page.getByRole('radio');
        const radioCount = await planRadio.count();


        for (let i = 0; i < radioCount; i++) {
            let currentRadio = (await planRadio.nth(i).inputValue()).toString();

            if (currentRadio === planTask){
                await planRadio.nth(i).click();
                break;
            }
        }
        
        //Set Newsletter to OFF if task of user says NO
        if (newsletterTask === "NOT subscribed") {
            this.page.getByRole('checkbox').setChecked(false);
        }

        //Set StartDate 
        await this.page.locator('input[id="start-date"]').fill(startDateTask);

        //Set Volume
        await this.page.locator('input[id="volume"]').fill(volumeTask);
        
        //Set Favorite Color
        await this.page.locator('div[class="custom-select"]').click();
        await this.page.locator('div[id="color-picker"] div[class="cs-option"]').filter({hasText: favoriteColorTask}).click();

        // Save the settings!!
        await this.page.getByRole('button').click();

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

    /** Retrieves the Login Flags displayed on the login challenge page */
    public async get_formGauntlet_flag(): Promise<string> {
        return await this.formGauntlet_flag.innerText();
    }

}