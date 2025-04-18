"use strict";
/**
 * EmojiSteg - TypeScript-Bibliothek für Unicode-Steganographie in Emojis
 *
 * Diese Bibliothek erlaubt es, Text in einem Emoji zu verstecken, indem sie unsichtbare
 * Unicode-Zeichen verwendet, die direkt mit dem Emoji verbunden werden.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmojiSteg = void 0;
exports.encryptInEmoji = encryptInEmoji;
exports.decryptFromEmoji = decryptFromEmoji;
/**
 * Hauptklasse für die Emoji-Steganographie
 */
var EmojiSteg = /** @class */ (function () {
    /**
     * Erstellt eine neue Instanz der EmojiSteg-Klasse
     * @param options Optionale Konfigurationsoptionen
     */
    function EmojiSteg(options) {
        // Unsichtbare Unicode-Zeichen für Steganographie
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
        // Variationsselektoren, die die Darstellung eines Zeichens ändern können
        // aber in den meisten Kontexten unsichtbar bleiben
        this.variationSelectors = [
            '\uFE00', '\uFE01', '\uFE02', '\uFE03', '\uFE04', '\uFE05', '\uFE06', '\uFE07',
            '\uFE08', '\uFE09', '\uFE0A', '\uFE0B', '\uFE0C', '\uFE0D', '\uFE0E', '\uFE0F'
        ];
        this.defaultEmoji = (options === null || options === void 0 ? void 0 : options.defaultEmoji) || "🔒";
        // Umfangreiche Emoji-Liste, die von iOS und Android unterstützt wird
        // Hinweis: Diese Liste kann nach Bedarf erweitert werden
        this.availableEmojis = (options === null || options === void 0 ? void 0 : options.customEmojis) || [
            // Smileys & Emotionen
            "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙",
            "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥",
            "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "😎", "🤓",
            "🧐", "😕", "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣",
            "😞", "😓", "😩", "😫", "🥱", "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽", "👾",
            "🤖", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾",
            // Gesten & Menschen
            "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍",
            "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂",
            "🦻", "👃", "🧠", "🫀", "🫁", "🦷", "🦴", "👀", "👁️", "👅", "👄", "👶", "🧒", "👦", "👧", "🧑", "👱", "👨", "🧔", "👨‍🦰",
            "👨‍🦱", "👨‍🦳", "👨‍🦲", "👩", "👩‍🦰", "🧑‍🦰", "👩‍🦱", "🧑‍🦱", "👩‍🦳", "🧑‍🦳", "👩‍🦲", "🧑‍🦲", "👱‍♀️", "👱‍♂️", "🧓", "👴", "👵",
            // Tiere
            "🐵", "🐒", "🦍", "🦧", "🐶", "🐕", "🦮", "🐕‍🦺", "🐩", "🐺", "🦊", "🦝", "🐱", "🐈", "🐈‍⬛", "🦁", "🐯", "🐅", "🐆", "🐴",
            "🐎", "🦄", "🦓", "🦌", "🦬", "🐮", "🐂", "🐃", "🐄", "🐷", "🐖", "🐗", "🐽", "🐏", "🐑", "🐐", "🐪", "🐫", "🦙", "🦒",
            "🐘", "🦣", "🦏", "🦛", "🐭", "🐁", "🐀", "🐹", "🐰", "🐇", "🐿️", "🦫", "🦔", "🦇", "🐻", "🐻‍❄️", "🐨", "🐼", "🦥", "🦦",
            "🦨", "🦘", "🦡", "🐾", "🦃", "🐔", "🐓", "🐣", "🐤", "🐥", "🐦", "🐧", "🕊️", "🦅", "🦆", "🦢", "🦉", "🦤", "🪶", "🦩",
            "🦚", "🦜", "🐸", "🐊", "🐢", "🦎", "🐍", "🐲", "🐉", "🦕", "🦖", "🐳", "🐋", "🐬", "🦭", "🐟", "🐠", "🐡", "🦈", "🐙",
            "🐚", "🐌", "🦋", "🐛", "🐜", "🐝", "🪲", "🐞", "🦗", "🪳", "🕷️", "🕸️", "🦂", "🦟", "🪰", "🪱",
            // Essen & Trinken
            "🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍍", "🥭", "🍎", "🍏", "🍐", "🍑", "🍒", "🍓", "🫐", "🥝", "🍅", "🫒", "🥥", "🥑",
            "🍆", "🥔", "🥕", "🌽", "🌶️", "🫑", "🥒", "🥬", "🥦", "🧄", "🧅", "🍄", "🥜", "🌰", "🍞", "🥐", "🥖", "🫓", "🥨", "🥯",
            "🥞", "🧇", "🧀", "🍖", "🍗", "🥩", "🥓", "🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🌯", "🫔", "🥙", "🧆", "🥚", "🍳", "🥘",
            "🍲", "🫕", "🥣", "🥗", "🍿", "🧈", "🧂", "🥫", "🍱", "🍘", "🍙", "🍚", "🍛", "🍜", "🍝", "🍠", "🍢", "🍣", "🍤", "🍥",
            "🥮", "🍡", "🥟", "🥠", "🥡", "🦀", "🦞", "🦐", "🦑", "🦪", "🍦", "🍧", "🍨", "🍩", "🍪", "🎂", "🍰", "🧁", "🥧", "🍫",
            "🍬", "🍭", "🍮", "🍯", "🍼", "🥛", "☕", "🫖", "🍵", "🍶", "🍾", "🍷", "🍸", "🍹", "🍺", "🍻", "🥂", "🥃", "🥤", "🧋",
            "🧃", "🧉", "🧊",
            // Sport & Aktivitäten
            "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳",
            "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂", "🏋️", "🏋️‍♀️", "🏋️‍♂️", "🤼",
            "🤼‍♀️", "🤼‍♂️", "🤸", "🤸‍♀️", "🤸‍♂️", "⛹️", "⛹️‍♀️", "⛹️‍♂️", "🤺", "🤾", "🤾‍♀️", "🤾‍♂️", "🏌️", "🏌️‍♀️", "🏌️‍♂️", "🏇", "🧘", "🧘‍♀️", "🧘‍♂️", "🏄",
            "🏄‍♀️", "🏄‍♂️", "🏊", "🏊‍♀️", "🏊‍♂️", "🤽", "🤽‍♀️", "🤽‍♂️", "🚣", "🚣‍♀️", "🚣‍♂️", "🧗", "🧗‍♀️", "🧗‍♂️", "🚵", "🚵‍♀️", "🚵‍♂️", "🚴", "🚴‍♀️", "🚴‍♂️",
            // Reisen & Orte
            "🚀", "🛸", "🛰️", "🪐", "🌍", "🌎", "🌏", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌙", "🌚", "🌛", "🌜", "☀️",
            "🌝", "🌞", "⭐", "🌟", "🌠", "🌌", "☁️", "⛅", "⛈️", "🌤️", "🌥️", "🌦️", "🌧️", "🌨️", "🌩️", "🌪️", "🌫️", "🌬️", "🌈", "☂️",
            "☔", "⚡", "❄️", "☃️", "⛄", "☄️", "🔥", "💧", "🌊", "🏙️", "🌆", "🌇", "🌃", "🌉", "🏠", "🏡", "🏗️", "🏢", "🏬", "🏣",
            "🏤", "🏥", "🏦", "🏨", "🏪", "🏫", "🏩", "💒", "🏛️", "⛪", "🕌", "🕍", "🛕", "🕋", "⛩️", "🛤️", "🛣️", "🗾", "🎑", "🏞️",
            "🌅", "🌄", "🌠", "🎇", "🎆", "🌇", "🏙️", "🌃", "🌌", "🌉", "🌁", "🛫", "🛬", "🛩️", "💺", "🚁", "🚟", "🚠", "🚡", "🚀",
            "🛸", "🚇", "🚄", "🚅", "🚈", "🚉", "🚂", "🚆", "🚊", "🚞", "🚝", "🚋", "🚌", "🚍", "🚎", "🚐", "🚑", "🚒", "🚓", "🚔",
            "🚕", "🚖", "🚗", "🚘", "🚙", "🚚", "🚛", "🚜", "🦯", "🦽", "🦼", "🛴", "🚲", "🛵", "🏍️", "🛺", "🚨", "🚥", "🚦", "🛑",
            "🚧", "⚓", "⛵", "🛶", "🚤", "🛳️", "⛴️", "🛥️", "🚢", "✈️", "🛫", "🛬", "🪂", "💺", "🚁", "🚟", "🚠", "🚡", "🚁", "🚀",
            // Objekte & Symbole
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
        ];
    }
    /**
     * Erzeugt einen Hash-Wert aus einem Passwort und Salz
     * @param password - Das Passwort
     * @param salt - Das Salz (optional)
     * @returns Ein Hash-Wert als Byte-Array
     * @private
     */
    EmojiSteg.prototype._generateKey = function (password, salt) {
        if (salt === void 0) { salt = 'EmojiSteg'; }
        // Einfache Hash-Funktion mit mehreren Runden
        var input = password + salt;
        var hash = new Uint8Array(16); // 128-Bit-Schlüssel
        // Befülle das Array initial mit den Zeichencodes des Inputs
        for (var i = 0; i < input.length; i++) {
            hash[i % 16] ^= input.charCodeAt(i);
        }
        // Mehrere Runden für einen besseren Hash
        for (var round = 0; round < 1000; round++) {
            var newHash = new Uint8Array(16);
            for (var i = 0; i < 16; i++) {
                // Einfache Hash-Operation
                newHash[i] = hash[(i + 1) % 16] ^ hash[(i + 7) % 16] ^ round;
            }
            hash = newHash;
        }
        return hash;
    };
    /**
     * Verschlüsselt einen Text mit einem Passwort
     * @param text - Der zu verschlüsselnde Text
     * @param password - Das Passwort
     * @returns Die verschlüsselten Daten
     * @private
     */
    EmojiSteg.prototype._encryptData = function (text, password) {
        var key = this._generateKey(password);
        var textBytes = new TextEncoder().encode(text);
        var encrypted = new Uint8Array(textBytes.length);
        // XOR mit dem Schlüssel und zusätzlicher Position
        for (var i = 0; i < textBytes.length; i++) {
            // Verwende verschiedene Teile des Schlüssels basierend auf der Position
            var keyByte = key[i % key.length];
            var positionFactor = i % 256;
            encrypted[i] = textBytes[i] ^ keyByte ^ positionFactor;
        }
        return encrypted;
    };
    /**
     * Entschlüsselt Daten mit einem Passwort
     * @param encrypted - Die verschlüsselten Daten
     * @param password - Das Passwort
     * @returns Der entschlüsselte Text
     * @private
     */
    EmojiSteg.prototype._decryptData = function (encrypted, password) {
        var key = this._generateKey(password);
        var decrypted = new Uint8Array(encrypted.length);
        // XOR mit dem Schlüssel und zusätzlicher Position (umgekehrt)
        for (var i = 0; i < encrypted.length; i++) {
            var keyByte = key[i % key.length];
            var positionFactor = i % 256;
            decrypted[i] = encrypted[i] ^ keyByte ^ positionFactor;
        }
        return new TextDecoder().decode(decrypted);
    };
    /**
     * Konvertiert Bytes in eine Base64-Zeichenkette
     * @param data - Die zu konvertierenden Daten
     * @returns Die Base64-Repräsentation
     * @private
     */
    EmojiSteg.prototype._bytesToBase64 = function (data) {
        // In modernen Browsern:
        if (typeof btoa === 'function') {
            var binString = Array.from(data)
                .map(function (byte) { return String.fromCharCode(byte); })
                .join('');
            return btoa(binString);
        }
        // Für Node.js und andere Umgebungen:
        else if (typeof Buffer !== 'undefined') {
            return Buffer.from(data).toString('base64');
        }
        // Fallback-Implementierung (für andere Umgebungen)
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
     * Konvertiert eine Base64-Zeichenkette zurück in Bytes
     * @param base64 - Die Base64-Zeichenkette
     * @returns Die dekodierten Daten
     * @private
     */
    EmojiSteg.prototype._base64ToBytes = function (base64) {
        // In modernen Browsern:
        if (typeof atob === 'function') {
            var binString = atob(base64);
            var bytes = new Uint8Array(binString.length);
            for (var i = 0; i < binString.length; i++) {
                bytes[i] = binString.charCodeAt(i);
            }
            return bytes;
        }
        // Für Node.js und andere Umgebungen:
        else if (typeof Buffer !== 'undefined') {
            var buffer = Buffer.from(base64, 'base64');
            return new Uint8Array(buffer);
        }
        // Fallback-Implementierung (für andere Umgebungen)
        else {
            var table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            // Entferne Padding-Zeichen
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
     * Kodiert einen binären String in eine Sequenz unsichtbarer Unicode-Zeichen
     * @param binaryString - Ein String aus 0 und 1
     * @returns Unsichtbare Unicode-Sequenz
     * @private
     */
    EmojiSteg.prototype._binaryToInvisibleChars = function (binaryString) {
        var result = '';
        // Konvertiere Bits zu unsichtbaren Zeichen
        // 0 = Zero-Width Non-Joiner
        // 1 = Zero-Width Joiner
        for (var i = 0; i < binaryString.length; i++) {
            if (binaryString[i] === '0') {
                result += this.invisibleChars[0]; // ZWNJ für 0
            }
            else {
                result += this.invisibleChars[1]; // ZWJ für 1
            }
            // Füge gelegentlich einen Variation-Selektor hinzu, um die Muster zu variieren
            // und die Erkennung zu erschweren
            if (i % 8 === 7) {
                var vsIndex = Math.floor(Math.random() * this.variationSelectors.length);
                result += this.variationSelectors[vsIndex];
            }
        }
        return result;
    };
    /**
     * Dekodiert eine Sequenz unsichtbarer Unicode-Zeichen in einen binären String
     * @param invisibleSequence - Die unsichtbare Unicode-Sequenz
     * @returns Binärer String aus 0 und 1
     * @private
     */
    EmojiSteg.prototype._invisibleCharsToBinary = function (invisibleSequence) {
        var binaryString = '';
        // Extrahiere Bits aus der unsichtbaren Sequenz
        for (var i = 0; i < invisibleSequence.length; i++) {
            var char = invisibleSequence.charAt(i);
            // Überspringe Variation-Selektoren
            if (this.variationSelectors.includes(char)) {
                continue;
            }
            if (char === this.invisibleChars[0]) { // ZWNJ
                binaryString += '0';
            }
            else if (char === this.invisibleChars[1]) { // ZWJ
                binaryString += '1';
            }
            // Andere unsichtbare Zeichen werden ignoriert
        }
        return binaryString;
    };
    /**
     * Konvertiert eine Base64-Zeichenkette in eine Binärzeichenkette
     * @param base64 - Die Base64-Zeichenkette
     * @returns Binärzeichenkette (0 und 1)
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
     * Konvertiert eine Binärzeichenkette in eine Base64-Zeichenkette
     * @param binary - Die Binärzeichenkette
     * @returns Base64-Zeichenkette
     * @private
     */
    EmojiSteg.prototype._binaryToBase64 = function (binary) {
        // Stelle sicher, dass die Länge der Binärzeichenkette ein Vielfaches von 8 ist
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
     * Verschlüsselt einen Text und versteckt ihn in einem Emoji
     * @param text - Der zu verschlüsselnde Text
     * @param password - Das Passwort
     * @param emoji - Das zu verwendende Emoji (optional)
     * @returns Das Emoji mit verstecktem Text
     */
    EmojiSteg.prototype.encrypt = function (text, password, emoji) {
        if (emoji === void 0) { emoji = this.defaultEmoji; }
        // Text verschlüsseln
        var encrypted = this._encryptData(text, password);
        // In Base64 umwandeln
        var base64 = this._bytesToBase64(encrypted);
        // Länge kodieren (für die Entschlüsselung)
        var lengthBinary = base64.length.toString(2).padStart(16, '0');
        // Base64 in Binär umwandeln
        var base64Binary = this._base64ToBinary(base64);
        // Binärstring in unsichtbare Unicode-Zeichen umwandeln
        var invisibleSequence = this._binaryToInvisibleChars(lengthBinary + base64Binary);
        // Emoji mit der unsichtbaren Sequenz verbinden
        // Die unsichtbare Sequenz wird nach dem Emoji platziert
        return emoji + invisibleSequence;
    };
    /**
     * Entschlüsselt Text aus einem Emoji
     * @param emojiMessage - Das Emoji mit verstecktem Text
     * @param password - Das Passwort
     * @returns Der entschlüsselte Text
     */
    EmojiSteg.prototype.decrypt = function (emojiMessage, password) {
        try {
            // Erstes Zeichen ist das Emoji, der Rest enthält die versteckten Daten
            if (emojiMessage.length <= 1) {
                return "Ungültige Nachricht. Keine versteckten Daten gefunden.";
            }
            var emoji = emojiMessage.charAt(0);
            var invisibleSequence = emojiMessage.substring(1);
            // Unsichtbare Sequenz in Binärstring umwandeln
            var binary = this._invisibleCharsToBinary(invisibleSequence);
            if (binary.length < 16) {
                return "Keine gültigen versteckten Daten gefunden.";
            }
            // Länge extrahieren
            var lengthBinary = binary.substring(0, 16);
            var length_1 = parseInt(lengthBinary, 2);
            // Base64-Daten extrahieren und in Bytes umwandeln
            var base64Binary = binary.substring(16);
            var base64 = this._binaryToBase64(base64Binary);
            // Korrekte Länge berücksichtigen (falls wir Padding hinzugefügt haben)
            var correctBase64 = base64.substring(0, length_1);
            var bytes = this._base64ToBytes(correctBase64);
            // Bytes entschlüsseln
            return this._decryptData(bytes, password);
        }
        catch (error) {
            console.error("Decryption error:", error);
            return "Entschlüsselung fehlgeschlagen. Falsches Passwort oder ungültige Nachricht.";
        }
    };
    /**
     * Gibt eine zufällige Emoji aus der verfügbaren Liste zurück
     * @returns Ein zufälliges Emoji
     */
    EmojiSteg.prototype.getRandomEmoji = function () {
        var randomIndex = Math.floor(Math.random() * this.availableEmojis.length);
        return this.availableEmojis[randomIndex];
    };
    /**
     * Prüft, ob ein Emoji versteckte Daten enthält
     * @param emojiMessage - Das zu prüfende Emoji
     * @returns true, wenn das Emoji versteckte Daten enthält, sonst false
     */
    EmojiSteg.prototype.hasHiddenData = function (emojiMessage) {
        if (emojiMessage.length <= 1) {
            return false;
        }
        var invisibleSequence = emojiMessage.substring(1);
        var binary = this._invisibleCharsToBinary(invisibleSequence);
        // Wenn wir mindestens 16 Bits (für die Längenangabe) haben,
        // könnten versteckte Daten vorhanden sein
        return binary.length >= 16;
    };
    return EmojiSteg;
}());
exports.EmojiSteg = EmojiSteg;
/**
 * Eine einfache Hilfsfunktion zum schnellen Verschlüsseln von Text in einem Emoji
 * @param text - Der zu verschlüsselnde Text
 * @param password - Das Passwort
 * @param emoji - Das zu verwendende Emoji (optional)
 * @returns Das Emoji mit verstecktem Text
 */
function encryptInEmoji(text, password, emoji) {
    var emojiSteg = new EmojiSteg();
    return emojiSteg.encrypt(text, password, emoji);
}
/**
 * Eine einfache Hilfsfunktion zum schnellen Entschlüsseln von Text aus einem Emoji
 * @param emojiMessage - Das Emoji mit verstecktem Text
 * @param password - Das Passwort
 * @returns Der entschlüsselte Text
 */
function decryptFromEmoji(emojiMessage, password) {
    var emojiSteg = new EmojiSteg();
    return emojiSteg.decrypt(emojiMessage, password);
}
