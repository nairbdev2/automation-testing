import { Pages } from '../pages'
import { expect } from '@playwright/test'

export class endless_feed extends Pages {
    constructor (page: any) {
        super(page)
    }



    //Getters
    
    /** GETTER: Returns the Feed to Scroll */
    get feed() {
        return this.page.locator('div[id="feed"]')
    }
    
    /** GETTER: Obtain Task given from Challenge */
    get given_task_item() {
        return this.page.locator('div[id="task"] strong[class="mono"]').innerText();
    }

    /** GETTER: Feed Flag */
    get endless_feed_flag() {
        return this.page.locator('code[id=flag]');
    }

    /** GETTER: Items List which returns the Items List with its children */
    //Note: Need to specify the childrens as well or else it would not select
    get feed_items_list() {
        return this.page.locator('div[id="items"] div[class="item"]');
    }

    /** GETTER: Reference the FEED itself with no reference to its children */
    // get feed_itself() {
    //     return this.page.locator('div[id="items"]');
    // }



    //Methods
    public async scroll(): Promise<boolean> {

        let flagObtained= false;
        let myFeed = this.feed;

        //Clean Input text from Task given
        const taskItem = (await this.given_task_item).trim(); 
    
        console.log("Given Task: ", taskItem);
    
        const targetTask = myFeed.getByText(taskItem, {exact: true});

        let raceCondition = true;

        /** WHILE: Scorll until item is visible */
        while (raceCondition === true) {
            //Break out of Condition
            if (await targetTask.count() > 0) {
                await targetTask.scrollIntoViewIfNeeded();
                raceCondition = false;
                break;
            }
            
            //Scroll!!
            await myFeed.evaluate(element => {
                element.scrollTop +=500;
            })
            
            await this.page.waitForTimeout(200);
        }

        // Notes: 
        // let testValue = await this.feed_items_list.getByText(taskItem).innerText();
        // let testValue2 = await this.feed_items_list.getByText(taskItem).getAttribute("class");
        // let testValue3 = await this.feed_items_list.filter({hasText: taskItem}).getByRole('button').innerText();

        await this.feed_items_list.filter({hasText: taskItem}).getByRole('button').click();

        // console.log("What is this: ", testValue);
        // console.log("What is this2: ", testValue2);
        // console.log("What is this3: ", testValue3);
        
        //Flag Check
        const PageCheck = await this.page.getByText('Solved! Your flag').isVisible();
        if (PageCheck === true) {
            flagObtained = true;
            await this.page.waitForTimeout(1*1000);
        }

        return flagObtained;
    }


    public async get_endless_feed_flag() {
        return await this.endless_feed_flag.innerText();
    }
}