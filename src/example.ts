/**
 * Example file to demonstrate the functionality
 */
import { EmojiSteg, encryptInEmoji, decryptFromEmoji } from './emoji-steg.js';

console.log('=== EmojiSteg Library Examples ===');

// Initialize the EmojiSteg class
const emojiSteg = new EmojiSteg();
console.log('\n1. EmojiSteg instance has been created.');

// Query available categories
const categories = emojiSteg.getCategories();
console.log('\n2. Available emoji categories:');
console.log(categories);

// Display number of emojis per category
console.log('\n3. Number of emojis per category:');
categories.forEach(category => {
    const emojis = emojiSteg.getEmojisByCategory(category);
    console.log(`   ${category}: ${emojis.length} emojis`);
});

// Display some emojis from different categories
console.log('\n4. Example emojis from each category:');
categories.forEach(category => {
    const emojis = emojiSteg.getEmojisByCategory(category);
    const sample = emojis.slice(0, 5).join(' ');  // Show the first 5 emojis of each category
    console.log(`   ${category}: ${sample} ...`);
});

// Generate random emojis
console.log('\n5. Random emojis:');
console.log(`   Random emoji from all categories: ${emojiSteg.getRandomEmoji()}`);

// Random emojis from specific categories
console.log('\n6. Random emojis from specific categories:');
categories.forEach(category => {
    console.log(`   ${category}: ${emojiSteg.getRandomEmojiFromCategory(category)}`);
});

// Encrypt text with different emojis
const textToEncrypt = 'This is a secret text for the steganography demo.';
const password = 'my-secure-password';

console.log('\n7. Encryption with different emojis:');

// Some emoji examples for encryption
const emojiExamples = [
    '🔒', // Default
    '😎', // Smileys & Emotions
    '👍', // Gestures & People
    '🐱', // Animals
    '🍕', // Food & Drink
    '⚽', // Sports & Activities
    '✈️', // Travel & Places
    '💡'  // Objects & Symbols
];

const encryptedMessages: string[] = [];

emojiExamples.forEach(emoji => {
    const encrypted = emojiSteg.encrypt(textToEncrypt, password, emoji);
    encryptedMessages.push(encrypted);
    console.log(`   With ${emoji}: ${encrypted}`);
});

// Decryption of encrypted messages
console.log('\n8. Decryption of encrypted messages:');
encryptedMessages.forEach((encryptedMessage, index) => {
    const decrypted = emojiSteg.decrypt(encryptedMessage, password);
    console.log(`   Message ${index + 1} with ${emojiExamples[index]}: "${decrypted}"`);
});

// Check if an emoji contains hidden data
console.log('\n9. Check for hidden data:');
const plainEmoji = '🔒';
const emojiWithHiddenData = emojiSteg.encrypt('Hidden text', password);

console.log(`   Does '${plainEmoji}' contain hidden data? ${emojiSteg.hasHiddenData(plainEmoji)}`);
console.log(`   Does '${emojiWithHiddenData.charAt(0)}...' contain hidden data? ${emojiSteg.hasHiddenData(emojiWithHiddenData)}`);

// Using helper functions for quick encryption/decryption
console.log('\n10. Using helper functions:');
const quickEncrypted = encryptInEmoji('Quickly encrypted text', 'simple-password', '🚀');
console.log(`   Quickly encrypted: ${quickEncrypted}`);

const quickDecrypted = decryptFromEmoji(quickEncrypted, 'simple-password');
console.log(`   Quickly decrypted: "${quickDecrypted}"`);

// Demonstrate error handling
console.log('\n11. Error handling:');

// Wrong password
const wrongPassword = 'wrong-password';
const decryptWithWrongPassword = emojiSteg.decrypt(encryptedMessages[0], wrongPassword);
console.log(`   Decryption with wrong password: "${decryptWithWrongPassword}"`);

// Invalid message
const invalidMessage = '🔒';
const decryptInvalidMessage = emojiSteg.decrypt(invalidMessage, password);
console.log(`   Decryption of an invalid message: "${decryptInvalidMessage}"`);

// Create custom emoji category
console.log('\n12. With custom emoji categories:');
const customEmojiSteg = new EmojiSteg({
    defaultEmoji: '🔐',
    customEmojiCategories: {
        'Favorite emojis': ['😻', '🚀', '🍕', '🎮', '🌈']
    }
});

const customCategories = customEmojiSteg.getCategories();
console.log(`   Custom categories: ${customCategories}`);
console.log(`   Emojis in 'Favorite emojis': ${customEmojiSteg.getEmojisByCategory('Favorite emojis').join(' ')}`);

const customEncrypted = customEmojiSteg.encrypt('Text with custom emoji', password);
console.log(`   Encrypted with custom default emoji: ${customEncrypted}`);
console.log(`   Decrypted: "${customEmojiSteg.decrypt(customEncrypted, password)}"`);

console.log('\n=== End of examples ===');