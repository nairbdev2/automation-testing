import { Pages } from '../pages'

export class shapeshift_page extends Pages {
    
    /** Constructor inheriting from Pages */
    constructor(page:any) {
        super(page)
    }
    
    // Grabs the Challenge Task Text
    get challenge_task() {
        return this.page.locator('div[id="task"] strong').innerText();
    }


    /** Grabs the Flag */
    get shape_shift_flag() {
        return this.page.locator('code[id=flag]');
    }


    // Functions
    /** Execute the shapeshifter challenge */
    public async shapeshifter(): Promise<boolean> {
        let flagObtained = false;

        //Get Challenge Task
        const challenge_task_text = await this.challenge_task;

        //Click on the Challenge Task
        await this.page.getByRole('button', {name: challenge_task_text}).click();

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

    /** Return the Flag Data */
    public async get_shape_shifter_flag(): Promise<string> {
        return await this.shape_shift_flag.innerText();
    }

}