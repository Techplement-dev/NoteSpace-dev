import mongoose from 'mongoose';

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
        tags: {
            type: [String],
            index: true,
            validate: [
                {
                    validator: function (v) {
                        return v.length <= 10;
                    },
                    message: 'A note cannot have more than 10 tags',
                },
                {
                    validator: function (v) {
                        return v.every((tag) => tag.length <= 50);
                    },
                    message: 'Tags cannot be more than 50 characters',
                },
            ],
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            index: true,
        },
        color: {
            type: String,
            default: 'default',
        },
        logoText: {
            type: String,
            default: 'NoteSpace',
            trim: true,
            maxlength: [50, 'Logo text cannot be more than 50 characters'],
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
// Improve search performance
NoteSchema.index({ title: 'text', content: 'text' });
// Improve sorting/filtering by user
NoteSchema.index({ userId: 1, isPinned: -1, updatedAt: -1 });

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
