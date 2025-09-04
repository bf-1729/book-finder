import React, { useEffect, useState, useRef } from "react";
import BookCard from "./BookCard";

const Books = () => {
  const [title, setTitle] = useState(localStorage.getItem("title") || "");
  const [year, setYear] = useState(localStorage.getItem("year") || "");
  const [language, setLanguage] = useState(localStorage.getItem("language") || "");

  // Parse from localStorage only on initialization
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem("books");
    return saved ? JSON.parse(saved) : [];
  });

  const allLanguages = {
  eng: "English",
  fre: "French",
  ger: "German",
  spa: "Spanish",
  ita: "Italian",
  por: "Portuguese",
  rus: "Russian",
  chi: "Chinese",
  jpn: "Japanese",
  ara: "Arabic",
  hin: "Hindi",
  ben: "Bengali",
  tam: "Tamil",
  tel: "Telugu",
  mal: "Malayalam",
  urd: "Urdu",
  tur: "Turkish",
  kor: "Korean",
  dut: "Dutch",
  pol: "Polish",
  swe: "Swedish",
  fin: "Finnish",
  nor: "Norwegian",
  dan: "Danish",
  cze: "Czech",
  gre: "Greek",
  heb: "Hebrew",
  ind: "Indonesian",
  tha: "Thai",
  vie: "Vietnamese",
  ukr: "Ukrainian",
  rum: "Romanian",
  hun: "Hungarian",
  per: "Persian",
  scc: "Serbian",
  slo: "Slovak",
  bul: "Bulgarian",
  lit: "Lithuanian",
  lav: "Latvian",
  est: "Estonian",
  slv: "Slovenian",
  hrv: "Croatian",
  gle: "Irish",
  mlt: "Maltese",
  ice: "Icelandic",
  afr: "Afrikaans",
  swa: "Swahili",
};


  const [booksFound, setBooksFound] = useState(books.length);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedTitle, setDebouncedTitle] = useState(title);

  const isFirstRender = useRef(true);

  // Debounce title input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedTitle(title), 500);
    return () => clearTimeout(handler);
  }, [title]);

  // Fetch books function
  const fetchBooks = async (filters) => {
    setIsLoading(true);
    try {
      const query = [];
      if (filters.title) query.push(`title=${encodeURIComponent(filters.title)}`);
      if (filters.year) query.push(`first_publish_year=${encodeURIComponent(filters.year)}`);

      const url =
        query.length === 0
          ? "https://openlibrary.org/search.json?q=the"
          : `https://openlibrary.org/search.json?${query.join("&")}`;

      const response = await fetch(url);
      const data = await response.json();
      let docs = data.docs || [];

      // Language filter (manual)
      if (filters.language) {
  docs = docs.filter(
    (book) =>
      Array.isArray(book.language) &&
      book.language.includes(filters.language)
  );
}


      setBooks(docs);
      setBooksFound(docs.length);
      localStorage.setItem("books", JSON.stringify(docs));
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch books when filters change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (books.length === 0) {
        fetchBooks({});
      } else {
        setBooksFound(books.length);
      }
      return;
    }

    fetchBooks({ title: debouncedTitle, year, language });

    // Save filters
    localStorage.setItem("title", title);
    localStorage.setItem("year", year);
    localStorage.setItem("language", language);
    // eslint-disable-next-line
  }, [debouncedTitle, year, language]); // Only trigger on filter changes

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex flex-col">
      <div className="lg:w-[80%] w-[90%] mx-auto py-10 relative">
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent drop-shadow-md">
          📚 Book Finder
        </h1>

        {/* Filters */}
        <div className="mt-8 mb-6 bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 flex flex-col lg:flex-row gap-6 items-center lg:justify-between relative z-30">
          {/* Title */}
          <div className="relative w-full lg:w-1/2">
            <input
              type="text"
              placeholder="🔍 Search by Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full lg:p-3 p-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            {/* Suggestions */}
            {showSuggestions && debouncedTitle.trim() && books.length > 0 && (
              <ul className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {books.map((book) => (
                  <li
                    key={book.key}
                    onMouseDown={() => {
                      setTitle(book.title);
                      setShowSuggestions(false);
                    }}
                    className="cursor-pointer px-4 py-2 hover:bg-indigo-100 transition"
                  >
                    {book.title}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Year + Language */}
          <div className="flex gap-4 w-full lg:w-1/2">
            <input
              type="number"
              placeholder="📅 Published Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="flex-1 lg:p-3 p-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-[45%]"
            />

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="flex-1 lg:p-3 p-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-[45%]"
            >
              <option value="">🌐 Language</option>
              {Object.entries(allLanguages).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loader / Results */}
        {isLoading ? (
          <div className="flex justify-center mt-10">
            <div className="w-16 h-16 border-4 border-indigo-400 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {(debouncedTitle || year || language) && books.length === 0 && (
              <div className="flex justify-center mt-10">
                <h2 className="text-gray-500 text-lg">No books found ❌</h2>
              </div>
            )}
            <p className="text-center text-gray-600 mt-4 font-medium">
              {booksFound} books found ✅
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 relative z-10">
              {books.map((book) => (
                <BookCard
                  key={book.key}
                  title={book.title}
                  author={book.author_name?.[0]}
                  year={book.first_publish_year}
                  language={book.language}
                  coverId={book.cover_i}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Books;
