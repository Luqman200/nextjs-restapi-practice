import connect from '@/app/lib/db';
import Category from '@/app/lib/modals/category';
import User from '@/app/lib/modals/user';
import { request } from 'http';
import { NextResponse } from 'next/server';
import { Types } from "mongoose";
import { url } from 'inspector';

export const GET = async (request: Request) => {
    try {

    }
    catch (err: any) {
        return new NextResponse("Error getting the category", err.message)
    }
}