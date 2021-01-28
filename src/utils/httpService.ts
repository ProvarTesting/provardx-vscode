/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as vscode from 'vscode';
import * as https from 'https';

export class HttpService {
    private static HOST: string = 'l4j-provarapi.cs74.force.com';
    private static PATH: string = '/cli/services/apexrest/Registration';

    public static async registerUser(data: string): Promise<string | null> {
        const options = {
            hostname: this.HOST,
            port: 443,
            path: this.PATH,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        return vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: 'Running Generate License Key',
                cancellable: false
            },
            () => {
                return new Promise((resolve, reject) => {
                    const req = https.request(options, (res) => {
                        let datas: any = [];
                        res.on('data', (chunk) => {
                            datas.push(chunk);
                        }).on('end', () => {
                            const buffer = Buffer.concat(datas).toString();
                            if (res.statusCode === 200) {
                                resolve(buffer);
                            } else {
                                resolve(null);
                            }
                        });
                    });

                    req.on('error', (error) => {
                        reject(error);
                    });

                    req.write(data);
                    req.end();
                });
            }
        );
    }
}
