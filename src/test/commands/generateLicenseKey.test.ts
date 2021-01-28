/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import * as sinon from 'sinon';
import { SinonStub, stub } from 'sinon';
import * as vscode from 'vscode';
import generateLicenseKey from '../../commands/generateLicenseKey';
import { messages } from '../../messages';
import { HttpService } from '../../utils';

describe('Generate License Key', () => {
    let inputBoxSpy: SinonStub;
    let registerUserStub: SinonStub;
    let showInformationMessageStub: SinonStub;

    beforeEach(() => {
        registerUserStub = sinon.stub(HttpService, 'registerUser');
        showInformationMessageStub = stub(vscode.window, 'showInformationMessage');
        inputBoxSpy = sinon.stub(vscode.window, 'showInputBox');
    });

    afterEach(() => {
        registerUserStub.restore();
        inputBoxSpy.restore();
        showInformationMessageStub.restore();
    });

    it('Should not generate a license key if lastname is undefined', async () => {
        inputBoxSpy.onCall(0).returns('Test');
        inputBoxSpy.onCall(1).returns(undefined);
        await generateLicenseKey();
        expect(inputBoxSpy.calledTwice).to.be.true;
    });

    it('Should not generate a license if both first and last name are same', async () => {
        inputBoxSpy.onCall(0).returns('Test');
        inputBoxSpy.onCall(1).returns('Test');
        inputBoxSpy.onCall(2).returns('test@example.com');
        inputBoxSpy.onCall(3).returns('1234567890');
        inputBoxSpy.onCall(4).returns('Provar');
        registerUserStub.returns(Promise.resolve(null));
        await generateLicenseKey();
        expect(showInformationMessageStub.getCall(0).args[0]).to.equal(messages.generate_license_errorMessage);
    }).timeout(1000);

    it('Should generate a license key successfully', async () => {
        inputBoxSpy.onCall(0).returns('Test');
        inputBoxSpy.onCall(1).returns('User');
        inputBoxSpy.onCall(2).returns('test@example.com');
        inputBoxSpy.onCall(3).returns('1234567890');
        inputBoxSpy.onCall(4).returns('Provar');
        registerUserStub.returns(Promise.resolve('AKJAWFHQWHIU'));
        await generateLicenseKey();
        expect(showInformationMessageStub.getCall(0).args[0]).to.equal(
            `Your registration request (AKJAWFHQWHIU) has been received and is being processed, a temporary license key will be emailed to you if successfully accepted.`
        );
    }).timeout(1000);
});
