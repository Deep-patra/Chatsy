'use client'

import { useState, useEffect, useRef, useContext, useTransition } from 'react'
import { CiSearch } from 'react-icons/ci'
import Modal from '../Modal'
import Input from '../input'
import SearchResults from './results'
import Auth from '@/context/auth.context'
import ContactService from '@/services/contact.service'

interface ISearchResultItem {
  name: string
  photoURL: string
  uid: string
}

export default function Search() {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const [open, toggle] = useState<boolean>(false)
  const [value, changeValue] = useState<string>('')
  const [loading, changeLoading] = useState<boolean>(false)
  const [results, changeResults] = useState<ISearchResultItem[]>([])

  const [pending, transition] = useTransition()

  const auth = useContext(Auth)

  const onClose = () => {
    toggle(false)
  }

  const handleInput = (event: any) => {
    const _value = (event.target as HTMLInputElement).value
    transition(() => {
      changeValue(_value)
    })
  }

  const getSearchResults = async (value: string): Promise<any[]> => {
    let results: any[] | void = await ContactService.search(value).catch(
      console.error
    )
    return results || []
  }

  const handleAddContact = (uid: string) => {
    return new Promise<void>((res, rej) => {
      if (auth.user) {
        ContactService.addContact(auth.user.uid, uid).finally(() => {
          res()
        })
      }
    })
  }

  // Listen to the input value changes,
  // Fetch the results
  useEffect(() => {
    if (value !== '') {
      timerRef.current = setTimeout(() => {
        // show the loading state
        changeLoading(true)

        getSearchResults(value).then((items) => {
          changeResults(items)

          console.log(items)
          // close the loading state
          changeLoading(false)
        })
      }, 1000)
    } else {
      timerRef.current && clearTimeout(timerRef.current)
      changeResults([])
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value])

  // Listen to the OPEN_SEARCH Event
  useEffect(() => {
    const handleEvent = () => {
      toggle(true)
    }

    document.body.addEventListener('OPEN_SEARCH', handleEvent)

    return () => {
      document.body.removeEventListener('OPEN_SEARCH', handleEvent)

      // clear States
      changeResults([])
      changeLoading(false)
      changeValue('')
    }
  }, [])

  return (
    <Modal {...{ open, onClose }}>
      <div className="search-modal shadow-2xl flex flex-col p-2 md:px-4 rounded-md bg-black2">
        {/* Header */}
        <div className="w-full px-1  mb-4 flex flex-row items-center">
          <h4 className="text-white1 text-md md:text-lg">Search</h4>
        </div>

        {/* Search Input */}
        <Input
          className="text-sm md:text-md"
          placeholder="search"
          value={value}
          onInput={handleInput}
          primaryIcon={<CiSearch className="w-6 h-6 text-inherit" />}
        />

        {/* Search Items */}
        <div className="decorate-scrollbar relative flex flex-row w-full h-full">
          <>
            {/* When input value is empty */}
            {value === '' && (
              <div className="w-full h-full flex-grow-1 flex flex-row items-center justify-center">
                <span className="text-white1 text-sm md:text-md">
                  🔍 Search for contacts
                </span>
              </div>
            )}

            {/* Search Results */}
            {results.length > 0 && (
              <SearchResults
                {...{
                  results,
                  contacts: auth.user ? auth.user.contacts : [],
                  addContact: handleAddContact,
                }}
              />
            )}

            {/* Loading State */}
            {value !== '' && loading === true && (
              <div className="w-full h-full flex flex-row items-center justify-center">
                <span className="text-white1 text-sm md:text-md">
                  Searching...
                </span>
              </div>
            )}

            {/* No Search Result found */}
            {value !== '' && loading === false && results.length === 0 && (
              <div className="w-full h-full flex flex-row items-center justify-center">
                <span className="text-white1 text-sm md:text-md">
                  No search results found!
                </span>
              </div>
            )}
          </>
        </div>
      </div>
    </Modal>
  )
}
