import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '../actions'
import BookReader from '@/components/content-viewer'
import { getBook, uploadPinecone } from '@/lib/pdf/pdf-actions'

export const metadata = {
  title: 'Vanchan'
}



export default async function IndexPage() {
  const id = nanoid()
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()
  const book = JSON.parse(await getBook());
  uploadPinecone();


  return (
    <div className="flex h-[calc(100vh_-_theme(spacing.16))]">
       <AI initialAIState={{ chatId: id, messages: [] }}>
      <div className="sm:hidden md:block md:w-7/12 overflow-auto p-10">
     <BookReader book = {book}></BookReader>

      </div>
      <div className="md:w-5/12  overflow-auto ">
       
      <Chat id={id} session={session} missingKeys={missingKeys} />

    </div>
    </AI>
    </div>
  )
}
