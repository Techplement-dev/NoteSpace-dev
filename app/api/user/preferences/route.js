import dbConnect from '@/lib/db';
import UserPreferences from '@/models/UserPreferences';
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

        let preferences = await UserPreferences.findOne({ userId });

        // If no preferences exist, create default ones
        if (!preferences) {
            preferences = await UserPreferences.create({ userId });
        }

        return NextResponse.json({ success: true, data: preferences });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
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

        const preferences = await UserPreferences.findOneAndUpdate(
            { userId },
            body,
            { new: true, upsert: true, runValidators: true }
        );

        return NextResponse.json({ success: true, data: preferences });
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
