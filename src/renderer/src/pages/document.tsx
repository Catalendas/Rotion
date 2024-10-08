import { useParams } from 'react-router-dom'
import { Editor, OnContentUpdatedParams } from '../components/Editor'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Document as IPCDocument } from '~/src/shared/types/ipc'

export function Document() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data, isFetching } = useQuery({
    queryKey: ['document', id],
    queryFn: async () => {
      const response = await window.api.fetchDocument({ id: id! })
      return response.data
    },
  })

  const { mutateAsync: saveDocument } = useMutation({
    mutationFn: async ({ title, content }: OnContentUpdatedParams) => {
      await window.api.saveDocument({
        id: id!,
        title,
        content,
      })
    },
    onSuccess: (_, { title }) => {
      queryClient.setQueryData<IPCDocument[]>(['documents'], (documents) => {
        return documents?.map((document) => {
          if (document.id === id) {
            return { ...document, title }
          }

          return document
        })
      })
    },
  })

  const initialContent = useMemo(() => {
    if (data) {
      return `<h1>${data.title}</h1>${data.content ?? '<p></p>'}`
    }

    return ''
  }, [data])

  function handleEditorContentUpdated({
    title,
    content,
  }: OnContentUpdatedParams) {
    saveDocument({
      title,
      content,
    })
  }

  return (
    <main className="flex-1 flex py-12 px-10 gap-8">
      <aside className="hidden lg:block sticky top-0">
        <span className="text-rotion-300 font-semibold text-xs">
          Table of contents
        </span>
{/* 
        <ToC.Root>
          <ToC.Link>Back-end</ToC.Link>
          <ToC.Section>
            <ToC.Link>Banco de dados</ToC.Link>
            <ToC.Link>API REST</ToC.Link>
            <ToC.Link>Orientação a objetos</ToC.Link>
          </ToC.Section>

          <ToC.Link>Front-end</ToC.Link>
          <ToC.Section>
            <ToC.Link>Java Script</ToC.Link>
            <ToC.Link>React</ToC.Link>
            <ToC.Link>Electron</ToC.Link>
          </ToC.Section>
        </ToC.Root> */}
      </aside>

      <section className="flex-1 flex flex-col items-center max-h-[37rem] overflow-x-auto scrollbar-thin scrollbar-thumb-rotion-600 scrollbar-track-rotion-800">
        {!isFetching && data && (
          <Editor
            onContentUpdated={handleEditorContentUpdated}
            content={initialContent}
          />
        )}
      </section>
    </main>
  )
}
