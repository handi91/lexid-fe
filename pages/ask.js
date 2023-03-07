import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Head from "next/head";
import axios from "axios";

const BACK_END = {
  ask: "http://localhost:8080/ask",
  suggestion: "http://localhost:8080/suggestion"
}

function Ask() {
  const inputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [result, setResult] = useState({ question: '', answer: '' });
  const [searchValue, setSearchValue] = useState('');
  // const [requestToken, setRequestToken] = useState(null);

  // useEffect(() => {
  //   const source = axios.CancelToken.source();
  //   setRequestToken(source);
  //   async function fetchSuggestions() {
  //     try {
  //       const response = await axios.post(`${BACK_END.suggestion}?input=${searchValue}`);
  //       setSuggestions(response.data.suggestions);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   if (searchValue) {
  //     fetchSuggestions();
  //   } else {
  //     setSuggestions([]);
  //   }
  //   return () => {
  //     source.cancel("Request canceled due to new searchValue");
  //   };
  // }, [searchValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    inputRef.current.value = '';
    try {
      const response = await axios.post(`${BACK_END.ask}?question=${searchValue}`);
      if (response.data.invalid) {
        setResult({
          question: searchValue,
          answer: "pertanyaan tidak dikenali"
        })
      } else {
        setResult({
          question: searchValue,
          answer: response.data['result']
        })
      }
    } catch (error) {
      console.error(error);
    }
    setSearchValue("");
    setSuggestions([]);
  }

  return (
    <div className='flex flex-col items-center justify-center w-screen'>
      <Head>
        <title>Lexid - Tanya</title>
      </Head>
      <Header />
      <div className='flex flex-col items-center justify-center flex-grow w-4/5 z-0'>
        <div className="w-full lg:pt-24 md:pt-16 pt-10">
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
                  placeholder="Ketik Pertanyaan"
                  onChange={ e => setSearchValue(e.target.value)}
                  onClick={ e => setSearchValue(e.target.value)}
                />
                <ul className="w-auto rounded-bl-lg rounded-br-lg border-r border-l border-b bg-white focus:border-slate-300 focus:outline-none focus:ring focus:ring-slate-200 focus:ring-opacity-40 max-h-[45vh] overflow-y-auto">
                  {suggestions.map((result) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <li className=" cursor-pointer border-slate-200 p-2 px-4 text-black hover:bg-slate-300">
                        {result}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <button type="submit" className="inline-flex items-center py-2.5 px-3 ml-2 text-sm font-medium text-white bg-amber-700 rounded-lg border border-amber-700 hover:bg-amber-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                <svg aria-hidden="true" className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor"
                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round"
                stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>Search
              </button>
            </div>
          </form>
        </div>
        {result.answer && 
          <div className="w-full p-5">
            <div className="p-3 border-b border-slate-300">
              <p className="font-medium">Pertanyaan:</p>
              <p>{result.question}</p>
            </div>
            <div className="p-3 border-b border-slate-300">
              <p className="font-medium">Jawaban:</p>
              <p className="whitespace-pre-line">{result.answer}</p>
            </div>
          </div>}
      </div>
    </div>
  );
}

export default Ask;