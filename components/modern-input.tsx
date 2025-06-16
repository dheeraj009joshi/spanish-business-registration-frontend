"use client"

import { useState } from "react"
import type React from "react"

interface ModernInputProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  required?: boolean
  textarea?: boolean
  error?: boolean
}

export default function ModernInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  textarea = false,
  error = false,
}: ModernInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  const inputClasses = `peer w-full px-4 py-4 text-base border-2 rounded-lg bg-white dark:bg-gray-800 transition-all duration-200 
    placeholder-transparent focus:outline-none focus:ring-0 
    ${
      error
        ? "border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400"
        : "border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400"
    } text-gray-900 dark:text-white`

  const labelClasses = `absolute left-4 transition-all duration-200 pointer-events-none 
    ${
      error
        ? "text-red-500 dark:text-red-400"
        : "text-gray-500 dark:text-gray-400 peer-focus:text-green-600 dark:peer-focus:text-green-400"
    } 
    ${
      value || isFocused
        ? "top-2 text-xs font-medium"
        : "top-4 text-base peer-focus:top-2 peer-focus:text-xs peer-focus:font-medium"
    }`

  if (textarea) {
    return (
      <div className="relative mb-1">
        <textarea
          id={id}
          className={`${inputClasses} resize-none min-h-[120px]`}
          placeholder={label}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
        />
        <label htmlFor={id} className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
    )
  }

  return (
    <div className="relative mb-1">
      <input
        id={id}
        type={type}
        className={inputClasses}
        placeholder={label}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
      />
      <label htmlFor={id} className={labelClasses}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    </div>
  )
}
