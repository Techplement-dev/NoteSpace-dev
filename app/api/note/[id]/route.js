import dbConnect from '@/lib/db';
import Note from '@/models/Note';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';

export async function GET(req, { params }) {
    console.log('GET /api/note/[id] route accessed');
    try {
        await dbConnect();
        const { id } = await params;
        const cookieStore = await cookies();
        const userId = cookieStore.get('notespace_user_id')?.value;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 401 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid Note ID' },
                { status: 400 }
            );
        }

        const note = await Note.findOne({ _id: id, userId });

        if (!note) {
            return NextResponse.json(
                { success: false, error: 'Note not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: note });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();
        const cookieStore = await cookies();
        const userId = cookieStore.get('notespace_user_id')?.value;
        const { ...updateData } = body; // removed userId from body destructuring since we get it from cookie

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 401 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid Note ID' },
                { status: 400 }
            );
        }

        const note = await Note.findOneAndUpdate(
            { _id: id, userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!note) {
            return NextResponse.json(
                { success: false, error: 'Note not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: note });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return NextResponse.json(
                { success: false, error: messages.join(', ') },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const cookieStore = await cookies();
        const userId = cookieStore.get('notespace_user_id')?.value;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 401 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid Note ID' },
                { status: 400 }
            );
        }

        const deletedNote = await Note.findOneAndDelete({ _id: id, userId });

        if (!deletedNote) {
            return NextResponse.json(
                { success: false, error: 'Note not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
