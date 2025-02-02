import { sm2, sm3, sm4 } from 'sm-crypto';

const message = "Hello World!";

// get key pair
const keypair = sm2.generateKeyPairHex();

const publicKey = keypair.publicKey;
const privateKey = keypair.privateKey;

// encrypt & decrypt
const encryptData = sm2.doEncrypt(message, publicKey, 1); // encrypt result
const decryptData = sm2.doDecrypt(encryptData, privateKey, 1); // decrypt result

const encryptData2 = sm2.doEncrypt([0x61, 0x62, 0x73, 0x61, 0x73, 0x64, 0x61, 0x67, 0x66, 0x61, 0x64, 0x67, 0x61, 0x64, 0x73, 0x66, 0x64, 0x66, 0x64, 0x73, 0x66], publicKey);
const decryptData2 = sm2.doDecrypt(encryptData, privateKey);

const encryptData3 = sm2.doEncrypt(Uint8Array.from([0x61, 0x62, 0x73, 0x61, 0x73, 0x64, 0x61, 0x67, 0x66, 0x61, 0x64, 0x67, 0x61, 0x64, 0x73, 0x66, 0x64, 0x66, 0x64, 0x73, 0x66]), publicKey, 1);
const decryptData3 = sm2.doDecrypt(encryptData, privateKey, 1, { output: 'array' });

// signature
// pure sign + generate elliptic curve points
const sigValueHex = sm2.doSignature(message, privateKey); // sign
const verifyResult = sm2.doVerifySignature(message, sigValueHex, publicKey); // verify sign result

// pure sign
const sigValueHex2 = sm2.doSignature(message, privateKey, {
    // speed up sign by passing in elliptic curve points that have been generated in advance
    pointPool: [sm2.getPoint(), sm2.getPoint(), sm2.getPoint(), sm2.getPoint()],
}); // sign
const verifyResult2 = sm2.doVerifySignature(message, sigValueHex2, publicKey); // verify sign result

// pure sign + generate elliptic curve points + der encoding
const sigValueHex3 = sm2.doSignature(message, privateKey, {
    der: true,
}); // sign
const verifyResult3 = sm2.doVerifySignature(message, sigValueHex3, publicKey, {
    der: true,
}); // verify sign result

// pure sign + generate elliptic curve points + sm3
const sigValueHex4 = sm2.doSignature(message, privateKey, {
    hash: true,
}); // sign
const verifyResult4 = sm2.doVerifySignature(message, sigValueHex4, publicKey, {
    hash: true,
}); // verify sign result

// pure sign + generate elliptic curve points + sm3 without deriving the public key
const sigValueHex5 = sm2.doSignature(message, privateKey, {
    hash: true,
    publicKey, // if we passing in public key, we can skip deriving the public key in sm3, it will be more faster than previous method
});
const verifyResult5 = sm2.doVerifySignature(message, sigValueHex5, publicKey, {
    hash: true,
});

// pure sign + generate elliptic curve points + sm3 without deriving the public key + userId
const sigValueHex6 = sm2.doSignature(message, privateKey, {
    hash: true,
    publicKey,
    userId: '1234567812345678',
});
const verifyResult6 = sm2.doVerifySignature(message, sigValueHex6, publicKey, {
    hash: true,
    userId: '1234567812345678',
});

// obtain a elliptic curve point
const poin = sm2.getPoint(); // can using in sm2 sign

// sm3
const hashData = sm3('abc');

// hmac-sm3
const hmacData = sm3('abc', {
    key: 'daac25c1512fe50f79b0e4526b93f5c0e1460cef40b6dd44af13caec62e8c60e0d885f3c6d6fb51e530889e6fd4ac743a6d332e68a0f2a3923f42585dceb93e9'
});

// sm4
const key = [0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef, 0xfe, 0xdc, 0xba, 0x98, 0x76, 0x54, 0x32, 0x10];

// encrypt
const sm4EncryptData = sm4.encrypt([0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef, 0xfe, 0xdc, 0xba, 0x98, 0x76, 0x54, 0x32, 0x10], key);

// decrypt
// TODO runtime padding error
const sm4DecryptData = sm4.decrypt([0x68, 0x1e, 0xdf, 0x34, 0xd2, 0x06, 0x96, 0x5e, 0x86, 0xb3, 0xe9, 0x4f, 0x53, 0x6e, 0x42, 0x46], key);

{
    // Examples based on README
    const encryptData = '0e395deb10f6e8a17e17823e1fd9bd98a1bff1df508b5b8a1efb79ec633d1bb129432ac1b74972dbe97bab04f024e89c';
    const key = '0123456789abcdeffedcba9876543210';

    const out1 = sm4.decrypt(encryptData, key);
    const out2 = sm4.decrypt(encryptData, key, { padding: 'none' });
    const out3 = sm4.decrypt(encryptData, key, { padding: 'none', output: 'array' });
    // TODO runtime padding error
    const out4 = sm4.decrypt(encryptData, key, { mode: 'cbc', iv: 'fedcba98765432100123456789abcdef' });
    const out5 = sm4.decrypt(encryptData, key, { padding: 'pkcs#5', output: 'array' });
    const out6 = sm4.decrypt(encryptData, key, { padding: 'pkcs#7' });
    const out7 = sm4.decrypt(encryptData, key, {});

    out1.toLowerCase(); // Checks output as string
    out2.toLowerCase();
    out3.entries(); // Checks output as array
    out4.toLowerCase();
    out5.entries();
    out6.toLowerCase();
    out7.toLowerCase();
}
