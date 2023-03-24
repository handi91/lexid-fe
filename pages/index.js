/* eslint-disable react/jsx-key */
import Head from 'next/head'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Link from 'next/link'
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import example from '@/constants/example-question.json'

const inter = Inter({ subsets: ['latin'] })

const BACKEND_ASK = process.env.NEXT_PUBLIC_ASK
const BACKEND_CORRECTION = process.env.NEXT_PUBLIC_CORRECTION
const BACKEND_SUGGESTION = process.env.NEXT_PUBLIC_SUGGESTION 

export default function Home() {
  const inputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autocompleteInput, setAutocompleteInput] = useState('');
  const [autocompleteCollection, setAutocompleteCollection] = useState([]);

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const index = autocompleteCollection.length
        const head = (index === 0 ? '': autocompleteCollection[0])
        const prev = (index === 0 ? '': autocompleteCollection[index-1])
        const response = await axios.post(`${BACKEND_SUGGESTION}?input=${autocompleteInput}&index=${index}&head=${head}&prev=${prev}`);
        setSuggestions(response.data.suggestions);
      } catch (error) {
        console.log(error)
        alert(error)
      }
    }
    fetchSuggestions();
  }, [autocompleteInput, autocompleteCollection]);

  const handleOnchangeInput = (input) => {
    setSearchValue(input);
    const suggestionMatch = suggestions.filter((item) =>
      input.toLowerCase().includes(item.toLowerCase())
    );
    if (suggestionMatch.length === 1) {
      setAutocompleteCollection([...autocompleteCollection, suggestionMatch[0]])
      setAutocompleteInput('')
      return
    }
    const autocompleteList = autocompleteCollection.filter((item) =>
      input.toLowerCase().includes(item.toLowerCase())
    );
    const newAutocompleteInput = autocompleteList.reduce((str, substr) =>
      str.toLowerCase().replace(new RegExp(substr.toLowerCase(), 'g'), '')
    , input);
    setAutocompleteInput(newAutocompleteInput.trim());
    setAutocompleteCollection(autocompleteList);
  }

  const handleAutocomplete = async (e) => {
    e.preventDefault();
    const autocompleteText = e.target.outerText;
    const newAutocompleteCollection = [...autocompleteCollection, autocompleteText];
    setAutocompleteCollection(newAutocompleteCollection);
    const currentInput = inputRef.current.value;
    if (currentInput.toLowerCase().includes(autocompleteText.toLowerCase())) {
      setAutocompleteInput(
        currentInput
        .toLowerCase()
        .replace(new RegExp(autocompleteText.toLowerCase(), 'g'), '')
      )
    } else {
      setAutocompleteInput("");
      inputRef.current.value = newAutocompleteCollection.join(" ");
      setSearchValue(newAutocompleteCollection.join(" "));
    }
    inputRef.current.focus();
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    inputRef.current.value = '';
    try {
      const response = await axios.post(`${BACKEND_ASK}?question=${searchValue}`);
      if (response.data.invalid) {
        let result = {
          question: searchValue,
          answer: "Pertanyaan tidak dikenali",
          alternativeQuestion : "",
          alternativeAnswer: ""
        }
        const alternativeResponse = await axios.post(`${BACKEND_CORRECTION}?question=${searchValue}`)
        if (alternativeResponse.data.result) {
          result.alternativeQuestion = alternativeResponse.data.question
          result.alternativeAnswer = alternativeResponse.data.result
        }
        setResults([...results, result])
      } else {
        setResults([...results, {
          question: searchValue,
          answer: response.data['result'],
          alternativeQuestion: '',
          alternativeAnswer: ''
        }])
      }
    } catch (error) {
    }
    setSearchValue("");
    setSuggestions([]);
    setAutocompleteCollection([]);
    setAutocompleteInput('');
  }
  
  const handleExample = async (e) => {
    e.preventDefault()
    const searchText = e.target.outerText
    try {
      const response = await axios.post(`${BACKEND_ASK}?question=${searchText}`);
      setResults([...results, {
          question: searchText,
          answer: response.data['result'],
          alternativeQuestion: '',
          alternativeAnswer: ''
        }])
    } catch (error) {
    }
  }
  useEffect(() => {
    document.getElementById('bottom').scrollIntoView({behavior:'smooth'})
  }, [results]);

  return (
    <div className="flex">
      <Head>
        <meta
          http-equiv="Content-Security-Policy"
          content="upgrade-insecure-requests" />
        <title>Lexid</title>
      </Head>
      <aside className="fixed top-0 left-0 z-40 w-96 h-screen transition-transform -translate-x-full md:translate-x-0 shadow-sm" aria-label="Sidebar">
        <div className="h-full px-3 pb-4 overflow-y-auto bg-gray-100 dark:bg-gray-800">
          <p className='p-4 font-medium text-lg text-white text-center w-full bg-amber-900 sticky top-0'>Contoh Pertanyaan</p>
          <ul className="space-y-2 mt-2">
            {example.map((data) => {
              return (
                <li>
                  <Link 
                    href="/"
                    onClick={e => handleExample(e)}
                    className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                    <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                    <span className="ml-3 text-[0.95rem]">{data.question}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>
      <div className='flex flex-col items-center justify-center md:ml-96 w-screen min-h-screen'>       
        <Header />
        <div className='flex flex-col items-center justify-start h-full flex-grow w-full z-0 py-20'>
          <div className="w-full py-3">
          {results.map((result) => {
            return (    
              <>
              <div className="flex space-x-8 items-start py-5 px-10 border-b border-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                <p className='w-5/6'>{result.question}</p>
              </div>
              <div className="flex space-x-8 items-start py-5 px-10 border-b border-slate-300 bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                  <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clip-rule="evenodd" />
                </svg>
                <div>
                <p className="whitespace-pre-line">{result.answer}</p>
                {result.alternativeQuestion &&
                  <div className="w-full py-3">
                    <div className="p-3 px-5 border border-slate-300">
                      <p className="font-medium">Apakah maksud pertanyaan Anda?</p>
                      <p className="mt-2.5">{result.alternativeQuestion}</p>
                      <div className="flex mt-0.5 w-full space-x-3">
                        <p className="font-medium">Jawaban:</p>
                        <div>
                          <p className="whitespace-pre-line">
                            {result.alternativeAnswer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>}
                </div>
              </div></>
            )
          })
          }
          <div id='bottom'></div>
          </div>
        </div>
        <div className="w-2/3 fixed bottom-0 bg-white z-10 pb-5">
          <form onSubmit={handleSubmit}>
            <div className="flex space-x-1 items-start">
              <div className="w-full">
                <input
                  required
                  ref={inputRef}
                  className={`w-full bg-white px-4 py-2 text-gray-700 ${
                    suggestions.length > 0
                      ? "rounded-tl-lg rounded-tr-lg"
                      : "rounded-lg"
                  } z-10 border focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 text-black`}
                  placeholder='Ketik pertanyaan dimulai dengan "Apa", "Bagaimana", "Berapa", "Kapan", "Peraturan", "Siapa"'
                  onChange={ e => handleOnchangeInput(e.target.value)}
                  onClick={ e => handleOnchangeInput(e.target.value)}
                />
                <ul className="w-auto rounded-bl-lg rounded-br-lg border-r border-l border-b bg-white focus:border-slate-300 focus:outline-none focus:ring focus:ring-slate-200 focus:ring-opacity-40 max-h-[45vh] overflow-y-auto">
                  {suggestions.map((suggestion) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <li
                        className="flex space-x-1 cursor-pointer border-slate-200 p-1.5 px-4 text-black hover:bg-slate-300">
                        <p>{autocompleteCollection.length > 0 ? '...' : '' } </p>
                        <p className="w-full h-full" onClick={e => handleAutocomplete(e)}>{suggestion}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <button type="submit" className="inline-flex items-center py-2.5 px-3 ml-2 text-sm font-medium text-white bg-amber-600 rounded-lg border border-amber-600 hover:bg-amber-700 focus:ring-4 focus:outline-none focus:ring-blue-300">
                <svg aria-hidden="true" className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor"
                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
