import dbConnect from '@/lib/db';
import Note from '@/models/Note';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req) {
    try {
        await dbConnect();
        const cookieStore = await cookies();
        const userId = cookieStore.get('notespace_user_id')?.value;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 401 }
            );
        }

        const notes = await Note.find({ userId }).sort({ isPinned: -1, updatedAt: -1 });
        return NextResponse.json({ success: true, data: notes });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const cookieStore = await cookies();
        const userId = cookieStore.get('notespace_user_id')?.value;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 401 }
            );
        }

        const note = await Note.create({ ...body, userId });
        return NextResponse.json({ success: true, data: note }, { status: 201 });
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
