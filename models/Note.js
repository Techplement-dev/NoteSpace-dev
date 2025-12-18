import mongoose from 'mongoose';

// Generate random customUrl (20 chars with uppercase, lowercase, number, special char)
function generateCustomUrl() {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    // Only URL-safe special characters that don't need encoding
    const special = '!@$^*_-';
    const allChars = uppercase + lowercase + numbers + special;

    // Ensure at least one of each required type
    let url = '';
    url += uppercase[Math.floor(Math.random() * uppercase.length)];
    url += lowercase[Math.floor(Math.random() * lowercase.length)];
    url += numbers[Math.floor(Math.random() * numbers.length)];
    url += special[Math.floor(Math.random() * special.length)];

    // Fill remaining 16 characters randomly
    for (let i = 0; i < 16; i++) {
        url += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the string to randomize position of required chars
    return url.split('').sort(() => Math.random() - 0.5).join('');
}

// Validation function for customUrl
function validateCustomUrl(value) {
    if (!value) return false;

    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    // Modified regex to only allow safe special chars: ! @ $ ^ * _ -
    const hasSpecial = /[!@$^*_\-]/.test(value);
    // Strict alphanumeric + safe special chars check
    const isAlphanumericSpecial = /^[a-zA-Z0-9!@$^*_\-]+$/.test(value);

    return hasUppercase && hasLowercase && hasNumber && hasSpecial && isAlphanumericSpecial;
}

const NoteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters'],
        },
        content: {
            type: String,
            trim: true,
            maxlength: [20000, 'Content cannot be more than 20000 characters'],
        },
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            index: true,
        },
        customUrl: {
            type: String,
            required: [true, 'Custom URL is required'],
            unique: true,
            minlength: [4, 'Custom URL must be at least 4 characters'],
            maxlength: [20, 'Custom URL cannot be more than 20 characters'],
            validate: {
                validator: validateCustomUrl,
                message: 'Custom URL must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            },
            default: generateCustomUrl,
        },
        logoText: {
            type: String,
            default: 'NoteSpace',
            trim: true,
            maxlength: [50, 'Logo text cannot be more than 50 characters'],
        },
        passwordHash: {
            type: String,
            minlength: [1, 'Password hash is required when set'],
            maxlength: [200, 'Password hash is too long'],
            select: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
// Improve search performance
NoteSchema.index({ title: 'text', content: 'text' });
// Unique index for customUrl routing - handled by schema definition
// NoteSchema.index({ customUrl: 1 }, { unique: true });
// Automatic deletion of empty notes after 5 minutes
NoteSchema.index(
    { updatedAt: 1 },
    {
        expireAfterSeconds: 300, // 5 minutes
        partialFilterExpression: {
            title: "",
            content: "",
            logoText: "NoteSpace"
        }
    }
);

// Export helper function for use in API routes
export { generateCustomUrl, validateCustomUrl };

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
