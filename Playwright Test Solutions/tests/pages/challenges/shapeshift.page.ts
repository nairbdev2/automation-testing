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
    public async shapeshifter(): Promise<void> {

        //Get Challenge Task
        const challenge_task_text = await this.challenge_task;

        //Click on the Challenge Task
        await this.page.getByRole('button', {name: challenge_task_text}).click();
        
    }

    /** Return the Flag Data */
    public async get_shape_shifter_flag(): Promise<string> {
        return await this.shape_shift_flag.innerText();
    }

}