import connect from '@/app/lib/db';
import Blog from '@/app/lib/modals/blog'
import Category from '@/app/lib/modals/category';
import User from '@/app/lib/modals/user';
import { request } from 'http';
import { NextResponse } from 'next/server';
import { Types } from "mongoose";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        const categoryId = searchParams.get("categoryId")
        const searchKeyword = searchParams.get("keyword") as string;
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const page: any = parseInt(searchParams.get("page") || "1")
        const limit: any = parseInt(searchParams.get("limit") || "10")


        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing User Id" }), {
                status: 400
            })
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing Category Id" }), {
                status: 400
            })
        }

        await connect()

        const user = await User.findById(userId)

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User Not found" }), {
                status: 404
            })
        }

        const category = await Category.findById(categoryId)

        if (!category) {
            return new NextResponse(JSON.stringify({ message: "Category Not found" }), {
                status: 404
            })
        }

        const filter: any = {
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId)
        }

        if (searchKeyword) {
            filter.$or = [
                { title: { $regex: searchKeyword, $options: 'i' } },
                { description: { $regex: searchKeyword, $options: 'i' } }
            ]
        }

        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }
        else if (startDate) {
            filter.createdAt = {
                $gte: new Date(startDate)
            }

        }
        else if (endDate) {
            filter.createdAt = {
                $lte: new Date(endDate)
            }
        }

        const skip = (page - 1) * limit;

        const blogs = await Blog.find(filter).sort({ createdAt: "asc" }).skip(skip).limit(limit)

        return new NextResponse(JSON.stringify({ blogs }), {
            status: 200
        })
    }

    catch (err: any) {
        return new NextResponse("Error in fetching blogs" + err.message, {
            status: 500
        })
    }
}

export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        const categoryId = searchParams.get("categoryId")

        const body = await request.json()
        const { title, description } = body

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing User Id" }), {
                status: 400
            })
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid or missing Category Id" }), {
                status: 400
            })
        }

        await connect()

        const user = await User.findById(userId)

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User Not found" }), {
                status: 404
            })
        }

        const category = await Category.findById(categoryId)

        if (!category) {
            return new NextResponse(JSON.stringify({ message: "Category Not found" }), {
                status: 404
            })
        }

        const newBlog = new Blog({
            title,
            description,
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId)
        })

        await newBlog.save()

        return new NextResponse(JSON.stringify({ message: "New blog is created", blog: newBlog }), {
            status: 200
        })
    }
    catch (err: any) {
        return new NextResponse("Error in cresting blog" + err.message, {
            status: 500
        })
    }
}