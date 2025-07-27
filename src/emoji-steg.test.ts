import { EmojiSteg } from './emoji-steg';

describe('EmojiSteg encryption/decryption', () => {
  it('encrypts and decrypts a message', () => {
    const steg = new EmojiSteg();
    const text = 'Hello world';
    const password = 'secret';

    const encoded = steg.encrypt(text, password);
    const decoded = steg.decrypt(encoded, password);

    expect(decoded).toBe(text);
  });

  it('fails to decrypt with wrong password', () => {
    const steg = new EmojiSteg();
    const text = 'Hello world';
    const encoded = steg.encrypt(text, 'correct');
    const decoded = steg.decrypt(encoded, 'wrong');
    expect(decoded).not.toBe(text);
  });
});
