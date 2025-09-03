import React from "react";
const BookCard = ({ title, author, year, language, coverId }) => {
  // OpenLibrary cover image URL
  const coverUrl = coverId
    && `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  return (
      <div className="border rounded-xl flex flex-col p-4 bg-white">
      {coverUrl && (
        <div className="relative w-full h-40 overflow-hidden">
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
          />
        </div>
      )}
      <div className="flex flex-col gap-1 flex-grow">
        {title && (
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {title}
          </h2>
        )}

        {author && (
          <p className="text-sm text-gray-700">by {author}</p>
        )}

        {year && (
          <p className="text-sm text-gray-500">Published: {year}</p>
        )}

        {language && (
          <div className="mt-auto">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow">
              {language.toUpperCase()}
            </span>
          </div>
        )}
      </div>
      </div>
  );
};

export default BookCard;
