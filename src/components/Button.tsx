import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  'aria-label'?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
  'aria-label': ariaLabel,
}) => {
  const baseStyles =
    'min-h-[56px] px-8 py-3.5 rounded-lg font-bold text-base uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm hover:shadow-md'

  const variantStyles = {
    primary:
      'bg-black text-white hover:bg-volt hover:text-black focus:ring-volt/50 dark:bg-white dark:text-black dark:hover:bg-volt dark:hover:text-black dark:focus:ring-volt/50',
    secondary:
      'bg-gray-200 text-black hover:bg-volt hover:text-black focus:ring-gray-400 dark:bg-gray-800 dark:text-white dark:hover:bg-volt dark:hover:text-black dark:focus:ring-gray-600',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-600 dark:text-white dark:hover:bg-red-700 dark:focus:ring-red-500',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}

