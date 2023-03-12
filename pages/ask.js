// import { useEffect, useRef, useState } from "react";
// import Header from "@/components/Header";
// import Head from "next/head";
// import axios from "axios";

// const BACK_END = {
//   ask: "http://localhost:8080/ask",
//   correction: "http://localhost:8080/ask2",
//   suggestion: "http://localhost:8080/suggestion"
// }

// function Ask() {
//   const inputRef = useRef(null);
//   const [suggestions, setSuggestions] = useState([]);
//   const [result, setResult] = useState({ question: '', answer: '' });
//   const [alternativeResult, setAlternativeResult] = useState({ question: '', answer: ''})
//   const [searchValue, setSearchValue] = useState('');
//   const [autocompleteInput, setAutocompleteInput] = useState('');
//   const [autocompleteCollection, setAutocompleteCollection] = useState([]);

//   useEffect(() => {
//     async function fetchSuggestions() {
//       try {
//         const index = autocompleteCollection.length
//         const head = (index === 0 ? '': autocompleteCollection[0])
//         const prev = (index === 0 ? '': autocompleteCollection[index-1])
//         const response = await axios.post(`${BACK_END.suggestion}?input=${autocompleteInput}&index=${index}&head=${head}&prev=${prev}`);
//         setSuggestions(response.data.suggestions);
//       } catch (error) {
//       }
//     }
//     if (autocompleteInput) {
//       fetchSuggestions();
//     } else {
//       setSuggestions([]);
//     }
//   }, [autocompleteInput, autocompleteCollection]);

//   const handleOnchangeInput = (input) => {
//     setSearchValue(input);
//     const suggestionMatch = suggestions.filter((item) =>
//       input.toLowerCase().includes(item.toLowerCase())
//     );
//     if (suggestionMatch.length === 1) {
//       setAutocompleteCollection([...autocompleteCollection, suggestionMatch[0]])
//       setAutocompleteInput('')
//       return
//     }
//     const autocompleteList = autocompleteCollection.filter((item) =>
//       input.toLowerCase().includes(item.toLowerCase())
//     );
//     const newAutocompleteInput = autocompleteList.reduce((str, substr) =>
//       str.toLowerCase().replace(new RegExp(substr.toLowerCase(), 'g'), '')
//     , input);
//     setAutocompleteInput(newAutocompleteInput.trim());
//     setAutocompleteCollection(autocompleteList);
//   }

//   const handleAutocomplete = async (e) => {
//     e.preventDefault();
//     const autocompleteText = e.target.outerText;
//     const newAutocompleteCollection = [...autocompleteCollection, autocompleteText];
//     setAutocompleteCollection(newAutocompleteCollection);
//     const currentInput = inputRef.current.value;
//     if (currentInput.toLowerCase().includes(autocompleteText.toLowerCase())) {
//       setAutocompleteInput(
//         currentInput
//         .toLowerCase()
//         .replace(new RegExp(autocompleteText.toLowerCase(), 'g'), '')
//       )
//     } else {
//       setAutocompleteInput("");
//       inputRef.current.value = newAutocompleteCollection.join(" ");
//       setSearchValue(newAutocompleteCollection.join(" "));
//     }
//     inputRef.current.focus();
//   }
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     inputRef.current.value = '';
//     try {
//       const response = await axios.post(`${BACK_END.ask}?question=${searchValue}`);
//       if (response.data.invalid) {
//         setResult({
//           question: searchValue,
//           answer: "Pertanyaan tidak dikenali"
//         })
//         const alternativeResponse = await axios.post(`${BACK_END.correction}?question=${searchValue}`)
//         if (alternativeResponse.data.result) {
//           setAlternativeResult({
//             question: alternativeResponse.data.question,
//             answer: alternativeResponse.data.result
//           })
//         }
//       } else {
//         setResult({
//           question: searchValue,
//           answer: response.data['result']
//         })
//         setAlternativeResult({
//           question: '',
//           answer: ''
//         })
//       }
//     } catch (error) {
//     }
//     setSearchValue("");
//     setSuggestions([]);
//     setAutocompleteCollection([]);
//     setAutocompleteInput('');
//   }

//   return (
//     <div className='flex flex-col items-center justify-center w-screen'>
//       <Head>
//         <title>Lexid - Tanya</title>
//       </Head>
//       <Header />
//       <div className='flex flex-col items-center justify-center flex-grow w-4/5 z-0'>
//         <div className="w-full lg:pt-24 md:pt-16 pt-10">
//           <form onSubmit={handleSubmit}>
//             <div className="flex space-x-1 items-start">
//               <div className="w-full">
//                 <input
//                   required
//                   ref={inputRef}
//                   className={`w-full bg-white px-4 py-2 text-gray-700 ${
//                     suggestions.length > 0
//                       ? "rounded-tl-lg rounded-tr-lg"
//                       : "rounded-lg"
//                   } z-10 border focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 text-black`}
//                   placeholder="Ketik Pertanyaan"
//                   onChange={ e => handleOnchangeInput(e.target.value)}
//                   onClick={ e => handleOnchangeInput(e.target.value)}
//                 />
//                 <ul className="w-auto rounded-bl-lg rounded-br-lg border-r border-l border-b bg-white focus:border-slate-300 focus:outline-none focus:ring focus:ring-slate-200 focus:ring-opacity-40 max-h-[45vh] overflow-y-auto">
//                   {suggestions.map((suggestion) => {
//                     return (
//                       // eslint-disable-next-line react/jsx-key
//                       <li
//                         className="flex space-x-1 cursor-pointer border-slate-200 p-2 px-4 text-black hover:bg-slate-300">
//                         <p>{autocompleteCollection.length > 0? '...' : '' } </p>
//                         <p className="w-full h-full"onClick={e => handleAutocomplete(e)}>{suggestion}</p>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </div>
//               <button type="submit" className="inline-flex items-center py-2.5 px-3 ml-2 text-sm font-medium text-white bg-amber-700 rounded-lg border border-amber-700 hover:bg-amber-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
//                 <svg aria-hidden="true" className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor"
//                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round"
//                 stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>Search
//               </button>
//             </div>
//           </form>
//         </div>
//         {result.answer && 
//           <div className="w-full p-5">
//             <div className="p-3 border-b border-slate-300">
//               <p className="font-medium">Pertanyaan:</p>
//               <p>{result.question}</p>
//             </div>
//             <div className="p-3 border-b border-slate-300">
//               <p className="font-medium">Jawaban:</p>
//               <p className="whitespace-pre-line">{result.answer}</p>
//             </div>
//           </div>
//         }
//         {alternativeResult.answer &&
//           <div className="w-full p-5">
//             <div className="p-3 border border-slate-300">
//               <p className="font-medium">Apakah maksud pertanyaan Anda?</p>
//               <p className="mt-2.5">{alternativeResult.question}</p>
//               <div className="flex mt-0.5 w-full space-x-3">
//                 <p className="font-medium">Jawaban:</p>
//                 <div>
//                   <p className="whitespace-pre-line">
//                     {alternativeResult.answer}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         }
//       </div>
//     </div>
//   );
// }

// export default Ask;