import connect from '@/app/lib/db';
import Blog from '@/app/lib/modals/blog'
import Category from '@/app/lib/modals/category';
import User from '@/app/lib/modals/user';
import { request } from 'http';
import { NextResponse } from 'next/server';
import { Types } from "mongoose";

export const GET = async (request: Request, context: { params: any }) => {
    const blogId = context.params.blog
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")
        const categoryId = searchParams.get("categoryId")

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid user id" }), { status: 400 })
        }

        if (!categoryId || Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid category id" }), { status: 400 })
        }

        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid blog id" }), { status: 400 })

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

        const blog = Blog.findOne({
            _id: blogId,
            userId: userId,
            categotyId: categoryId
        })

        if (!blog) {
            return new NextResponse(JSON.stringify({ message: "Blog Not found" }), {
                status: 404
            })
        }

        return new NextResponse(JSON.stringify(blog), {
            status: 200
        })

    }
    catch (err: any) {
        return NextResponse.json({ message: "Error fetching a blog " + err.message }, { status: 500 })
    }
}

export const PATCH = async (request: Request, context: { params: any }) => {
    const blogId = context.params.blogId
    try {
        const { searchParams } = new URL(request.url)
        const body = await request.json()
        const { title, description } = body
        const userId = searchParams.get("userId")

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "User Id invalid or missing" }), {
                status: 404
            })
        }
        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(JSON.stringify({ message: "Blog Id invalid or missing" }), {
                status: 404
            })
        }
        await connect()

        const user = await User.findById(userId)

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User Not found" }), {
                status: 404
            })

        }

        const blog = await Blog.findOne({ _id: blogId, user: userId })

        if (!blog) {
            return new NextResponse(JSON.stringify({ message: "Blog Not found" }), {
                status: 404
            })
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { title, description },
            { new: true }
        )

        return new NextResponse(JSON.stringify({ updatedBlog }), {
            status: 200
        })
    }
    catch (err: any) {
        return new NextResponse(JSON.stringify({ message: "Eror updating the blog " + err.message }), {
            status: 500
        })
    }
}

export const DELETE = async (request: Request, context: { params: any }) => {
    const blogId = context.params.blogId
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId")

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "User Id invalid or missing" }), {
                status: 404
            })
        }
        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse(JSON.stringify({ message: "Blog Id invalid or missing" }), {
                status: 404
            })
        }
        await connect()

        const user = await User.findById(userId)

        if (!user) {
            return new NextResponse(JSON.stringify({ message: "User Not found" }), {
                status: 404
            })

        }

        const blog = await Blog.findOne({ _id: blogId, user: userId })

        if (!blog) {
            return new NextResponse(JSON.stringify({ message: "Blog Not found" }), {
                status: 404
            })
        }

        await Blog.findByIdAndDelete(blogId)

        return new NextResponse(JSON.stringify({ message: "Blog is deleted" }),
            { status: 200 }
        )

    }
    catch (err: any) {
        return NextResponse.json({ message: "Error deleting the blog " + err.message }, { status: 500 })
    }
}