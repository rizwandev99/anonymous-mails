import {z} from 'zod';

export const usernameValidation = z.string().min(2,"Username must be atleast 2 characters long").max(20,'username must not be more than 20 characters long').regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6,{message:"Password must be at least be 6 characters."})
})
