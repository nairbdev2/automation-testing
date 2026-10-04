import { Pages } from '../pages'

/**
 * Page object representing the login challenge page.
 */
export class login_page extends Pages {
    constructor(page:any) {
        super(page)
    }

    /** Returns the username displayed on the login challenge page */
    get username() {
        return this.page.locator(`section[id="challenge"] aside span`).nth(0)
    }

    /** Returns the password displayed on the login challenge page */
    get password() {
        return this.page.locator(`section[id="challenge"] aside span`).nth(1)
    }

    /** Returns the username input field on the login challenge page */
    get username_field() {
        return this.page.locator(`input[id="username"]`)
    }

    /** Returns the password input field on the login challenge page */
    get password_field() {
        return this.page.locator(`input[id="password"]`)
    }

    /** Returns the sign in button on the login challenge page */
    get sign_in_button() {
        return this.page.locator(`button[type="submit"]`)
    }

    get login_flag() {
        return this.page.locator(`code[id=flag]`)
    }

    /** Retrieves the credentials (username and password) displayed on the login challenge page */
    public async get_credentials(): Promise<{ user: string, pass: string }> {
        let user= await this.username.innerText()
        let pass= await this.password.innerText()
        return { user, pass }
    }

    /** Logs in using the provided username and password on the login challenge page */
    public async login(user: string, pass: string): Promise<void> {
        await this.username_field.fill(user)
        await this.password_field.fill(pass)
        await this.sign_in_button.click()
    }

    /** Retrieves the login flag displayed on the login challenge page */
    public async get_login_flag(): Promise<string> {
        return await this.login_flag.innerText()
    }
}