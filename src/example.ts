/**
 * Beispiel-Datei zur Demonstration der verbesserten EmojiSteg-Bibliothek
 */
import { EmojiSteg, encryptInEmoji, decryptFromEmoji } from './emoji-steg.js';

console.log('=== EmojiSteg-Bibliothek Beispiele ===');

// Initialisierung der EmojiSteg-Klasse
const emojiSteg = new EmojiSteg();
console.log('\n1. EmojiSteg-Instanz wurde erstellt.');

// Verfügbare Kategorien abfragen
const categories = emojiSteg.getCategories();
console.log('\n2. Verfügbare Emoji-Kategorien:');
console.log(categories);

// Anzahl der Emojis pro Kategorie anzeigen
console.log('\n3. Anzahl der Emojis pro Kategorie:');
categories.forEach(category => {
    const emojis = emojiSteg.getEmojisByCategory(category);
    console.log(`   ${category}: ${emojis.length} Emojis`);
});

// Einige Emojis aus verschiedenen Kategorien anzeigen
console.log('\n4. Beispiel-Emojis aus jeder Kategorie:');
categories.forEach(category => {
    const emojis = emojiSteg.getEmojisByCategory(category);
    const sample = emojis.slice(0, 5).join(' ');  // Zeige die ersten 5 Emojis jeder Kategorie
    console.log(`   ${category}: ${sample} ...`);
});

// Zufällige Emojis generieren
console.log('\n5. Zufällige Emojis:');
console.log(`   Zufälliges Emoji aus allen Kategorien: ${emojiSteg.getRandomEmoji()}`);

// Zufällige Emojis aus bestimmten Kategorien
console.log('\n6. Zufällige Emojis aus bestimmten Kategorien:');
categories.forEach(category => {
    console.log(`   ${category}: ${emojiSteg.getRandomEmojiFromCategory(category)}`);
});

// Text verschlüsseln mit verschiedenen Emojis
const textToEncrypt = 'Dies ist ein geheimer Text für die Steganographie-Demo.';
const password = 'mein-sicheres-passwort';

console.log('\n7. Verschlüsselung mit verschiedenen Emojis:');

// Einige Emoji-Beispiele für die Verschlüsselung
const emojiExamples = [
    '🔒', // Standard
    '😎', // Smileys & Emotionen
    '👍', // Gesten & Menschen
    '🐱', // Tiere
    '🍕', // Essen & Trinken
    '⚽', // Sport & Aktivitäten
    '✈️', // Reisen & Orte
    '💡'  // Objekte & Symbole
];

const encryptedMessages: string[] = [];

emojiExamples.forEach(emoji => {
    const encrypted = emojiSteg.encrypt(textToEncrypt, password, emoji);
    encryptedMessages.push(encrypted);
    console.log(`   Mit ${emoji}: ${encrypted}`);
});

// Entschlüsselung der verschlüsselten Nachrichten
console.log('\n8. Entschlüsselung der verschlüsselten Nachrichten:');
encryptedMessages.forEach((encryptedMessage, index) => {
    const decrypted = emojiSteg.decrypt(encryptedMessage, password);
    console.log(`   Nachricht ${index + 1} mit ${emojiExamples[index]}: "${decrypted}"`);
});

// Überprüfen, ob ein Emoji versteckte Daten enthält
console.log('\n9. Überprüfen auf versteckte Daten:');
const plainEmoji = '🔒';
const emojiWithHiddenData = emojiSteg.encrypt('Versteckter Text', password);

console.log(`   Enthält '${plainEmoji}' versteckte Daten? ${emojiSteg.hasHiddenData(plainEmoji)}`);
console.log(`   Enthält '${emojiWithHiddenData.charAt(0)}...' versteckte Daten? ${emojiSteg.hasHiddenData(emojiWithHiddenData)}`);

// Verwendung der Hilfsfunktionen für schnelle Verschlüsselung/Entschlüsselung
console.log('\n10. Verwendung der Hilfsfunktionen:');
const quickEncrypted = encryptInEmoji('Schnell verschlüsselter Text', 'einfaches-passwort', '🚀');
console.log(`   Schnell verschlüsselt: ${quickEncrypted}`);

const quickDecrypted = decryptFromEmoji(quickEncrypted, 'einfaches-passwort');
console.log(`   Schnell entschlüsselt: "${quickDecrypted}"`);

// Fehlerbehandlung demonstrieren
console.log('\n11. Fehlerbehandlung:');

// Falsches Passwort
const wrongPassword = 'falsches-passwort';
const decryptWithWrongPassword = emojiSteg.decrypt(encryptedMessages[0], wrongPassword);
console.log(`   Entschlüsselung mit falschem Passwort: "${decryptWithWrongPassword}"`);

// Ungültige Nachricht
const invalidMessage = '🔒';
const decryptInvalidMessage = emojiSteg.decrypt(invalidMessage, password);
console.log(`   Entschlüsselung einer ungültigen Nachricht: "${decryptInvalidMessage}"`);

// Eigene Emoji-Kategorie erstellen
console.log('\n12. Mit benutzerdefinierten Emoji-Kategorien:');
const customEmojiSteg = new EmojiSteg({
    defaultEmoji: '🔐',
    customEmojiCategories: {
        'Lieblingsemojis': ['😻', '🚀', '🍕', '🎮', '🌈']
    }
});

const customCategories = customEmojiSteg.getCategories();
console.log(`   Benutzerdefinierte Kategorien: ${customCategories}`);
console.log(`   Emojis in 'Lieblingsemojis': ${customEmojiSteg.getEmojisByCategory('Lieblingsemojis').join(' ')}`);

const customEncrypted = customEmojiSteg.encrypt('Text mit benutzerdefiniertem Emoji', password);
console.log(`   Verschlüsselt mit benutzerdefiniertem Default-Emoji: ${customEncrypted}`);
console.log(`   Entschlüsselt: "${customEmojiSteg.decrypt(customEncrypted, password)}"`);

console.log('\n=== Ende der Beispiele ===');