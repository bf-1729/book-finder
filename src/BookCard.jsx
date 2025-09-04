import React from "react";

const BookCard = ({ title, author, year, language, coverId }) => {
  const coverUrl = coverId && `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;

  return (
    <div className="group p-3 relative flex flex-col rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:-translate-y-1">
      {/* Cover */}
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 text-xs italic">
          No Cover
        </div>
      )}

      {/* Info */}
      <div className="p-3 flex flex-col flex-grow">
        {title && (
          <h2 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition">
            {title}
          </h2>
        )}
        {author && <p className="text-xs text-gray-700 mt-1">👤 {author}</p>}
        {year && <p className="text-xs text-gray-500 mt-1">📅 {year}</p>}

        {/* Languages */}
        {language && (
          <div className="mt-2 flex flex-wrap gap-1">
            {language.map((lang, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[10px] font-medium bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200"
              >
                {lang.toUpperCase()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
