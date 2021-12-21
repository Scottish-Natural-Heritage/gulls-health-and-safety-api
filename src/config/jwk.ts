import {readFile} from 'node:fs/promises';
import {createPrivateKey, createPublicKey, JsonWebKey} from 'node:crypto';

/**
 * An EC public+private keypair used to sign links during our automated
 * testing processes ONLY. They will not generate links that can be
 * validated by the production authentication system.
 */
const testKeyPair: JsonWebKey = {
  // The following four fields are all that are required to represent
  // the public part of the EC keypair.
  kty: 'EC',
  crv: 'P-256',
  /* CSpell:disable */
  x: 'mwlVx-OJrjwgVETfGGZ8-r8ntKZSM3UP_MQ6Vx4J41s',
  y: 'wejrPtOm23MbogLQbAcz08JXkt3spzoz_lIIx3PPN-o',
  /* CSpell:enable */
  // This last field is needed to fill our the private part of the
  // keypair.
  d: '5otTLYZbNSb962yTmmyQDKBjBXywtuvVdT2Nl4Lf7gw',
};

/**
 * Get this application's public key.
 *
 * @param {KeyOptions | undefined} options What format should the key be?
 * Defaults to PEM encoded string.
 * @param {'pem' | 'jwk'} options.type What format should the key be?
 * @returns {string | JsonWebKey} The public key.
 */
const getPublicKey = async (options: KeyOptions): Promise<string | JsonWebKey> => {
  // Grab our private key as a JWK.
  const privateKey = await getPrivateKey({type: 'jwk'});

  // We should never see this, but it acts as a type-guard to allow us to treat
  // the key as a JWK later.
  if (typeof privateKey === 'string') {
    throw new TypeError('Requested private key as a JWK but received PEM.');
  }

  // Grab the fields that represent the public part of our keypair.
  const {kty, crv, x, y} = privateKey;

  // Bundle them up as a new public key.
  const publicKey = createPublicKey({
    format: 'jwk',
    key: {
      kty,
      crv,
      x,
      y,
    },
  });

  // If they've asked us for a PEM encoded string.
  if (options && options.type === 'pem') {
    // Export the public key to pem format.
    const result = publicKey.export({format: 'pem', type: 'pkcs8'});

    // Result could be a string or a Buffer, so we make sure to convert it to a
    // string, regardless.
    return result.toString('utf-8');
  }

  //
  return publicKey.export({format: 'jwk'});
};

/**
 * Options object for choosing what kind of key to get.
 */
interface KeyOptions {
  /**
   * Should the key be a PEM encoded string or a JWK formatted object.
   */
  type: 'pem' | 'jwk';
}

/**
 * Get this application's private key.
 *
 * @param {KeyOptions | undefined} options What format should the key be?
 * Defaults to PEM encoded string.
 * @param {'pem' | 'jwk'} options.type What format should the key be?
 * @returns {string | JsonWebKey} The private key.
 */
const getPrivateKey = async (options?: KeyOptions): Promise<string | JsonWebKey> => {
  // Are we running in developer/test mode?
  if (process.env.NODE_ENV !== 'production') {
    // Does the caller want the test private key as a JWK?
    if (options && options.type === 'jwk') {
      return testKeyPair;
    }

    // If not they want the test private key as a PEM.
    const testPrivateKey = createPrivateKey({
      format: 'jwk',
      key: testKeyPair,
    });
    return testPrivateKey.export({format: 'pem', type: 'pkcs8'}).toString();
  }

  // We're running in production mode, so use the real private key.
  const pemPrivateKey = await readFile('.secrets/private.key', 'utf-8');

  // If there are no options, or the type option is not jwk, then they just want
  // the PEM encoded string.
  if (!options || options.type !== 'jwk') {
    return pemPrivateKey;
  }

  // Since they want the JWK, parse the PEM key
  const privateKey = createPrivateKey(pemPrivateKey);

  // Extract just the five fields we're interested in for consistency with the
  // test key.
  const {kty, crv, x, y, d} = privateKey.export({format: 'jwk'});

  // Bundle those fields back up and return it as a JWK.
  return {
    kty,
    crv,
    x,
    y,
    d,
  };
};

/**
 * Interact with NatureScot's Gulls Health & Safety's JWKs.
 */
const jwk = {
  getPublicKey,
  getPrivateKey,
};

export default jwk;
