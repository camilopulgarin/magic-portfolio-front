import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es requerido")
    .email("Correo electrónico inválido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, "El nombre completo es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  username: z
    .string()
    .min(1, "El nombre de usuario es requerido")
    .min(3, "El username debe tener al menos 3 caracteres")
    .max(30, "El username no puede exceder 30 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guiones bajos"),
  email: z
    .string()
    .min(1, "El correo es requerido")
    .email("Correo electrónico inválido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(72, "La contraseña no puede exceder 72 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      "La contraseña debe contener al menos una mayúscula, una minúscula y un número"),
  confirmPassword: z.string().min(1, "Debes confirmar tu contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export type RegisterFormData = z.infer<typeof registerSchema>