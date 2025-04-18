# emoji-steg

A lightweight TypeScript library for Unicode steganography in emojis. With this library, text can be hidden in a single emoji, making the encrypted text invisible and only decryptable with the correct password.


## Quick Start

```typescript
import { EmojiSteg, encryptInEmoji, decryptFromEmoji } from 'emoji-steg';

// Simple usage with helper functions
const encryptedMessage = encryptInEmoji("Secret text", "myPassword", "🚀");
console.log(encryptedMessage); // Output: 🚀 (with hidden data)

const decryptedMessage = decryptFromEmoji(encryptedMessage, "myPassword");
console.log(decryptedMessage); // Output: "Secret text"
```

## API Reference

### Class: `EmojiSteg`

The main class for emoji steganography.

#### Constructor

```typescript
constructor(options?: EmojiStegOptions)
```

Creates a new instance of the `EmojiSteg` class.

**Parameters:**
- `options` (optional): Configuration options
  - `defaultEmoji`: The default emoji (default: "🔒")
  - `customEmojiCategories`: A custom map of emoji categories

#### Properties

- `emojiCategories`: A map of categorized emojis with over 1000 available emojis supported by iOS and Android

#### Methods

##### `encrypt(text: string, password: string, emoji?: string): string`

Encrypts text with a password and hides it in an emoji.

**Parameters:**
- `text`: The text to encrypt
- `password`: The password for encryption
- `emoji` (optional): The emoji in which the text should be hidden (default: the default emoji)

**Return value:**
- The emoji with hidden text

##### `decrypt(emojiMessage: string, password: string): string`

Decrypts an emoji message with a password.

**Parameters:**
- `emojiMessage`: The emoji with hidden text
- `password`: The password for decryption

**Return value:**
- The decrypted text

##### `getCategories(): string[]`

Returns all available emoji categories.

**Return value:**
- Array of category names

##### `getEmojisByCategory(category: string): string[]`

Returns all emojis from a specific category.

**Parameters:**
- `category`: The name of the category

**Return value:**
- Array of emojis from the specified category, or empty array if category doesn't exist

##### `getRandomEmoji(): string`

Returns a random emoji from all available categories.

**Return value:**
- A random emoji

##### `getRandomEmojiFromCategory(category: string): string`

Returns a random emoji from a specific category.

**Parameters:**
- `category`: The name of the category

**Return value:**
- A random emoji from the specified category

##### `hasHiddenData(emojiMessage: string): boolean`

Checks if an emoji contains hidden data.

**Parameters:**
- `emojiMessage`: The emoji to check

**Return value:**
- `true` if the emoji contains hidden data, otherwise `false`

### Helper Functions

#### `encryptInEmoji(text: string, password: string, emoji?: string): string`

A helper function for quickly encrypting text in an emoji.

**Parameters:**
- `text`: The text to encrypt
- `password`: The password for encryption
- `emoji` (optional): The emoji in which the text should be hidden

**Return value:**
- The emoji with hidden text

#### `decryptFromEmoji(emojiMessage: string, password: string): string`

A helper function for quickly decrypting text from an emoji.

**Parameters:**
- `emojiMessage`: The emoji with hidden text
- `password`: The password for decryption

**Return value:**
- The decrypted text

## Examples

### Working with Emoji Categories

```typescript
import { EmojiSteg } from 'emoji-steg';

const emojiSteg = new EmojiSteg();

// Get all available emoji categories
const categories = emojiSteg.getCategories();
console.log(categories); 
// Output: ["Smileys & Emotions", "Gestures & People", "Animals", "Food & Drink", ...]

// Get emojis from a specific category
const foodEmojis = emojiSteg.getEmojisByCategory("Food & Drink");
console.log(foodEmojis);
// Output: ["🍇", "🍈", "🍉", "🍊", "🍋", "🍌", ...]

// Get a random emoji from a specific category
const randomAnimal = emojiSteg.getRandomEmojiFromCategory("Animals");
console.log(randomAnimal);
// Output: (e.g.) "🦄"

// Using a custom emoji category
const customEmojiSteg = new EmojiSteg({
  defaultEmoji: "🔐",
  customEmojiCategories: {
    "Favorites": ["🚀", "🔥", "⭐", "🎮", "🎯"]
  }
});

console.log(customEmojiSteg.getCategories());
// Output: ["Favorites"]
```

## How It Works

This library uses Unicode steganography to hide text in emojis:

1. **Encryption**: The text is encrypted with a password-based key
2. **Base64 Encoding**: The encrypted data is converted to Base64
3. **Binary Encoding**: The Base64 data is converted to binary data
4. **Unicode Steganography**: The binary data is encoded in invisible Unicode characters (such as Zero-Width Joiner and Zero-Width Non-Joiner)
5. **Emoji Integration**: The invisible characters are combined with the emoji

The result is a single emoji that looks normal to the naked eye but contains hidden data that can only be decrypted with the correct password.

## Security Notes

- This library is suitable for light security requirements, not for highly sensitive data
- Security depends significantly on the complexity of the password used
- Some platforms or applications may remove or modify the invisible Unicode characters

## License

MIT