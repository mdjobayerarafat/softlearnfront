import { Loader } from 'lucide-react'
import { UploadIcon } from '@radix-ui/react-icons'
import React, {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
} from 'react'
import { cn } from '@/lib/utils'

const FileUploadBlockInput: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
  onChange,
  className,
  ...props
}) => {
  return (
    <input
      className={cn(
        'p-3 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 hover:file:cursor-pointer file:bg-slate-700/80 cursor-pointer file:text-blue-200 bg-slate-800/80 text-white placeholder:text-blue-200 border border-white/10',
        className
      )}
      onChange={onChange}
      type="file"
      required
      {...props}
    />
  )
}

const FileUploadBlockButton: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement>
> = ({ onClick, className, ...props }) => {
  return (
    <button
      className={cn(
        'p-2 px-3 bg-slate-700/80 backdrop-blur-sm rounded-lg text-blue-200 enabled:hover:bg-slate-600/80 transition space-x-2 items-center flex disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      onClick={onClick}
      {...props}
    >
      <UploadIcon />
      <p>Submit</p>
    </button>
  )
}

interface UploadBlockComponentProps extends HTMLAttributes<HTMLDivElement> {
  isLoading: boolean
  isEditable: boolean
  isEmpty: boolean
  Icon: any
  children: React.ReactNode
}

function FileUploadBlock({
  isLoading,
  isEditable,
  isEmpty,
  Icon,
  children,
}: UploadBlockComponentProps) {
  if (isLoading)
    return <Loader className="animate-spin text-gray-200" size={50} />

  if (!isEditable && isEmpty)
    return (
      <div className="flex items-center gap-5">
        {<Icon className="text-gray-200" size={50} />}
        <p>No file available for preview.</p>
      </div>
    )

  return (
    <>
      {<Icon className="text-gray-200" size={50} />}
        {children}
    </>
  )
}

function FileUploadBlockWrapper({
  children,
  isEmpty,
  ...props
}: UploadBlockComponentProps) {
  return (
    isEmpty && (
    <div className="flex items-center justify-center space-x-3 py-7 bg-slate-800/80 backdrop-blur-sm rounded-xl text-white px-3 border-dashed border-white/10 border-2 text-sm" contentEditable={false}>
      <FileUploadBlock isEmpty {...props}>{children}</FileUploadBlock>
    </div>
    )
  )
}

export {
  FileUploadBlockWrapper as FileUploadBlock,
  FileUploadBlockInput,
  FileUploadBlockButton,
}
