import crypto from 'node:crypto';

/**
 * Verify and decode a Salesforce Canvas signed request.
 *
 * The signed_request is a string: "<base64_signature>.<base64_payload>"
 * - The signature is an HMAC-SHA256 of the payload, signed with the Consumer Secret.
 * - The payload is a Base64-encoded JSON string containing user/org context.
 */
export function verifyAndDecode(signedRequest, consumerSecret) {
  if (!signedRequest || !consumerSecret) {
    throw new Error('Missing signed_request or consumer secret');
  }

  const [encodedSignature, encodedPayload] = signedRequest.split('.');

  if (!encodedSignature || !encodedPayload) {
    throw new Error('Invalid signed_request format');
  }

  const expectedSignature = crypto
    .createHmac('sha256', consumerSecret)
    .update(encodedPayload)
    .digest('base64');

  const sigBuffer = Buffer.from(encodedSignature, 'base64');
  const expectedBuffer = Buffer.from(expectedSignature, 'base64');

  if (
    sigBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    throw new Error('Signature verification failed');
  }

  const payloadJson = Buffer.from(encodedPayload, 'base64').toString('utf-8');
  return JSON.parse(payloadJson);
}
