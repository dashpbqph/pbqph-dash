/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image'
import { Camera } from 'lucide-react'

import { toast } from '@/components/ui/use-toast'

type EditableAvatarProps = {
  form: any
  userAvatar: string | null
}

export default function EditableAvatar({
  form,
  userAvatar,
}: EditableAvatarProps) {
  const addImage = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/jpeg, image/png'

    fileInput.addEventListener('change', async (e) => {
      const imageFile = (e.target as HTMLInputElement).files?.[0]

      if (imageFile) {
        if (imageFile.size > 4 * 1024 * 1024) {
          toast({
            title: 'Imagem muito grande',
            description: 'A imagem deve ter no máximo 4MB.',
            status: 'error',
          })
          return
        }

        form.setValue('image', imageFile)
      }
    })

    fileInput.click()
  }

  return (
    <div className="flex justify-center">
      <button
        type="button"
        className="group relative flex h-[160px] w-[160px] items-center justify-center overflow-hidden rounded-full bg-gray-400"
        onClick={addImage}
      >
        {form.watch('image').size > 0 ? (
          <Image
            src={URL.createObjectURL(form.watch('image'))}
            alt="imagem do usuário"
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 768px) 50vw, 30vw"
          />
        ) : userAvatar ? (
          <Image
            src={userAvatar}
            alt="imagem do usuário"
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 768px) 50vw, 30vw"
          />
        ) : null}
        <Camera className="relative z-10 hidden h-9 w-9 text-white transition-all group-hover:block" />
        <div className="absolute inset-0 bg-black bg-opacity-0 transition-all group-hover:bg-opacity-50" />
      </button>
    </div>
  )
}
