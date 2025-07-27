/**
 * EmojiSteg - TypeScript library for Unicode steganography in emojis
 *
 * This library allows hiding text in an emoji by using invisible
 * Unicode characters that are directly attached to the emoji.
 *
 * @Author Tarek Steiß
 */
export interface EmojiStegOptions {
    /** The default emoji if none is specified */
    defaultEmoji?: string;
    /** A customized map of emojis (optional) */
    customEmojiCategories?: EmojiCategories;
}
export interface EmojiCategories {
    [category: string]: string[];
}
/**
 * Main class for emoji steganography
 */
export declare class EmojiSteg {
    private defaultEmoji;
    emojiCategories: EmojiCategories;
    private readonly invisibleChars;
    private readonly variationSelectors;
    /**
     * Creates a new instance of the EmojiSteg class
     * @param options Optional configuration options
     */
    constructor(options?: EmojiStegOptions);
    /**
     * Returns all category names
     * @returns Array with all category names
     */
    getCategories(): string[];
    /**
     * Returns all emojis of a specific category
     * @param category - The name of the category
     * @returns Array with emojis of the specified category or empty array if category doesn't exist
     */
    getEmojisByCategory(category: string): string[];
    /**
     * Returns a random emoji from all categories
     * @returns A random emoji
     */
    getRandomEmoji(): string;
    /**
     * Returns a random emoji from a specific category
     * @param category - The name of the category
     * @returns A random emoji from the specified category
     */
    getRandomEmojiFromCategory(category: string): string;
    /**
     * Generates a hash value from a password and salt
     * @param password - The password
     * @param salt - The salt (optional)
     * @returns A hash value as byte array
     * @private
     */
    private _generateKey;
    /**
     * Encrypts text with a password
     * @param text - The text to encrypt
     * @param password - The password
     * @returns The encrypted data
     * @private
     */
    private _encryptData;
    /**
     * Decrypts data with a password
     * @param encrypted - The encrypted data
     * @param password - The password
     * @returns The decrypted text
     * @private
     */
    private _decryptData;
    /**
     * Converts bytes to a Base64 string
     * @param data - The data to convert
     * @returns The Base64 representation
     * @private
     */
    private _bytesToBase64;
    /**
     * Converts a Base64 string back to bytes
     * @param base64 - The Base64 string
     * @returns The decoded data
     * @private
     */
    private _base64ToBytes;
    /**
     * Encodes a binary string into a sequence of invisible Unicode characters
     * @param binaryString - A string of 0s and 1s
     * @returns Invisible Unicode sequence
     * @private
     */
    private _binaryToInvisibleChars;
    /**
     * Decodes a sequence of invisible Unicode characters into a binary string
     * @param invisibleSequence - The invisible Unicode sequence
     * @returns Binary string of 0s and 1s
     * @private
     */
    private _invisibleCharsToBinary;
    /**
     * Converts a Base64 string to a binary string
     * @param base64 - The Base64 string
     * @returns Binary string (0s and 1s)
     * @private
     */
    private _base64ToBinary;
    /**
     * Converts a binary string to a Base64 string
     * @param binary - The binary string
     * @returns Base64 string
     * @private
     */
    private _binaryToBase64;
    /**
     * Encrypts text and hides it in an emoji
     * @param text - The text to encrypt
     * @param password - The password
     * @param emoji - The emoji to use (optional)
     * @returns The emoji with hidden text
     */
    encrypt(text: string, password: string, emoji?: string): string;
    /**
     * Decrypts text from an emoji
     * @param emojiMessage - The emoji with hidden text
     * @param password - The password
     * @returns The decrypted text
     */
    decrypt(emojiMessage: string, password: string): string;
    /**
     * Checks if an emoji contains hidden data
     * @param emojiMessage - The emoji to check
     * @returns true if the emoji contains hidden data, otherwise false
     */
    hasHiddenData(emojiMessage: string): boolean;
}
/**
 * A simple helper function for quickly encrypting text in an emoji
 * @param text - The text to encrypt
 * @param password - The password
 * @param emoji - The emoji to use (optional)
 * @returns The emoji with hidden text
 */
export declare function encryptInEmoji(text: string, password: string, emoji?: string): string;
/**
 * A simple helper function for quickly decrypting text from an emoji
 * @param emojiMessage - The emoji with hidden text
 * @param password - The password
 * @returns The decrypted text
 */
export declare function decryptFromEmoji(emojiMessage: string, password: string): string;
