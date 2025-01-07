// // src/app/api/db/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import mongoose from 'mongoose';
// import dbConnect from '@/lib/dbConnect';

// export async function POST(request: NextRequest) {
//   try {
//     // Establish database connection
//     await dbConnect();

//     // Create the data on the database
//     const user = new mongoose.models.User(request.body);
//     const result = await user.save();

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }