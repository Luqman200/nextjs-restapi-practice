import connect from '@/app/lib/db';
import Category from '@/app/lib/modals/category';
import User from '@/app/lib/modals/user';
import { request } from 'http';
import { NextResponse } from 'next/server';
import { Types } from "mongoose";
import { url } from 'inspector';

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing user id" }), { 'status': 400 })
        }

        await connect()

        const user = await User.findById(userId)

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found in the database" }), { 'status': 404 })
        }

        const categories = await Category.find({ userId: new Types.ObjectId(userId) })

        return new NextResponse(JSON.stringify(categories), { 'status': 200 })

    }
    catch (err: any) {
        return new NextResponse("Error getting the category" + err.message, { status: 500 })
    }
}

export const POST = async (request: Request) => {
    try {

    }
    catch (err: any) {
        return new NextResponse("Error creating the category" + err.message, { status: 500 })
    }
}