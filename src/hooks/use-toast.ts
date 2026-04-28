"use client"

import { toast as sonner } from "sonner"

type ToastType = "success" | "error" | "info" | "warning" | "default"

interface ToastOptions {
  description?: string
  duration?: number
}

const toastTypes: Record<ToastType, (message: string, opts?: ToastOptions) => void> = {
  default: (message, opts) => sonner(message, opts),
  success: (message, opts) => sonner.success(message, opts),
  error: (message, opts) => sonner.error(message, opts),
  info: (message, opts) => sonner.info(message, opts),
  warning: (message, opts) => sonner.warning(message, opts),
}

export function toast(message: string, opts?: ToastOptions & { type?: ToastType }) {
  const type = opts?.type || "default"
  return toastTypes[type](message, opts)
}

export function success(message: string, opts?: ToastOptions) {
  sonner.success(message, opts)
}

export function error(message: string, opts?: ToastOptions) {
  sonner.error(message, opts)
}

export function info(message: string, opts?: ToastOptions) {
  sonner.info(message, opts)
}

export function warning(message: string, opts?: ToastOptions) {
  sonner.warning(message, opts)
}