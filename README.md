# emoji-steg

Eine leichtgewichtige TypeScript-Bibliothek für Unicode-Steganographie in Emojis. Mit dieser Bibliothek kann Text in einem einzelnen Emoji versteckt werden, sodass der verschlüsselte Text unsichtbar ist und nur mit dem richtigen Passwort entschlüsselt werden kann.


## Schnellstart

```typescript
import { EmojiSteg, encryptInEmoji, decryptFromEmoji } from 'emoji-steg';

// Einfache Verwendung mit Hilfsfunktionen
const encryptedMessage = encryptInEmoji("Geheimer Text", "meinPasswort", "🚀");
console.log(encryptedMessage); // Ausgabe: 🚀 (mit versteckten Daten)

const decryptedMessage = decryptFromEmoji(encryptedMessage, "meinPasswort");
console.log(decryptedMessage); // Ausgabe: "Geheimer Text"
```

## API-Referenz

### Klasse: `EmojiSteg`

Die Hauptklasse für Emoji-Steganographie.

#### Konstruktor

```typescript
constructor(options?: EmojiStegOptions)
```

Erstellt eine neue Instanz der `EmojiSteg`-Klasse.

**Parameter:**
- `options` (optional): Konfigurationsoptionen
    - `defaultEmoji`: Das Standard-Emoji (Standard: "🔒")
    - `customEmojis`: Eine benutzerdefinierte Liste von Emojis

#### Eigenschaften

- `availableEmojis`: Ein Array mit über 1000 verfügbaren Emojis, die von iOS und Android unterstützt werden

#### Methoden

##### `encrypt(text: string, password: string, emoji?: string): string`

Verschlüsselt einen Text mit einem Passwort und versteckt ihn in einem Emoji.

**Parameter:**
- `text`: Der zu verschlüsselnde Text
- `password`: Das Passwort für die Verschlüsselung
- `emoji` (optional): Das Emoji, in dem der Text versteckt werden soll (Standard: das Standard-Emoji)

**Rückgabewert:**
- Das Emoji mit verstecktem Text

##### `decrypt(emojiMessage: string, password: string): string`

Entschlüsselt eine Emoji-Nachricht mit einem Passwort.

**Parameter:**
- `emojiMessage`: Das Emoji mit verstecktem Text
- `password`: Das Passwort für die Entschlüsselung

**Rückgabewert:**
- Der entschlüsselte Text

##### `getRandomEmoji(): string`

Gibt ein zufälliges Emoji aus der verfügbaren Liste zurück.

**Rückgabewert:**
- Ein zufälliges Emoji

##### `hasHiddenData(emojiMessage: string): boolean`

Prüft, ob ein Emoji versteckte Daten enthält.

**Parameter:**
- `emojiMessage`: Das zu prüfende Emoji

**Rückgabewert:**
- `true`, wenn das Emoji versteckte Daten enthält, sonst `false`

### Hilfsfunktionen

#### `encryptInEmoji(text: string, password: string, emoji?: string): string`

Eine Hilfsfunktion zum schnellen Verschlüsseln von Text in einem Emoji.

**Parameter:**
- `text`: Der zu verschlüsselnde Text
- `password`: Das Passwort für die Verschlüsselung
- `emoji` (optional): Das Emoji, in dem der Text versteckt werden soll

**Rückgabewert:**
- Das Emoji mit verstecktem Text

#### `decryptFromEmoji(emojiMessage: string, password: string): string`

Eine Hilfsfunktion zum schnellen Entschlüsseln von Text aus einem Emoji.

**Parameter:**
- `emojiMessage`: Das Emoji mit verstecktem Text
- `password`: Das Passwort für die Entschlüsselung

**Rückgabewert:**
- Der entschlüsselte Text

## Wie es funktioniert

Diese Bibliothek verwendet Unicode-Steganographie, um Text in Emojis zu verstecken:

1. **Verschlüsselung**: Der Text wird mit einem passwortbasierten Schlüssel verschlüsselt
2. **Base64-Kodierung**: Die verschlüsselten Daten werden in Base64 umgewandelt
3. **Binärkodierung**: Die Base64-Daten werden in Binärdaten umgewandelt
4. **Unicode-Steganographie**: Die Binärdaten werden in unsichtbare Unicode-Zeichen (wie Zero-Width Joiner und Zero-Width Non-Joiner) kodiert
5. **Emoji-Integration**: Die unsichtbaren Zeichen werden mit dem Emoji verbunden

Das Ergebnis ist ein einzelnes Emoji, das für das bloße Auge normal aussieht, aber versteckte Daten enthält, die nur mit dem richtigen Passwort entschlüsselt werden können.

## Sicherheitshinweise

- Diese Bibliothek ist für leichte Sicherheitsanforderungen geeignet, nicht für hochsensible Daten
- Die Sicherheit hängt maßgeblich von der Komplexität des verwendeten Passworts ab
- Einige Plattformen oder Anwendungen könnten die unsichtbaren Unicode-Zeichen entfernen oder verändern

## Lizenz

MIT