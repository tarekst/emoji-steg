/**
 * EmojiSteg - TypeScript library for Unicode steganography in emojis
 *
 * This library allows hiding text in an emoji by using invisible
 * Unicode characters that are directly attached to the emoji.
 *
 * @Author Tarek Steiß
 */

import { pbkdf2Sync } from 'crypto';

// Interface for the library options
export interface EmojiStegOptions {
    /** The default emoji if none is specified */
    defaultEmoji?: string;
    /** A customized map of emojis (optional) */
    customEmojiCategories?: EmojiCategories;
}

// Interface for emoji categories
export interface EmojiCategories {
    [category: string]: string[];
}

/**
 * Main class for emoji steganography
 */
export class EmojiSteg {
    // Default emoji if none is specified
    private defaultEmoji: string;

    // Map of all available emojis, categorized
    public emojiCategories: EmojiCategories;

    // Invisible Unicode characters for steganography
    private readonly invisibleChars: string[] = [
        '\u200C', // Zero-Width Non-Joiner (ZWNJ)
        '\u200D', // Zero-Width Joiner (ZWJ)
        '\u200E', // Left-to-Right Mark (LRM)
        '\u200F', // Right-to-Left Mark (RLM)
        '\u2060', // Word Joiner
        '\u2061', // Function Application
        '\u2062', // Invisible Times
        '\u2063', // Invisible Separator
        '\u2064', // Invisible Plus
        '\u206A', // Inhibit Symmetric Swapping
        '\u206B', // Activate Symmetric Swapping
        '\u206C', // Inhibit Arabic Form Shaping
        '\u206D', // Activate Arabic Form Shaping
        '\u206E', // National Digit Shapes
        '\u206F'  // Nominal Digit Shapes
    ];

    // Variation selectors that can change the appearance of a character
    // but remain invisible in most contexts
    private readonly variationSelectors: string[] = [
        '\uFE00', '\uFE01', '\uFE02', '\uFE03', '\uFE04', '\uFE05', '\uFE06', '\uFE07',
        '\uFE08', '\uFE09', '\uFE0A', '\uFE0B', '\uFE0C', '\uFE0D', '\uFE0E', '\uFE0F'
    ];

    /**
     * Creates a new instance of the EmojiSteg class
     * @param options Optional configuration options
     */
    constructor(options?: EmojiStegOptions) {
        this.defaultEmoji = options?.defaultEmoji || "🔒";

        // Extensive emoji list supported by iOS and Android
        // Now categorized in a map
        this.emojiCategories = options?.customEmojiCategories || {
            "Smileys & Emotions": [
                "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙",
                "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥",
                "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "😎", "🤓",
                "🧐", "😕", "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣",
                "😞", "😓", "😩", "😫", "🥱", "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽", "👾",
                "🤖", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"
            ],
            "Gestures & People": [
                "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍",
                "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂",
                "🦻", "👃", "🧠", "🫀", "🫁", "🦷", "🦴", "👀", "👁️", "👅", "👄", "👶", "🧒", "👦", "👧", "🧑", "👱", "👨", "🧔", "👨‍🦰",
                "👨‍🦱", "👨‍🦳", "👨‍🦲", "👩", "👩‍🦰", "🧑‍🦰", "👩‍🦱", "🧑‍🦱", "👩‍🦳", "🧑‍🦳", "👩‍🦲", "🧑‍🦲", "👱‍♀️", "👱‍♂️", "🧓", "👴", "👵"
            ],
            "Animals": [
                "🐵", "🐒", "🦍", "🦧", "🐶", "🐕", "🦮", "🐕‍🦺", "🐩", "🐺", "🦊", "🦝", "🐱", "🐈", "🐈‍⬛", "🦁", "🐯", "🐅", "🐆", "🐴",
                "🐎", "🦄", "🦓", "🦌", "🦬", "🐮", "🐂", "🐃", "🐄", "🐷", "🐖", "🐗", "🐽", "🐏", "🐑", "🐐", "🐪", "🐫", "🦙", "🦒",
                "🐘", "🦣", "🦏", "🦛", "🐭", "🐁", "🐀", "🐹", "🐰", "🐇", "🐿️", "🦫", "🦔", "🦇", "🐻", "🐻‍❄️", "🐨", "🐼", "🦥", "🦦",
                "🦨", "🦘", "🦡", "🐾", "🦃", "🐔", "🐓", "🐣", "🐤", "🐥", "🐦", "🐧", "🕊️", "🦅", "🦆", "🦢", "🦉", "🦤", "🪶", "🦩",
                "🦚", "🦜", "🐸", "🐊", "🐢", "🦎", "🐍", "🐲", "🐉", "🦕", "🦖", "🐳", "🐋", "🐬", "🦭", "🐟", "🐠", "🐡", "🦈", "🐙",
                "🐚", "🐌", "🦋", "🐛", "🐜", "🐝", "🪲", "🐞", "🦗", "🪳", "🕷️", "🕸️", "🦂", "🦟", "🪰", "🪱"
            ],
            "Food & Drink": [
                "🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍍", "🥭", "🍎", "🍏", "🍐", "🍑", "🍒", "🍓", "🫐", "🥝", "🍅", "🫒", "🥥", "🥑",
                "🍆", "🥔", "🥕", "🌽", "🌶️", "🫑", "🥒", "🥬", "🥦", "🧄", "🧅", "🍄", "🥜", "🌰", "🍞", "🥐", "🥖", "🫓", "🥨", "🥯",
                "🥞", "🧇", "🧀", "🍖", "🍗", "🥩", "🥓", "🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🌯", "🫔", "🥙", "🧆", "🥚", "🍳", "🥘",
                "🍲", "🫕", "🥣", "🥗", "🍿", "🧈", "🧂", "🥫", "🍱", "🍘", "🍙", "🍚", "🍛", "🍜", "🍝", "🍠", "🍢", "🍣", "🍤", "🍥",
                "🥮", "🍡", "🥟", "🥠", "🥡", "🦀", "🦞", "🦐", "🦑", "🦪", "🍦", "🍧", "🍨", "🍩", "🍪", "🎂", "🍰", "🧁", "🥧", "🍫",
                "🍬", "🍭", "🍮", "🍯", "🍼", "🥛", "☕", "🫖", "🍵", "🍶", "🍾", "🍷", "🍸", "🍹", "🍺", "🍻", "🥂", "🥃", "🥤", "🧋",
                "🧃", "🧉", "🧊"
            ],
            "Sports & Activities": [
                "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳",
                "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂", "🏋️", "🏋️‍♀️", "🏋️‍♂️", "🤼",
                "🤼‍♀️", "🤼‍♂️", "🤸", "🤸‍♀️", "🤸‍♂️", "⛹️", "⛹️‍♀️", "⛹️‍♂️", "🤺", "🤾", "🤾‍♀️", "🤾‍♂️", "🏌️", "🏌️‍♀️", "🏌️‍♂️", "🏇", "🧘", "🧘‍♀️", "🧘‍♂️", "🏄",
                "🏄‍♀️", "🏄‍♂️", "🏊", "🏊‍♀️", "🏊‍♂️", "🤽", "🤽‍♀️", "🤽‍♂️", "🚣", "🚣‍♀️", "🚣‍♂️", "🧗", "🧗‍♀️", "🧗‍♂️", "🚵", "🚵‍♀️", "🚵‍♂️", "🚴", "🚴‍♀️", "🚴‍♂️"
            ],
            "Travel & Places": [
                "🚀", "🛸", "🛰️", "🪐", "🌍", "🌎", "🌏", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌙", "🌚", "🌛", "🌜", "☀️",
                "🌝", "🌞", "⭐", "🌟", "🌠", "🌌", "☁️", "⛅", "⛈️", "🌤️", "🌥️", "🌦️", "🌧️", "🌨️", "🌩️", "🌪️", "🌫️", "🌬️", "🌈", "☂️",
                "☔", "⚡", "❄️", "☃️", "⛄", "☄️", "🔥", "💧", "🌊", "🏙️", "🌆", "🌇", "🌃", "🌉", "🏠", "🏡", "🏗️", "🏢", "🏬", "🏣",
                "🏤", "🏥", "🏦", "🏨", "🏪", "🏫", "🏩", "💒", "🏛️", "⛪", "🕌", "🕍", "🛕", "🕋", "⛩️", "🛤️", "🛣️", "🗾", "🎑", "🏞️",
                "🌅", "🌄", "🌠", "🎇", "🎆", "🌇", "🏙️", "🌃", "🌌", "🌉", "🌁", "🛫", "🛬", "🛩️", "💺", "🚁", "🚟", "🚠", "🚡", "🚀",
                "🛸", "🚇", "🚄", "🚅", "🚈", "🚉", "🚂", "🚆", "🚊", "🚞", "🚝", "🚋", "🚌", "🚍", "🚎", "🚐", "🚑", "🚒", "🚓", "🚔",
                "🚕", "🚖", "🚗", "🚘", "🚙", "🚚", "🚛", "🚜", "🦯", "🦽", "🦼", "🛴", "🚲", "🛵", "🏍️", "🛺", "🚨", "🚥", "🚦", "🛑",
                "🚧", "⚓", "⛵", "🛶", "🚤", "🛳️", "⛴️", "🛥️", "🚢", "✈️", "🛫", "🛬", "🪂", "💺", "🚁", "🚟", "🚠", "🚡", "🚁", "🚀"
            ],
            "Objects & Symbols": [
                "⌚", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️", "💽", "💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥",
                "📽️", "🎞️", "📞", "☎️", "📟", "📠", "📺", "📻", "🎙️", "🎚️", "🎛️", "🧭", "⏱️", "⏲️", "⏰", "🕰️", "⌛", "⏳", "📡", "🔋",
                "🔌", "💡", "🔦", "🕯️", "🪔", "🧯", "🛢️", "💸", "💵", "💴", "💶", "💷", "💰", "💳", "💎", "⚖️", "🪜", "🧰", "🪛", "🔧",
                "🔨", "⚒️", "🛠️", "🧲", "🔩", "⚙️", "🧱", "⛓️", "🧪", "🧫", "🧬", "🔬", "🔭", "📡", "💉", "🩸", "💊", "🩹", "🩺", "🚪",
                "🪑", "🚽", "🚿", "🛁", "🪤", "🪒", "🧴", "🧷", "🧹", "🧺", "🧻", "🪣", "🧼", "🪥", "🧽", "🧯", "🛒", "🚬", "⚰️", "🪦",
                "⚱️", "🗿", "🪧", "🏧", "🚮", "🚰", "♿", "🚹", "🚺", "🚻", "🚼", "🚾", "🛂", "🛃", "🛄", "🛅", "⚠️", "🚸", "⛔", "🚫",
                "🚳", "🚭", "🚯", "🚱", "🚷", "📵", "🔞", "☢️", "☣️", "⬆️", "↗️", "➡️", "↘️", "⬇️", "↙️", "⬅️", "↖️", "↕️", "↔️", "↩️",
                "↪️", "⤴️", "⤵️", "🔃", "🔄", "🔙", "🔚", "🔛", "🔜", "🔝", "🛐", "⚛️", "🕉️", "✡️", "☸️", "☯️", "✝️", "☦️", "☪️", "☮️",
                "🕎", "🔯", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "⛎", "🔀", "🔁", "🔂", "▶️", "⏩", "⏭️", "⏯️",
                "◀️", "⏪", "⏮️", "🔼", "⏫", "🔽", "⏬", "⏸️", "⏹️", "⏺️", "⏏️", "🎦", "🔅", "🔆", "📶", "📳", "📴", "♀️", "♂️", "⚧️", "✖️",
                "➕", "➖", "➗", "♾️", "‼️", "⁉️", "❓", "❔", "❕", "❗", "〰️", "💱", "💲", "⚕️", "♻️", "⚜️", "🔱", "📛", "🔰", "⭕", "✅",
                "☑️", "✔️", "❌", "❎", "➰", "➿", "〽️", "✳️", "✴️", "❇️", "©️", "®️", "™️", "#️⃣", "*️⃣", "0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣",
                "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🔠", "🔡", "🔢", "🔣", "🔤", "🅰️", "🆎", "🅱️", "🆑", "🆒", "🆓", "ℹ️", "🆔", "Ⓜ️",
                "🆕", "🆖", "🅾️", "🆗", "🅿️", "🆘", "🆙", "🆚", "🈁", "🈂️", "🈷️", "🈶", "🈯", "🉐", "🈹", "🈚", "🈲", "🉑", "🈸", "🈴",
                "🈳", "㊗️", "㊙️", "🈺", "🈵", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "🟤", "⚫", "⚪", "🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "🟫", "⬛",
                "⬜", "◼️", "◻️", "◾", "◽", "▪️", "▫️", "🔶", "🔷", "🔸", "🔹", "🔺", "🔻", "💠", "🔘", "🔳", "🔲"
            ]
        };
    }

    /**
     * Returns all category names
     * @returns Array with all category names
     */
    public getCategories(): string[] {
        return Object.keys(this.emojiCategories);
    }

    /**
     * Returns all emojis of a specific category
     * @param category - The name of the category
     * @returns Array with emojis of the specified category or empty array if category doesn't exist
     */
    public getEmojisByCategory(category: string): string[] {
        return this.emojiCategories[category] || [];
    }

    /**
     * Returns a random emoji from all categories
     * @returns A random emoji
     */
    public getRandomEmoji(): string {
        // All categories as array
        const categories = this.getCategories();

        // Choose a random category
        const randomCategoryIndex = Math.floor(Math.random() * categories.length);
        const randomCategory = categories[randomCategoryIndex];

        // Choose a random emoji from the category
        const emojisInCategory = this.emojiCategories[randomCategory];
        const randomEmojiIndex = Math.floor(Math.random() * emojisInCategory.length);

        return emojisInCategory[randomEmojiIndex];
    }

    /**
     * Returns a random emoji from a specific category
     * @param category - The name of the category
     * @returns A random emoji from the specified category
     */
    public getRandomEmojiFromCategory(category: string): string {
        const emojis = this.getEmojisByCategory(category);
        if (emojis.length === 0) {
            return this.getRandomEmoji(); // Fallback: Random emoji from all categories
        }

        const randomIndex = Math.floor(Math.random() * emojis.length);
        return emojis[randomIndex];
    }

    /**
     * Generates a hash value from a password and salt
     * @param password - The password
     * @param salt - The salt (optional)
     * @returns A hash value as byte array
     * @private
     */
    private _generateKey(password: string, salt: string = 'EmojiSteg'): Uint8Array {
        // Derive a 128-bit key using PBKDF2 with SHA-256
        const buffer = pbkdf2Sync(password, salt, 10000, 16, 'sha256');
        return new Uint8Array(buffer);
    }

    /**
     * Encrypts text with a password
     * @param text - The text to encrypt
     * @param password - The password
     * @returns The encrypted data
     * @private
     */
    private _encryptData(text: string, password: string): Uint8Array {
        const key = this._generateKey(password);
        const textBytes = new TextEncoder().encode(text);
        const encrypted = new Uint8Array(textBytes.length);

        // XOR with the key and additional position
        for (let i = 0; i < textBytes.length; i++) {
            // Use different parts of the key based on position
            const keyByte = key[i % key.length];
            const positionFactor = i % 256;
            encrypted[i] = textBytes[i] ^ keyByte ^ positionFactor;
        }

        return encrypted;
    }

    /**
     * Decrypts data with a password
     * @param encrypted - The encrypted data
     * @param password - The password
     * @returns The decrypted text
     * @private
     */
    private _decryptData(encrypted: Uint8Array, password: string): string {
        const key = this._generateKey(password);
        const decrypted = new Uint8Array(encrypted.length);

        // XOR with the key and additional position (reversed)
        for (let i = 0; i < encrypted.length; i++) {
            const keyByte = key[i % key.length];
            const positionFactor = i % 256;
            decrypted[i] = encrypted[i] ^ keyByte ^ positionFactor;
        }

        return new TextDecoder().decode(decrypted);
    }

    /**
     * Converts bytes to a Base64 string
     * @param data - The data to convert
     * @returns The Base64 representation
     * @private
     */
    private _bytesToBase64(data: Uint8Array): string {
        // In modern browsers:
        if (typeof btoa === 'function') {
            const binString = Array.from(data)
                .map(byte => String.fromCharCode(byte))
                .join('');
            return btoa(binString);
        }

        // For Node.js and other environments:
        else if (typeof Buffer !== 'undefined') {
            return Buffer.from(data).toString('base64');
        }

        // Fallback implementation (for other environments)
        else {
            const binString = Array.from(data)
                .map(byte => String.fromCharCode(byte))
                .join('');

            const table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            let result = '';

            for (let i = 0; i < binString.length; i += 3) {
                const triplet = (binString.charCodeAt(i) << 16) |
                    ((i + 1 < binString.length) ? binString.charCodeAt(i + 1) << 8 : 0) |
                    ((i + 2 < binString.length) ? binString.charCodeAt(i + 2) : 0);

                for (let j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > binString.length * 8) {
                        result += '=';
                    } else {
                        result += table.charAt((triplet >>> (6 * (3 - j))) & 0x3F);
                    }
                }
            }

            return result;
        }
    }

    /**
     * Converts a Base64 string back to bytes
     * @param base64 - The Base64 string
     * @returns The decoded data
     * @private
     */
    private _base64ToBytes(base64: string): Uint8Array {
        // In modern browsers:
        if (typeof atob === 'function') {
            const binString = atob(base64);
            const bytes = new Uint8Array(binString.length);
            for (let i = 0; i < binString.length; i++) {
                bytes[i] = binString.charCodeAt(i);
            }
            return bytes;
        }

        // For Node.js and other environments:
        else if (typeof Buffer !== 'undefined') {
            const buffer = Buffer.from(base64, 'base64');
            return new Uint8Array(buffer);
        }

        // Fallback implementation (for other environments)
        else {
            const table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

            // Remove padding characters
            base64 = base64.replace(/=+$/, '');

            const binString = [];

            for (let i = 0; i < base64.length; i += 4) {
                const chunk = [
                    table.indexOf(base64.charAt(i)),
                    table.indexOf(base64.charAt(i + 1)),
                    table.indexOf(base64.charAt(i + 2)),
                    table.indexOf(base64.charAt(i + 3))
                ];

                const triplet = (chunk[0] << 18) | (chunk[1] << 12) |
                    ((chunk[2] & 0x3F) << 6) | (chunk[3] & 0x3F);

                for (let j = 0; j < 3 && i * 4 + j * 8 < base64.length * 6; j++) {
                    binString.push(String.fromCharCode((triplet >>> (16 - j * 8)) & 0xFF));
                }
            }

            const bytes = new Uint8Array(binString.length);
            for (let i = 0; i < binString.length; i++) {
                bytes[i] = binString[i].charCodeAt(0);
            }

            return bytes;
        }
    }

    /**
     * Encodes a binary string into a sequence of invisible Unicode characters
     * @param binaryString - A string of 0s and 1s
     * @returns Invisible Unicode sequence
     * @private
     */
    private _binaryToInvisibleChars(binaryString: string): string {
        let result = '';

        // Convert bits to invisible characters
        // 0 = Zero-Width Non-Joiner
        // 1 = Zero-Width Joiner
        for (let i = 0; i < binaryString.length; i++) {
            if (binaryString[i] === '0') {
                result += this.invisibleChars[0]; // ZWNJ for 0
            } else {
                result += this.invisibleChars[1]; // ZWJ for 1
            }

            // Occasionally add a variation selector to vary patterns
            // and make detection more difficult
            if (i % 8 === 7) {
                const vsIndex = Math.floor(Math.random() * this.variationSelectors.length);
                result += this.variationSelectors[vsIndex];
            }
        }

        return result;
    }

    /**
     * Decodes a sequence of invisible Unicode characters into a binary string
     * @param invisibleSequence - The invisible Unicode sequence
     * @returns Binary string of 0s and 1s
     * @private
     */
    private _invisibleCharsToBinary(invisibleSequence: string): string {
        let binaryString = '';

        // Extract bits from the invisible sequence
        for (let i = 0; i < invisibleSequence.length; i++) {
            const char = invisibleSequence.charAt(i);

            // Skip variation selectors
            if (this.variationSelectors.includes(char)) {
                continue;
            }

            if (char === this.invisibleChars[0]) { // ZWNJ
                binaryString += '0';
            } else if (char === this.invisibleChars[1]) { // ZWJ
                binaryString += '1';
            }
            // Other invisible characters are ignored
        }

        return binaryString;
    }

    /**
     * Converts a Base64 string to a binary string
     * @param base64 - The Base64 string
     * @returns Binary string (0s and 1s)
     * @private
     */
    private _base64ToBinary(base64: string): string {
        let binary = '';
        for (let i = 0; i < base64.length; i++) {
            const charCode = base64.charCodeAt(i);
            const bits = charCode.toString(2).padStart(8, '0');
            binary += bits;
        }
        return binary;
    }

    /**
     * Converts a binary string to a Base64 string
     * @param binary - The binary string
     * @returns Base64 string
     * @private
     */
    private _binaryToBase64(binary: string): string {
        // Ensure the length of the binary string is a multiple of 8
        const paddedBinary = binary.padEnd(Math.ceil(binary.length / 8) * 8, '0');

        let base64 = '';
        for (let i = 0; i < paddedBinary.length; i += 8) {
            const byte = paddedBinary.substr(i, 8);
            const charCode = parseInt(byte, 2);
            base64 += String.fromCharCode(charCode);
        }

        return base64;
    }

    /**
     * Encrypts text and hides it in an emoji
     * @param text - The text to encrypt
     * @param password - The password
     * @param emoji - The emoji to use (optional)
     * @returns The emoji with hidden text
     */
    public encrypt(text: string, password: string, emoji: string = this.defaultEmoji): string {
        // Encrypt text
        const encrypted = this._encryptData(text, password);

        // Convert to Base64
        const base64 = this._bytesToBase64(encrypted);

        // Encode length (for decryption)
        const lengthBinary = base64.length.toString(2).padStart(16, '0');

        // Convert Base64 to binary
        const base64Binary = this._base64ToBinary(base64);

        // Convert binary string to invisible Unicode characters
        const invisibleSequence = this._binaryToInvisibleChars(lengthBinary + base64Binary);

        // Combine emoji with the invisible sequence
        // The invisible sequence is placed after the emoji
        return emoji + invisibleSequence;
    }

    /**
     * Decrypts text from an emoji
     * @param emojiMessage - The emoji with hidden text
     * @param password - The password
     * @returns The decrypted text
     */
    public decrypt(emojiMessage: string, password: string): string {
        try {
            // Split message by Unicode code points to correctly handle emojis
            const codePoints = Array.from(emojiMessage);

            // First element should be the emoji; the rest contains the hidden data
            if (codePoints.length <= 1) {
                return "Invalid message. No hidden data found.";
            }

            const emoji = codePoints[0];
            const invisibleSequence = codePoints.slice(1).join('');

            // Convert invisible sequence to binary string
            const binary = this._invisibleCharsToBinary(invisibleSequence);

            if (binary.length < 16) {
                return "No valid hidden data found.";
            }

            // Extract length
            const lengthBinary = binary.substring(0, 16);
            const length = parseInt(lengthBinary, 2);

            // Extract Base64 data and convert to bytes
            const base64Binary = binary.substring(16);
            const base64 = this._binaryToBase64(base64Binary);

            // Consider correct length (in case we added padding)
            const correctBase64 = base64.substring(0, length);

            const bytes = this._base64ToBytes(correctBase64);

            // Decrypt bytes
            return this._decryptData(bytes, password);
        } catch (error) {
            console.error("Decryption error:", error);
            return "Decryption failed. Wrong password or invalid message.";
        }
    }

    /**
     * Checks if an emoji contains hidden data
     * @param emojiMessage - The emoji to check
     * @returns true if the emoji contains hidden data, otherwise false
     */
    public hasHiddenData(emojiMessage: string): boolean {
        const codePoints = Array.from(emojiMessage);
        if (codePoints.length <= 1) {
            return false;
        }

        const invisibleSequence = codePoints.slice(1).join('');
        const binary = this._invisibleCharsToBinary(invisibleSequence);

        // If we have at least 16 bits (for the length indicator),
        // hidden data might be present
        return binary.length >= 16;
    }
}

/**
 * A simple helper function for quickly encrypting text in an emoji
 * @param text - The text to encrypt
 * @param password - The password
 * @param emoji - The emoji to use (optional)
 * @returns The emoji with hidden text
 */
export function encryptInEmoji(text: string, password: string, emoji?: string): string {
    const emojiSteg = new EmojiSteg();
    return emojiSteg.encrypt(text, password, emoji);
}

/**
 * A simple helper function for quickly decrypting text from an emoji
 * @param emojiMessage - The emoji with hidden text
 * @param password - The password
 * @returns The decrypted text
 */
export function decryptFromEmoji(emojiMessage: string, password: string): string {
    const emojiSteg = new EmojiSteg();
    return emojiSteg.decrypt(emojiMessage, password);
}