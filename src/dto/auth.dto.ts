import {z} from "zod";

export const loginRequestDto = z.object({
    username: z.string(),
    password: z.string()
})

export const registerRequestDto = z.object({
    username: z.string().min(5, "Username must be at least 5 characters long"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/, "Password must include at least one uppercase letter and one special character"),
    email: z.email("Invalid email format")
})

export type LoginRequestDto = z.infer<typeof loginRequestDto>
export type RegisterRequestDto = z.infer<typeof registerRequestDto>