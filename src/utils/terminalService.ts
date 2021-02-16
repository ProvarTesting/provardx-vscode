/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as vscode from 'vscode';
import { messages } from '../messages';

export const DEFAULT_TERMINAL = vscode.window.createTerminal(messages.terminal_name);

export class TerminalService {
    private readonly terminal: vscode.Terminal;
    private static instance: TerminalService;

    public constructor() {
        this.terminal = DEFAULT_TERMINAL;
    }

    public static getInstance() {
        if (!TerminalService.instance) {
            TerminalService.instance = new TerminalService();
        }
        return TerminalService.instance;
    }

    public showTerminal() {
        this.terminal.show(true);
    }

    public setCommand(command: string = '') {
        this.terminal.sendText(command);
    }
}
