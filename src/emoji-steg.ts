/**
 * EmojiSteg - TypeScript-Bibliothek für Unicode-Steganographie in Emojis
 *
 * Diese Bibliothek erlaubt es, Text in einem Emoji zu verstecken, indem sie unsichtbare
 * Unicode-Zeichen verwendet, die direkt mit dem Emoji verbunden werden.
 */

// Schnittstelle für die Optionen der Bibliothek
export interface EmojiStegOptions {
    /** Das Standard-Emoji, falls keines angegeben wird */
    defaultEmoji?: string;
    /** Eine angepasste Liste von Emojis (optional) */
    customEmojis?: string[];
}

/**
 * Hauptklasse für die Emoji-Steganographie
 */
export class EmojiSteg {
    // Standard-Emoji, falls keines angegeben wird
    private defaultEmoji: string;

    // Liste aller verfügbaren Emojis für die Benutzung
    public availableEmojis: string[];

    // Unsichtbare Unicode-Zeichen für Steganographie
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

    // Variationsselektoren, die die Darstellung eines Zeichens ändern können
    // aber in den meisten Kontexten unsichtbar bleiben
    private readonly variationSelectors: string[] = [
        '\uFE00', '\uFE01', '\uFE02', '\uFE03', '\uFE04', '\uFE05', '\uFE06', '\uFE07',
        '\uFE08', '\uFE09', '\uFE0A', '\uFE0B', '\uFE0C', '\uFE0D', '\uFE0E', '\uFE0F'
    ];

    /**
     * Erstellt eine neue Instanz der EmojiSteg-Klasse
     * @param options Optionale Konfigurationsoptionen
     */
    constructor(options?: EmojiStegOptions) {
        this.defaultEmoji = options?.defaultEmoji || "🔒";

        // Umfangreiche Emoji-Liste, die von iOS und Android unterstützt wird
        // Hinweis: Diese Liste kann nach Bedarf erweitert werden
        this.availableEmojis = options?.customEmojis || [
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
    private _generateKey(password: string, salt: string = 'EmojiSteg'): Uint8Array {
        // Einfache Hash-Funktion mit mehreren Runden
        const input = password + salt;
        let hash = new Uint8Array(16); // 128-Bit-Schlüssel

        // Befülle das Array initial mit den Zeichencodes des Inputs
        for (let i = 0; i < input.length; i++) {
            hash[i % 16] ^= input.charCodeAt(i);
        }

        // Mehrere Runden für einen besseren Hash
        for (let round = 0; round < 1000; round++) {
            const newHash = new Uint8Array(16);
            for (let i = 0; i < 16; i++) {
                // Einfache Hash-Operation
                newHash[i] = hash[(i + 1) % 16] ^ hash[(i + 7) % 16] ^ round;
            }
            hash = newHash;
        }

        return hash;
    }

    /**
     * Verschlüsselt einen Text mit einem Passwort
     * @param text - Der zu verschlüsselnde Text
     * @param password - Das Passwort
     * @returns Die verschlüsselten Daten
     * @private
     */
    private _encryptData(text: string, password: string): Uint8Array {
        const key = this._generateKey(password);
        const textBytes = new TextEncoder().encode(text);
        const encrypted = new Uint8Array(textBytes.length);

        // XOR mit dem Schlüssel und zusätzlicher Position
        for (let i = 0; i < textBytes.length; i++) {
            // Verwende verschiedene Teile des Schlüssels basierend auf der Position
            const keyByte = key[i % key.length];
            const positionFactor = i % 256;
            encrypted[i] = textBytes[i] ^ keyByte ^ positionFactor;
        }

        return encrypted;
    }

    /**
     * Entschlüsselt Daten mit einem Passwort
     * @param encrypted - Die verschlüsselten Daten
     * @param password - Das Passwort
     * @returns Der entschlüsselte Text
     * @private
     */
    private _decryptData(encrypted: Uint8Array, password: string): string {
        const key = this._generateKey(password);
        const decrypted = new Uint8Array(encrypted.length);

        // XOR mit dem Schlüssel und zusätzlicher Position (umgekehrt)
        for (let i = 0; i < encrypted.length; i++) {
            const keyByte = key[i % key.length];
            const positionFactor = i % 256;
            decrypted[i] = encrypted[i] ^ keyByte ^ positionFactor;
        }

        return new TextDecoder().decode(decrypted);
    }

    /**
     * Konvertiert Bytes in eine Base64-Zeichenkette
     * @param data - Die zu konvertierenden Daten
     * @returns Die Base64-Repräsentation
     * @private
     */
    private _bytesToBase64(data: Uint8Array): string {
        // In modernen Browsern:
        if (typeof btoa === 'function') {
            const binString = Array.from(data)
                .map(byte => String.fromCharCode(byte))
                .join('');
            return btoa(binString);
        }

        // Für Node.js und andere Umgebungen:
        else if (typeof Buffer !== 'undefined') {
            return Buffer.from(data).toString('base64');
        }

        // Fallback-Implementierung (für andere Umgebungen)
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
     * Konvertiert eine Base64-Zeichenkette zurück in Bytes
     * @param base64 - Die Base64-Zeichenkette
     * @returns Die dekodierten Daten
     * @private
     */
    private _base64ToBytes(base64: string): Uint8Array {
        // In modernen Browsern:
        if (typeof atob === 'function') {
            const binString = atob(base64);
            const bytes = new Uint8Array(binString.length);
            for (let i = 0; i < binString.length; i++) {
                bytes[i] = binString.charCodeAt(i);
            }
            return bytes;
        }

        // Für Node.js und andere Umgebungen:
        else if (typeof Buffer !== 'undefined') {
            const buffer = Buffer.from(base64, 'base64');
            return new Uint8Array(buffer);
        }

        // Fallback-Implementierung (für andere Umgebungen)
        else {
            const table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

            // Entferne Padding-Zeichen
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
     * Kodiert einen binären String in eine Sequenz unsichtbarer Unicode-Zeichen
     * @param binaryString - Ein String aus 0 und 1
     * @returns Unsichtbare Unicode-Sequenz
     * @private
     */
    private _binaryToInvisibleChars(binaryString: string): string {
        let result = '';

        // Konvertiere Bits zu unsichtbaren Zeichen
        // 0 = Zero-Width Non-Joiner
        // 1 = Zero-Width Joiner
        for (let i = 0; i < binaryString.length; i++) {
            if (binaryString[i] === '0') {
                result += this.invisibleChars[0]; // ZWNJ für 0
            } else {
                result += this.invisibleChars[1]; // ZWJ für 1
            }

            // Füge gelegentlich einen Variation-Selektor hinzu, um die Muster zu variieren
            // und die Erkennung zu erschweren
            if (i % 8 === 7) {
                const vsIndex = Math.floor(Math.random() * this.variationSelectors.length);
                result += this.variationSelectors[vsIndex];
            }
        }

        return result;
    }

    /**
     * Dekodiert eine Sequenz unsichtbarer Unicode-Zeichen in einen binären String
     * @param invisibleSequence - Die unsichtbare Unicode-Sequenz
     * @returns Binärer String aus 0 und 1
     * @private
     */
    private _invisibleCharsToBinary(invisibleSequence: string): string {
        let binaryString = '';

        // Extrahiere Bits aus der unsichtbaren Sequenz
        for (let i = 0; i < invisibleSequence.length; i++) {
            const char = invisibleSequence.charAt(i);

            // Überspringe Variation-Selektoren
            if (this.variationSelectors.includes(char)) {
                continue;
            }

            if (char === this.invisibleChars[0]) { // ZWNJ
                binaryString += '0';
            } else if (char === this.invisibleChars[1]) { // ZWJ
                binaryString += '1';
            }
            // Andere unsichtbare Zeichen werden ignoriert
        }

        return binaryString;
    }

    /**
     * Konvertiert eine Base64-Zeichenkette in eine Binärzeichenkette
     * @param base64 - Die Base64-Zeichenkette
     * @returns Binärzeichenkette (0 und 1)
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
     * Konvertiert eine Binärzeichenkette in eine Base64-Zeichenkette
     * @param binary - Die Binärzeichenkette
     * @returns Base64-Zeichenkette
     * @private
     */
    private _binaryToBase64(binary: string): string {
        // Stelle sicher, dass die Länge der Binärzeichenkette ein Vielfaches von 8 ist
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
     * Verschlüsselt einen Text und versteckt ihn in einem Emoji
     * @param text - Der zu verschlüsselnde Text
     * @param password - Das Passwort
     * @param emoji - Das zu verwendende Emoji (optional)
     * @returns Das Emoji mit verstecktem Text
     */
    public encrypt(text: string, password: string, emoji: string = this.defaultEmoji): string {
        // Text verschlüsseln
        const encrypted = this._encryptData(text, password);

        // In Base64 umwandeln
        const base64 = this._bytesToBase64(encrypted);

        // Länge kodieren (für die Entschlüsselung)
        const lengthBinary = base64.length.toString(2).padStart(16, '0');

        // Base64 in Binär umwandeln
        const base64Binary = this._base64ToBinary(base64);

        // Binärstring in unsichtbare Unicode-Zeichen umwandeln
        const invisibleSequence = this._binaryToInvisibleChars(lengthBinary + base64Binary);

        // Emoji mit der unsichtbaren Sequenz verbinden
        // Die unsichtbare Sequenz wird nach dem Emoji platziert
        return emoji + invisibleSequence;
    }

    /**
     * Entschlüsselt Text aus einem Emoji
     * @param emojiMessage - Das Emoji mit verstecktem Text
     * @param password - Das Passwort
     * @returns Der entschlüsselte Text
     */
    public decrypt(emojiMessage: string, password: string): string {
        try {
            // Erstes Zeichen ist das Emoji, der Rest enthält die versteckten Daten
            if (emojiMessage.length <= 1) {
                return "Ungültige Nachricht. Keine versteckten Daten gefunden.";
            }

            const emoji = emojiMessage.charAt(0);
            const invisibleSequence = emojiMessage.substring(1);

            // Unsichtbare Sequenz in Binärstring umwandeln
            const binary = this._invisibleCharsToBinary(invisibleSequence);

            if (binary.length < 16) {
                return "Keine gültigen versteckten Daten gefunden.";
            }

            // Länge extrahieren
            const lengthBinary = binary.substring(0, 16);
            const length = parseInt(lengthBinary, 2);

            // Base64-Daten extrahieren und in Bytes umwandeln
            const base64Binary = binary.substring(16);
            const base64 = this._binaryToBase64(base64Binary);

            // Korrekte Länge berücksichtigen (falls wir Padding hinzugefügt haben)
            const correctBase64 = base64.substring(0, length);

            const bytes = this._base64ToBytes(correctBase64);

            // Bytes entschlüsseln
            return this._decryptData(bytes, password);
        } catch (error) {
            console.error("Decryption error:", error);
            return "Entschlüsselung fehlgeschlagen. Falsches Passwort oder ungültige Nachricht.";
        }
    }

    /**
     * Gibt eine zufällige Emoji aus der verfügbaren Liste zurück
     * @returns Ein zufälliges Emoji
     */
    public getRandomEmoji(): string {
        const randomIndex = Math.floor(Math.random() * this.availableEmojis.length);
        return this.availableEmojis[randomIndex];
    }

    /**
     * Prüft, ob ein Emoji versteckte Daten enthält
     * @param emojiMessage - Das zu prüfende Emoji
     * @returns true, wenn das Emoji versteckte Daten enthält, sonst false
     */
    public hasHiddenData(emojiMessage: string): boolean {
        if (emojiMessage.length <= 1) {
            return false;
        }

        const invisibleSequence = emojiMessage.substring(1);
        const binary = this._invisibleCharsToBinary(invisibleSequence);

        // Wenn wir mindestens 16 Bits (für die Längenangabe) haben,
        // könnten versteckte Daten vorhanden sein
        return binary.length >= 16;
    }
}

/**
 * Eine einfache Hilfsfunktion zum schnellen Verschlüsseln von Text in einem Emoji
 * @param text - Der zu verschlüsselnde Text
 * @param password - Das Passwort
 * @param emoji - Das zu verwendende Emoji (optional)
 * @returns Das Emoji mit verstecktem Text
 */
export function encryptInEmoji(text: string, password: string, emoji?: string): string {
    const emojiSteg = new EmojiSteg();
    return emojiSteg.encrypt(text, password, emoji);
}

/**
 * Eine einfache Hilfsfunktion zum schnellen Entschlüsseln von Text aus einem Emoji
 * @param emojiMessage - Das Emoji mit verstecktem Text
 * @param password - Das Passwort
 * @returns Der entschlüsselte Text
 */
export function decryptFromEmoji(emojiMessage: string, password: string): string {
    const emojiSteg = new EmojiSteg();
    return emojiSteg.decrypt(emojiMessage, password);
}