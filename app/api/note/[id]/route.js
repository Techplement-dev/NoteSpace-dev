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

        // Find note by customUrl
        const note = await Note.findOne({ customUrl: id, userId });

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
        const { ...updateData } = body;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 401 }
            );
        }

        // If updating customUrl, check for duplicates
        if (updateData.customUrl) {
            // First, find the current note to get its _id
            const currentNote = await Note.findOne({ customUrl: id, userId });

            if (!currentNote) {
                return NextResponse.json(
                    { success: false, error: 'Note not found' },
                    { status: 404 }
                );
            }

            // Check if the new customUrl is already taken by ANY note (excluding current note by _id)
            const duplicateNote = await Note.findOne({
                customUrl: updateData.customUrl,
                _id: { $ne: currentNote._id } // Exclude current note by _id
            });

            if (duplicateNote) {
                return NextResponse.json(
                    { success: false, error: 'Already Taken' },
                    { status: 409 }
                );
            }
        }

        const note = await Note.findOneAndUpdate(
            { customUrl: id, userId },
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
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: 'Already Taken' },
                { status: 409 }
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

        const deletedNote = await Note.findOneAndDelete({ customUrl: id, userId });

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
