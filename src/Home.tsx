import { XCircle } from '@phosphor-icons/react'
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { FormEvent, useEffect, useState, useRef } from 'react'
import db from './firebase'
import './index.css'

interface Doc {
  id: string
  name: string
}

export default function Home() {
  return Main()
}

function Main() {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [names, setNames] = useState<Doc[]>([])

  async function GetDocs() {
    await getDocs(collection(db, 'names')).then((querySnapshot) => {
      const nomes: Doc[] = []

      querySnapshot.forEach((doc) => {
        nomes.push({ id: doc.id, name: doc.data().name })
      })

      nomes.sort((a, b) => a.name.localeCompare(b.name))
      setNames(nomes)
    })
  }

  async function AddDoc(e: FormEvent) {
    e.preventDefault()

    try {
      // 'names' = nome da collection
      await addDoc(collection(db, 'names'), {
        // Acrescentar aqui demais campos a serem enviados
        name,
      })

      setName('')

      await GetDocs()
    } catch (err) {
      console.error('Erro ao adicionar um documento: ', err)
    }
  }

  async function DeleteDoc(docId: string) {
    await deleteDoc(doc(db, 'names', docId))
    GetDocs()
  }

  useEffect(() => {
    async function fetchData() {
      await GetDocs()
    }
    fetchData()

    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <main className="flex flex-col min-h-screen p-8 items-center">
      <div className="w-[70vw] text-center">
        <h1 className="text-[2.5rem] mb-4 text-center">Names List</h1>
        <form onSubmit={AddDoc}>
          <input
            type="text"
            placeholder="What do you have to do today?"
            ref={inputRef}
            className="text-black mx-8 w-9/12 px-4 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="submit"
            className="my-4 py-4 px-6 bg-zinc-700 text-white rounded cursor-pointer hover:bg-zinc-800"
          >
            Enviar
          </button>
        </form>
      </div>
      <div className="w-[70vw]">
        <div className="p-8">
          {names?.map((doc, id) => (
            <p key={id} className="flex my-1 items-center">
              <XCircle
                size={32}
                className="mr-2 cursor-pointer text-red-600"
                onClick={() => DeleteDoc(doc.id)}
              />
              {doc.name}
            </p>
          ))}
        </div>
      </div>
    </main>
  )
}
