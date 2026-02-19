import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { verifyAndDecode } from '../canvasAuth.js';

const TEST_SECRET = 'test_consumer_secret_12345';

function createSignedRequest(payload, secret) {
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const signature = crypto
        .createHmac('sha256', secret)
        .update(encodedPayload)
        .digest('base64');
    return `${signature}.${encodedPayload}`;
}

test('canvasAuth — verifyAndDecode', async (t) => {
    await t.test('decodes a valid signed request', () => {
        const payload = { userId: '005xx000001Svwo', context: { user: { firstName: 'Test' } } };
        const signedRequest = createSignedRequest(payload, TEST_SECRET);

        const result = verifyAndDecode(signedRequest, TEST_SECRET);
        assert.equal(result.userId, '005xx000001Svwo');
        assert.equal(result.context.user.firstName, 'Test');
    });

    await t.test('rejects a tampered payload', () => {
        const payload = { userId: 'original' };
        const signedRequest = createSignedRequest(payload, TEST_SECRET);

        // Tamper with the payload portion
        const [sig] = signedRequest.split('.');
        const tamperedPayload = Buffer.from(JSON.stringify({ userId: 'hacked' })).toString('base64');

        assert.throws(
            () => verifyAndDecode(`${sig}.${tamperedPayload}`, TEST_SECRET),
            { message: 'Signature verification failed' }
        );
    });

    await t.test('rejects a wrong consumer secret', () => {
        const payload = { userId: 'test' };
        const signedRequest = createSignedRequest(payload, TEST_SECRET);

        assert.throws(
            () => verifyAndDecode(signedRequest, 'wrong_secret'),
            { message: 'Signature verification failed' }
        );
    });

    await t.test('rejects missing signed_request', () => {
        assert.throws(
            () => verifyAndDecode(null, TEST_SECRET),
            { message: 'Missing signed_request or consumer secret' }
        );
    });

    await t.test('rejects malformed signed_request', () => {
        assert.throws(
            () => verifyAndDecode('no-dot-separator', TEST_SECRET),
            { message: 'Invalid signed_request format' }
        );
    });
});
