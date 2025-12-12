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
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            index: true,
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

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
