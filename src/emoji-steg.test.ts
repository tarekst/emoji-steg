import { EmojiSteg } from './emoji-steg';

describe('EmojiSteg text encryption/decryption', () => {
  it('encrypts and decrypts a message', () => {
    const steg = new EmojiSteg();
    const text = 'Hello world, this is a secret message';
    const password = 'secret';
    const emoji = '😇';

    const encoded = steg.encrypt(text, password, emoji);
    const decoded = steg.decrypt(encoded, password);

    expect(decoded).toBe(text);
  });

  it('fails to decrypt with wrong password', () => {
    const steg = new EmojiSteg();
    const text = 'Hello world, this is a secret message';
    const emoji = '😇';

    const encoded = steg.encrypt(text, 'correct', emoji);
    const decoded = steg.decrypt(encoded, 'wrong');
    expect(decoded).not.toBe(text);
  });
});
