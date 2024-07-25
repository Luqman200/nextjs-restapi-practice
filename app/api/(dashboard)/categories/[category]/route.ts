import connect from '@/app/lib/db';
import Category from '@/app/lib/modals/category';
import User from '@/app/lib/modals/user';
import { request } from 'http';
import { NextResponse } from 'next/server';
import { Types } from "mongoose";
import { url } from 'inspector';

export const PATCH = async (request: Request, context: { params: any }) => {
    const categoryId = context.params.category
    try {
        const body = await request.json()
        const { title } = body
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing user id" }), { 'status': 400 })
        }
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing category id" }), { 'status': 400 })
        }

        await connect()
        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { 'status': 404 })
        }
        const category = await Category.findOne({ _id: categoryId, user: userId })
        if (!category) {
            return new NextResponse(JSON.stringify({ message: "Category not found" }), { 'status': 404 })
        }
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { title }, { new: true })
        return new NextResponse(JSON.stringify(updatedCategory), { 'status': 200 })
    }
    catch (err: any) {
        return new NextResponse('Error in updating category: ' + err.message, {
            status: 500,
        });
    }
}

export const Delete = async (request: Request, context: { params: any }) => {
    const categoryId = context.params.category
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing user id" }), { 'status': 400 })
        }
        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing category id" }), { 'status': 400 })
        }

        await connect()
        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), { 'status': 404 })
        }
        const category = await Category.findOne({ _id: categoryId, user: userId })
        if (!category) {
            return new NextResponse(JSON.stringify({ message: "Category not found or does not belong to this user" }), { 'status': 404 })
        }
        await Category.findByIdAndDelete(categoryId)
        return new NextResponse(JSON.stringify({ message: "Category deleted" }), { 'status': 200 })
    }
    catch (err: any) {
        return new NextResponse('Error in deleting category: ' + err.message, {
            status: 500,
        });
    }
}

