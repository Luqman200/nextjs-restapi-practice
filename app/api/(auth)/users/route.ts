import connect from '@/app/lib/db';
import User from '@/app/lib/modals/user';
import { request } from 'http';
import { NextResponse } from 'next/server';
import { Types } from "mongoose";
import { url } from 'inspector';

const objectID = require("mongoose").Types.ObjectId;

export const GET = async () => {
    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (err: any) {
        return new NextResponse('Error in fetching user: ' + err.message, {
            status: 500,
        });
    }
};

export const POST = async (request: Request) => {
    try {
        const body = await request.json()
        await connect()
        const newUser = new User(body)
        await newUser.save()

        return new NextResponse(JSON.stringify({ message: "New User Created", user: newUser }), { 'status': 200 })
    }
    catch (err: any) {
        return new NextResponse('Error in creating user: ' + err.message, { 'status': 500 })
    }
}

export const PATCH = async (request: Request) => {
    try {
        const body = await request.json()
        const { userId, newUsername } = body
        await connect()
        if (!userId || !newUsername) {
            return new NextResponse('Please provide both Id and Username', { 'status': 400 })
        }
        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse('Invalid User Id', { 'status': 400 })
        }
        const updatedUser = await User.findOneAndUpdate(
            { _id: new objectID(userId) },
            { username: newUsername },
            { new: true }
        )
        if (!updatedUser) {
            return new NextResponse('User not found', { 'status': 400 })
        }
        return new NextResponse(JSON.stringify({ message: "User Updated", user: updatedUser }), { 'status': 200 })
    }

    catch (err: any) {
        return new NextResponse('Error in updating user: ' + err.message, { 'status': 500 })
    }
}

export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        if (!userId) {
            return new NextResponse('User Id not found', { 'status': 400 })
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse('Invalid User Id', { 'status': 400 })
        }

        await connect()

        const deletedUser = await User.findByIdAndDelete(
            new Types.ObjectId(userId)
        )

        if (!deletedUser) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { 'status': 400 })
        }

        return new NextResponse(JSON.stringify({ message: "User deleted successfully!", user: deletedUser }), { 'status': 200 })

    }
    catch (err: any) {
        return new NextResponse('Error in updating user: ' + err.message, { 'status': 500 })
    }
}


// mongodb+srv://luqman12080:dHIcv6juDWC2o5U6@cluster0.rntugog.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
