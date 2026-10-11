import { Pages } from '../pages'


export class patience_grasshoper extends Pages {
    constructor (page: any) {
        super(page)
    }



    
    get patience_grasshopper_flag() {
        return this.page.locator('code[id=flag]');
    }



    public async get_patience_grasshopper_flag(): Promise<string> {
        return await this.patience_grasshopper_flag.innerText();
    }

}