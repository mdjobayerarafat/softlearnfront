'use client'
import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { styled, keyframes } from '@stitches/react'
import { blackA } from '@radix-ui/colors'
import { AlertTriangle, Info } from 'lucide-react'

type ModalParams = {
  confirmationMessage: string
  confirmationButtonText: string
  dialogTitle: string
  functionToExecute: any
  dialogTrigger?: React.ReactNode
  status?: 'warning' | 'info'
  buttonid?: string
}

const ConfirmationModal = (params: ModalParams) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const warningColors = 'bg-rose-600/20 backdrop-blur-xl border border-rose-400/30 text-rose-300'
  const infoColors = 'bg-cyan-600/20 backdrop-blur-xl border border-cyan-400/30 text-cyan-300'
  const warningButtonColors = 'text-white bg-rose-600/90 backdrop-blur-xl border border-rose-400/30 hover:bg-rose-600/70 shadow-lg shadow-rose-500/20'
  const infoButtonColors = 'text-white bg-cyan-600/90 backdrop-blur-xl border border-cyan-400/30 hover:bg-cyan-600/70 shadow-lg shadow-cyan-500/20'

  const onOpenChange = React.useCallback(
    (open: any) => {
      setIsDialogOpen(open)
    },
    [setIsDialogOpen]
  )

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={onOpenChange}>
      {params.dialogTrigger ? (
        <Dialog.Trigger asChild>{params.dialogTrigger}</Dialog.Trigger>
      ) : null}

      <Dialog.Portal>
        <DialogOverlay />
        <DialogContent>
          <div className="flex space-x-4 tracking-tight">
            <div
              className={`icon p-6 rounded-xl flex items-center align-content-center ${
                params.status === 'warning' ? warningColors : infoColors
              }`}
            >
              {params.status === 'warning' ? (
                <AlertTriangle size={35} />
              ) : (
                <Info size={35} />
              )}
            </div>
            <div className="text pt-1 space-x-0 w-auto grow">
              <div className="text-xl font-bold text-white">
                {params.dialogTitle}
              </div>
              <div className="text-md text-purple-300 leading-tight mt-1">
                {params.confirmationMessage}
              </div>
              <div className="flex flex-row-reverse mt-4">
                <div
                  id={params.buttonid}
                  className={`rounded-md text-sm px-3 py-2 font-bold flex justify-center items-center hover:cursor-pointer ${
                    params.status === 'warning'
                      ? warningButtonColors
                      : infoButtonColors
                  }
                                hover:shadow-lg transition duration-300 ease-in-out
                                `}
                  onClick={() => {
                    params.functionToExecute()
                    setIsDialogOpen(false)
                  }}
                >
                  {params.confirmationButtonText}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
})

const overlayClose = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
})

const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -50%) scale(.96)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
})

const contentClose = keyframes({
  '0%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
  '100%': { opacity: 0, transform: 'translate(-50%, -52%) scale(.96)' },
})

const DialogOverlay = styled(Dialog.Overlay, {
  backgroundColor: blackA.blackA9,
  position: 'fixed',
  zIndex: 500,
  inset: 0,
  animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  '&[data-state="closed"]': {
    animation: `${overlayClose} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
})

const DialogContent = styled(Dialog.Content, {
  backgroundColor: 'rgb(15 23 42 / 0.7)',
  backdropFilter: 'blur(8px)',
  borderRadius: 18,
  zIndex: 501,
  boxShadow:
    'hsl(206 22% 7% / 50%) 0px 10px 38px -10px, hsl(206 22% 7% / 30%) 0px 10px 20px -15px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  minWidth: '500px',
  maxWidth: '600px',
  overflow: 'visible',
  height: 'auto',
  maxHeight: '85vh',
  padding: '24px',
  animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  '&:focus': { outline: 'none' },

  '&[data-state="closed"]': {
    animation: `${contentClose} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  transition: 'max-height 0.3s ease-out',
})

export default ConfirmationModal
