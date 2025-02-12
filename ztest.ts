import { z } from "zod";

// 🎯 Create a simple string schema
const nameSchema = z.string()
  .min(2, "Name must be at least 2 characters") // Minimum length
  .max(30, "Name is too long!"); // Maximum length

// 🧪 Let's try using it!
try {
  const validName = nameSchema.parse("John"); // ✅ Works!
  console.log("Valid name:", validName);
  
  nameSchema.parse("A"); // ❌ Will throw error (too short)
} catch (error) {
  console.error("Validation failed:", error);
}