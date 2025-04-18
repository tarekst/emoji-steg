"use strict";
/**
 * EmojiSteg - TypeScript library for Unicode steganography in emojis
 *
 * This library allows hiding text in an emoji by using invisible
 * Unicode characters that are directly attached to the emoji.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmojiSteg = void 0;
exports.encryptInEmoji = encryptInEmoji;
exports.decryptFromEmoji = decryptFromEmoji;
/**
 * Main class for emoji steganography
 */
var EmojiSteg = /** @class */ (function () {
    /**
     * Creates a new instance of the EmojiSteg class
     * @param options Optional configuration options
     */
    function EmojiSteg(options) {
        // Invisible Unicode characters for steganography
        this.invisibleChars = [
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
            '\u206F' // Nominal Digit Shapes
        ];
        // Variation selectors that can change the appearance of a character
        // but remain invisible in most contexts
        this.variationSelectors = [
            '\uFE00', '\uFE01', '\uFE02', '\uFE03', '\uFE04', '\uFE05', '\uFE06', '\uFE07',
            '\uFE08', '\uFE09', '\uFE0A', '\uFE0B', '\uFE0C', '\uFE0D', '\uFE0E', '\uFE0F'
        ];
        this.defaultEmoji = (options === null || options === void 0 ? void 0 : options.defaultEmoji) || "🔒";

        // Emoji categories, organized as a map
        this.emojiCategories = (options === null || options === void 0 ? void 0 : options.customEmojiCategories) || {
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
    EmojiSteg.prototype.getCategories = function() {
        return Object.keys(this.emojiCategories);
    };

    /**
     * Returns all emojis of a specific category
     * @param category - The name of the category
     * @returns Array with emojis of the specified category or empty array if category doesn't exist
     */
    EmojiSteg.prototype.getEmojisByCategory = function(category) {
        return this.emojiCategories[category] || [];
    };

    /**
     * Returns a random emoji from all categories
     * @returns A random emoji
     */
    EmojiSteg.prototype.getRandomEmoji = function() {
        // All categories as array
        const categories = this.getCategories();

        // Choose a random category
        const randomCategoryIndex = Math.floor(Math.random() * categories.length);
        const randomCategory = categories[randomCategoryIndex];

        // Choose a random emoji from the category
        const emojisInCategory = this.emojiCategories[randomCategory];
        const randomEmojiIndex = Math.floor(Math.random() * emojisInCategory.length);

        return emojisInCategory[randomEmojiIndex];
    };

    /**
     * Returns a random emoji from a specific category
     * @param category - The name of the category
     * @returns A random emoji from the specified category
     */
    EmojiSteg.prototype.getRandomEmojiFromCategory = function(category) {
        const emojis = this.getEmojisByCategory(category);
        if (emojis.length === 0) {
            return this.getRandomEmoji(); // Fallback: Random emoji from all categories
        }

        const randomIndex = Math.floor(Math.random() * emojis.length);
        return emojis[randomIndex];
    };

    /**
     * Generates a hash value from a password and salt
     * @param password - The password
     * @param salt - The salt (optional)
     * @returns A hash value as byte array
     * @private
     */
    EmojiSteg.prototype._generateKey = function (password, salt) {
        if (salt === void 0) { salt = 'EmojiSteg'; }
        // Simple hash function with multiple rounds
        var input = password + salt;
        var hash = new Uint8Array(16); // 128-bit key
        // Initialize the array with character codes from the input
        for (var i = 0; i < input.length; i++) {
            hash[i % 16] ^= input.charCodeAt(i);
        }
        // Multiple rounds for a better hash
        for (var round = 0; round < 1000; round++) {
            var newHash = new Uint8Array(16);
            for (var i = 0; i < 16; i++) {
                // Simple hash operation
                newHash[i] = hash[(i + 1) % 16] ^ hash[(i + 7) % 16] ^ round;
            }
            hash = newHash;
        }
        return hash;
    };
    /**
     * Encrypts text with a password
     * @param text - The text to encrypt
     * @param password - The password
     * @returns The encrypted data
     * @private
     */
    EmojiSteg.prototype._encryptData = function (text, password) {
        var key = this._generateKey(password);
        var textBytes = new TextEncoder().encode(text);
        var encrypted = new Uint8Array(textBytes.length);
        // XOR with the key and additional position
        for (var i = 0; i < textBytes.length; i++) {
            // Use different parts of the key based on position
            var keyByte = key[i % key.length];
            var positionFactor = i % 256;
            encrypted[i] = textBytes[i] ^ keyByte ^ positionFactor;
        }
        return encrypted;
    };
    /**
     * Decrypts data with a password
     * @param encrypted - The encrypted data
     * @param password - The password
     * @returns The decrypted text
     * @private
     */
    EmojiSteg.prototype._decryptData = function (encrypted, password) {
        var key = this._generateKey(password);
        var decrypted = new Uint8Array(encrypted.length);
        // XOR with the key and additional position (reversed)
        for (var i = 0; i < encrypted.length; i++) {
            var keyByte = key[i % key.length];
            var positionFactor = i % 256;
            decrypted[i] = encrypted[i] ^ keyByte ^ positionFactor;
        }
        return new TextDecoder().decode(decrypted);
    };
    /**
     * Converts bytes to a Base64 string
     * @param data - The data to convert
     * @returns The Base64 representation
     * @private
     */
    EmojiSteg.prototype._bytesToBase64 = function (data) {
        // In modern browsers:
        if (typeof btoa === 'function') {
            var binString = Array.from(data)
              .map(function (byte) { return String.fromCharCode(byte); })
              .join('');
            return btoa(binString);
        }
        // For Node.js and other environments:
        else if (typeof Buffer !== 'undefined') {
            return Buffer.from(data).toString('base64');
        }
        // Fallback implementation (for other environments)
        else {
            var binString = Array.from(data)
              .map(function (byte) { return String.fromCharCode(byte); })
              .join('');
            var table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            var result = '';
            for (var i = 0; i < binString.length; i += 3) {
                var triplet = (binString.charCodeAt(i) << 16) |
                  ((i + 1 < binString.length) ? binString.charCodeAt(i + 1) << 8 : 0) |
                  ((i + 2 < binString.length) ? binString.charCodeAt(i + 2) : 0);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > binString.length * 8) {
                        result += '=';
                    }
                    else {
                        result += table.charAt((triplet >>> (6 * (3 - j))) & 0x3F);
                    }
                }
            }
            return result;
        }
    };
    /**
     * Converts a Base64 string back to bytes
     * @param base64 - The Base64 string
     * @returns The decoded data
     * @private
     */
    EmojiSteg.prototype._base64ToBytes = function (base64) {
        // In modern browsers:
        if (typeof atob === 'function') {
            var binString = atob(base64);
            var bytes = new Uint8Array(binString.length);
            for (var i = 0; i < binString.length; i++) {
                bytes[i] = binString.charCodeAt(i);
            }
            return bytes;
        }
        // For Node.js and other environments:
        else if (typeof Buffer !== 'undefined') {
            var buffer = Buffer.from(base64, 'base64');
            return new Uint8Array(buffer);
        }
        // Fallback implementation (for other environments)
        else {
            var table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            // Remove padding characters
            base64 = base64.replace(/=+$/, '');
            var binString = [];
            for (var i = 0; i < base64.length; i += 4) {
                var chunk = [
                    table.indexOf(base64.charAt(i)),
                    table.indexOf(base64.charAt(i + 1)),
                    table.indexOf(base64.charAt(i + 2)),
                    table.indexOf(base64.charAt(i + 3))
                ];
                var triplet = (chunk[0] << 18) | (chunk[1] << 12) |
                  ((chunk[2] & 0x3F) << 6) | (chunk[3] & 0x3F);
                for (var j = 0; j < 3 && i * 4 + j * 8 < base64.length * 6; j++) {
                    binString.push(String.fromCharCode((triplet >>> (16 - j * 8)) & 0xFF));
                }
            }
            var bytes = new Uint8Array(binString.length);
            for (var i = 0; i < binString.length; i++) {
                bytes[i] = binString[i].charCodeAt(0);
            }
            return bytes;
        }
    };
    /**
     * Encodes a binary string into a sequence of invisible Unicode characters
     * @param binaryString - A string of 0s and 1s
     * @returns Invisible Unicode sequence
     * @private
     */
    EmojiSteg.prototype._binaryToInvisibleChars = function (binaryString) {
        var result = '';
        // Convert bits to invisible characters
        // 0 = Zero-Width Non-Joiner
        // 1 = Zero-Width Joiner
        for (var i = 0; i < binaryString.length; i++) {
            if (binaryString[i] === '0') {
                result += this.invisibleChars[0]; // ZWNJ for 0
            }
            else {
                result += this.invisibleChars[1]; // ZWJ for 1
            }
            // Occasionally add a variation selector to vary patterns
            // and make detection more difficult
            if (i % 8 === 7) {
                var vsIndex = Math.floor(Math.random() * this.variationSelectors.length);
                result += this.variationSelectors[vsIndex];
            }
        }
        return result;
    };
    /**
     * Decodes a sequence of invisible Unicode characters into a binary string
     * @param invisibleSequence - The invisible Unicode sequence
     * @returns Binary string of 0s and 1s
     * @private
     */
    EmojiSteg.prototype._invisibleCharsToBinary = function (invisibleSequence) {
        var binaryString = '';
        // Extract bits from the invisible sequence
        for (var i = 0; i < invisibleSequence.length; i++) {
            var char = invisibleSequence.charAt(i);
            // Skip variation selectors
            if (this.variationSelectors.includes(char)) {
                continue;
            }
            if (char === this.invisibleChars[0]) { // ZWNJ
                binaryString += '0';
            }
            else if (char === this.invisibleChars[1]) { // ZWJ
                binaryString += '1';
            }
            // Other invisible characters are ignored
        }
        return binaryString;
    };
    /**
     * Converts a Base64 string to a binary string
     * @param base64 - The Base64 string
     * @returns Binary string (0s and 1s)
     * @private
     */
    EmojiSteg.prototype._base64ToBinary = function (base64) {
        var binary = '';
        for (var i = 0; i < base64.length; i++) {
            var charCode = base64.charCodeAt(i);
            var bits = charCode.toString(2).padStart(8, '0');
            binary += bits;
        }
        return binary;
    };
    /**
     * Converts a binary string to a Base64 string
     * @param binary - The binary string
     * @returns Base64 string
     * @private
     */
    EmojiSteg.prototype._binaryToBase64 = function (binary) {
        // Ensure the length of the binary string is a multiple of 8
        var paddedBinary = binary.padEnd(Math.ceil(binary.length / 8) * 8, '0');
        var base64 = '';
        for (var i = 0; i < paddedBinary.length; i += 8) {
            var byte = paddedBinary.substr(i, 8);
            var charCode = parseInt(byte, 2);
            base64 += String.fromCharCode(charCode);
        }
        return base64;
    };
    /**
     * Encrypts text and hides it in an emoji
     * @param text - The text to encrypt
     * @param password - The password
     * @param emoji - The emoji to use (optional)
     * @returns The emoji with hidden text
     */
    EmojiSteg.prototype.encrypt = function (text, password, emoji) {
        if (emoji === void 0) { emoji = this.defaultEmoji; }
        // Encrypt text
        var encrypted = this._encryptData(text, password);
        // Convert to Base64
        var base64 = this._bytesToBase64(encrypted);
        // Encode length (for decryption)
        var lengthBinary = base64.length.toString(2).padStart(16, '0');
        // Convert Base64 to binary
        var base64Binary = this._base64ToBinary(base64);
        // Convert binary string to invisible Unicode characters
        var invisibleSequence = this._binaryToInvisibleChars(lengthBinary + base64Binary);
        // Combine emoji with the invisible sequence
        // The invisible sequence is placed after the emoji
        return emoji + invisibleSequence;
    };
    /**
     * Decrypts text from an emoji
     * @param emojiMessage - The emoji with hidden text
     * @param password - The password
     * @returns The decrypted text
     */
    EmojiSteg.prototype.decrypt = function (emojiMessage, password) {
        try {
            // First character is the emoji, the rest contains the hidden data
            if (emojiMessage.length <= 1) {
                return "Invalid message. No hidden data found.";
            }
            var emoji = emojiMessage.charAt(0);
            var invisibleSequence = emojiMessage.substring(1);
            // Convert invisible sequence to binary string
            var binary = this._invisibleCharsToBinary(invisibleSequence);
            if (binary.length < 16) {
                return "No valid hidden data found.";
            }
            // Extract length
            var lengthBinary = binary.substring(0, 16);
            var length_1 = parseInt(lengthBinary, 2);
            // Extract Base64 data and convert to bytes
            var base64Binary = binary.substring(16);
            var base64 = this._binaryToBase64(base64Binary);
            // Consider correct length (in case we added padding)
            var correctBase64 = base64.substring(0, length_1);
            var bytes = this._base64ToBytes(correctBase64);
            // Decrypt bytes
            return this._decryptData(bytes, password);
        }
        catch (error) {
            console.error("Decryption error:", error);
            return "Decryption failed. Wrong password or invalid message.";
        }
    };
    /**
     * Checks if an emoji contains hidden data
     * @param emojiMessage - The emoji to check
     * @returns true if the emoji contains hidden data, otherwise false
     */
    EmojiSteg.prototype.hasHiddenData = function (emojiMessage) {
        if (emojiMessage.length <= 1) {
            return false;
        }
        var invisibleSequence = emojiMessage.substring(1);
        var binary = this._invisibleCharsToBinary(invisibleSequence);
        // If we have at least 16 bits (for the length indicator),
        // hidden data might be present
        return binary.length >= 16;
    };
    return EmojiSteg;
}());
exports.EmojiSteg = EmojiSteg;
/**
 * A simple helper function for quickly encrypting text in an emoji
 * @param text - The text to encrypt
 * @param password - The password
 * @param emoji - The emoji to use (optional)
 * @returns The emoji with hidden text
 */
function encryptInEmoji(text, password, emoji) {
    var emojiSteg = new EmojiSteg();
    return emojiSteg.encrypt(text, password, emoji);
}
/**
 * A simple helper function for quickly decrypting text from an emoji
 * @param emojiMessage - The emoji with hidden text
 * @param password - The password
 * @returns The decrypted text
 */
function decryptFromEmoji(emojiMessage, password) {
    var emojiSteg = new EmojiSteg();
    return emojiSteg.decrypt(emojiMessage, password);
}