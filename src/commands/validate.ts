/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as fs from 'fs';
import * as vscode from 'vscode';
import { COMMANDS } from '../constants';
import { messages } from '../messages';
import { terminalService, PreConditionChecker, PropertiesFileSelector } from '../utils';

class Validate {
    constructor() {}

    public async run(): Promise<void> {
        const preConditionsMet = await PreConditionChecker.check();
        if (preConditionsMet) {
            let propertiesFileLocation: string | undefined = await new PropertiesFileSelector().selectPropertiesFile();
            if (!propertiesFileLocation) {
                return;
            }

            const pathExists = fs.existsSync(propertiesFileLocation);
            if (!pathExists) {
                vscode.window.showErrorMessage(messages.error_invalid_file);
                return;
            }
            const command = `sfdx ${COMMANDS.PROVARDX_VALIDATE} -p ${propertiesFileLocation}`;
            terminalService.setCommand(command);
            terminalService.showTerminal();
        }
    }
}

export default async function validate() {
    await new Validate().run();
}
