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
});
