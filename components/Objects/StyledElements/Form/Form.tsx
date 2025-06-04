import React from 'react'
import * as Form from '@radix-ui/react-form'
import { styled } from '@stitches/react'
import { blackA } from '@radix-ui/colors'
import { Info } from 'lucide-react'

interface FormLayoutProps {
  children: React.ReactNode
  onSubmit: (e: any) => void
  className?: string
}

const FormLayout = ({ children, onSubmit, className }: FormLayoutProps) => {
  return (
    <Form.Root onSubmit={onSubmit} className={className}>
      {children}
    </Form.Root>
  )
}

export const FormLabelAndMessage = (props: {
  label: string
  message?: string
}) => (
  <div className="flex items-center space-x-3">
    <FormLabel className="grow text-sm text-white">{props.label}</FormLabel>
    {(props.message && (
      <div className="text-rose-300 text-sm items-center rounded-md flex space-x-1">
        <Info size={10} />
        <div>{props.message}</div>
      </div>
    )) || <></>}
  </div>
)

export const FormRoot = styled(Form.Root, {
  margin: 7,
})

export const FormField = styled(Form.Field, {
  display: 'grid',
  marginBottom: 10,
})

export const FormLabel = styled(Form.Label, {
  fontWeight: 500,
  lineHeight: '35px',
  color: 'white',
})

export const FormMessage = styled(Form.Message, {
  fontSize: 13,
  color: 'white',
  opacity: 0.8,
})

export const Flex = styled('div', { display: 'flex' })

export const inputStyles = {
  all: 'unset',
  boxSizing: 'border-box',
  width: '100%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  fontSize: 15,
  color: 'white',
  background: 'rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(147, 51, 234, 0.3)',
  boxShadow: '0 8px 32px rgba(147, 51, 234, 0.1)',
  '&:hover': { 
    border: '1px solid rgba(147, 51, 234, 0.5)',
    background: 'rgba(0, 0, 0, 0.3)',
  },
  '&:focus': { 
    border: '1px solid rgba(147, 51, 234, 0.7)',
    boxShadow: '0 8px 32px rgba(147, 51, 234, 0.2)',
    background: 'rgba(0, 0, 0, 0.3)',
  },
  '&::placeholder': { color: 'rgba(168, 85, 247, 0.6)' },
  '&::selection': { backgroundColor: 'rgba(147, 51, 234, 0.3)', color: 'white' },
}

export const Input = styled('input', {
  ...inputStyles,
  height: 35,
  lineHeight: 1,
  padding: '0 10px',
  border: 'none',
})

export const Textarea = styled('textarea', {
  ...inputStyles,
  resize: 'none',
  padding: 10,
})

export const ButtonBlack = styled('button', {
  variants: {
    state: {
      loading: {
        pointerEvents: 'none',
        backgroundColor: 'rgba(100, 116, 139, 0.6)',
        backdropFilter: 'blur(12px)',
      },
      none: {},
    },
  },
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  padding: '0 15px',
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
  height: 35,

  background: 'rgba(147, 51, 234, 0.9)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(147, 51, 234, 0.3)',
  boxShadow: '0 8px 32px rgba(147, 51, 234, 0.2)',
  color: '#FFFFFF',
  '&:hover': { 
    backgroundColor: 'rgba(147, 51, 234, 0.7)', 
    cursor: 'pointer',
    boxShadow: '0 8px 32px rgba(147, 51, 234, 0.3)',
  },
  '&:focus': { boxShadow: `0 0 0 2px rgba(147, 51, 234, 0.5)` },
})

export default FormLayout
