/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as vscode from 'vscode';
import { messages } from '../messages';
import { HttpService } from '../utils/httpService';
import parseMax from 'libphonenumber-js/max';

const DEFAULT_VALIDATE_INPUT = (value: string) => {
    return value === '' ? messages.generate_license_error_empty_field : null;
};

const VALIDATE_PHONE_INPUT = (value: string) => {
    return !parseMax(value)?.isValid() ? messages.generate_license_error_incorrect_contact : null;
};

const VALIDATE_EMAIL = (value: string) => {
    const regex = /^[^.][^@]*@[^.]+(\.[^.\s]+)+$/;
    return regex.test(value.toLowerCase()) ? null : messages.generate_license_error_incorrect_email;
};

const PROPS_INPUT_OPTIONS = (prompt: string, placeHolder: string, validateInput: Function = DEFAULT_VALIDATE_INPUT) => {
    return {
        prompt,
        placeHolder,
        validateInput
    } as vscode.InputBoxOptions;
};

const FIRST_NAME_OPTIONS: vscode.InputBoxOptions = PROPS_INPUT_OPTIONS(
    messages.generate_license_user_firstname,
    messages.generate_license_user_firstname
);

const LAST_NAME_OPTIONS: vscode.InputBoxOptions = PROPS_INPUT_OPTIONS(
    messages.generate_license_user_lastname,
    messages.generate_license_user_lastname
);

const EMAIL_OPTIONS: vscode.InputBoxOptions = PROPS_INPUT_OPTIONS(
    messages.generate_license_user_email_id,
    messages.generate_license_user_email_id,
    VALIDATE_EMAIL
);

const COMPANY_NAME_OPTIONS: vscode.InputBoxOptions = PROPS_INPUT_OPTIONS(
    messages.generate_license_user_company,
    messages.generate_license_user_company
);

const PHONE_OPTIONS: vscode.InputBoxOptions = PROPS_INPUT_OPTIONS(
    messages.generate_license_user_phone,
    messages.generate_license_user_phone,
    VALIDATE_PHONE_INPUT
);

class GenerateLicenseKey {
    constructor() {}

    public async run(): Promise<void> {
        const firstName: string | undefined = await this.showInputBox(FIRST_NAME_OPTIONS);
        if (firstName === undefined) {
            return;
        }

        const lastName: string | undefined = await this.showInputBox(LAST_NAME_OPTIONS);
        if (lastName === undefined) {
            return;
        }

        const email: string | undefined = await this.showInputBox(EMAIL_OPTIONS);
        if (email === undefined) {
            return;
        }

        const phone: string | undefined = await this.showInputBox(PHONE_OPTIONS);
        if (phone === undefined) {
            return;
        }

        const company: string | undefined = await this.showInputBox(COMPANY_NAME_OPTIONS);
        if (company === undefined) {
            return;
        }

        const resp = await HttpService.registerUser(JSON.stringify({ firstName, lastName, email, phone, company }));

        let message = `Your registration request (${resp}) has been received and is being processed, a temporary license key will be emailed to you if successfully accepted.`;
        if (!resp) {
            message = messages.generate_license_errorMessage;
        }
        vscode.window.showInformationMessage(message);
    }

    private async showInputBox(propertiesInputOptions: vscode.InputBoxOptions): Promise<string | undefined> {
        return await vscode.window.showInputBox(propertiesInputOptions);
    }
}

export default async function generateLicenseKey() {
    await new GenerateLicenseKey().run();
}
