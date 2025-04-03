import { toast as sonnerToast } from "sonner"

export type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "success" | "warning" | "error" | "info" | "loading"
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export const toast = {
  show: (props: ToastProps) => {
    const { title, description, variant = "default", duration = 5000, action } = props

    switch (variant) {
      case "success":
        return sonnerToast.success(title, { description, duration })
      case "error":
        return sonnerToast.error(title, { description, duration })
      case "warning":
        return sonnerToast.warning(title, { description, duration })
      case "info":
        return sonnerToast.info(title, { description, duration })
      case "loading":
        return sonnerToast.loading(title, { description, duration })
      default:
        return sonnerToast(title, { description, duration, action })
    }
  },

  success: (title: string, description?: string) => 
    sonnerToast.success(title, { description }),
  error: (title: string, description?: string) => 
    sonnerToast.error(title, { description }),
  warning: (title: string, description?: string) => 
    sonnerToast.warning(title, { description }),
  info: (title: string, description?: string) => 
    sonnerToast.info(title, { description }),
  loading: (title: string, description?: string) => 
    sonnerToast.loading(title, { description }),
  
  dismiss: (id?: string) => sonnerToast.dismiss(id),
  promise: sonnerToast.promise,
}
