import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import "./index.css";

const Books = () => {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [language, setLanguage] = useState("");
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced values
  const [debouncedTitle, setDebouncedTitle] = useState("");
  const [debouncedYear, setDebouncedYear] = useState("");
  const [debouncedLanguage, setDebouncedLanguage] = useState("");

  // Debounce effect for smoother filtering
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTitle(title);
      setDebouncedYear(year);
      setDebouncedLanguage(language);
    }, 500); // adjust delay (ms) as needed

    return () => clearTimeout(handler);
  }, [title, year, language]);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      let query = [];
      if (debouncedTitle.trim()) query.push(`title=${encodeURIComponent(debouncedTitle)}`);
      if (debouncedYear.trim()) query.push(`first_publish_year=${encodeURIComponent(debouncedYear)}`);
      if (debouncedLanguage.trim()) query.push(`language=${encodeURIComponent(debouncedLanguage)}`);
      const url = `https://openlibrary.org/search.json?${query.join("&")}`;

      const response = await fetch(url);
      const data = await response.json();
      setBooks(data.docs || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedTitle.trim() || debouncedYear.trim() || debouncedLanguage.trim()) {
      fetchBooks();
    } else {
      setBooks([]);
    }
  }, [debouncedTitle, debouncedYear, debouncedLanguage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-white to-gray-200">
      <div className="lg:w-[80%] w-[90%] mx-auto">
        <h1 className="flex justify-center text-2xl font-bold w-full mx-auto mb-6 pt-10">
          Book Finder
        </h1>

        <div className="mb-6 lg:mb-0 w-full flex flex-col lg:flex-row gap-4 items-center lg:justify-around justify-center relative">
          <input
            type="text"
            placeholder="Search by Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="outline-1 outline-gray-400 mx-12 lg:p-4 p-1 rounded shadow lg:w-1/2 w-full bg-white"
          />

          {showSuggestions && debouncedTitle.trim() && books.length > 0 && (
            <ul className="absolute top-8 left-0 right-0 z-20 bg-white border border-gray-300 rounded shadow max-h-60 lg:w-1/2 overflow-y-auto">
              {books.map((book) => (
                <li
                  key={book.key}
                  onMouseDown={() => {
                    setTitle(book.title);
                    setShowSuggestions(false);
                  }}
                  className="cursor-pointer px-3 py-2 hover:bg-blue-100"
                >
                  {book.title}
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-8 lg:w-1/2 w-full">
            <input
              type="number"
              placeholder="Published Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border p-1 lg:p-4 rounded shadow w-1/2 bg-white"
            />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border p-1 lg:p-4 rounded shadow w-1/2 bg-white"
            >
              <option value="">Language</option>
              <option value="eng">English</option>
              <option value="fre">French</option>
              <option value="spa">Spanish</option>
              <option value="hin">Hindi</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center mt-10">
            <div className="w-12 h-12 border-4 border-dashed border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {(debouncedTitle || debouncedYear || debouncedLanguage) && books.length === 0 && (
              <div className="flex justify-center mt-10">
                <h2 className="text-gray-500 text-lg">No books found ❌</h2>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6">
              {books.slice(0, 40).map((book) => (
                <BookCard
                  key={book.key}
                  title={book.title}
                  author={book.author_name?.[0]}
                  year={book.first_publish_year}
                  language={book.language?.[0]}
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
