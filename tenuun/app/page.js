"use client";

import { useState } from "react";
const data = require("./utils/id.json");

function MglFlag() {
  return (
    <svg width="22" height="14" viewBox="0 0 22 14" className="inline-block rounded-sm shadow-sm">
      <rect width="22" height="14" fill="#C4272F" />
      <rect x="7" width="8" height="14" fill="#003893" />
    </svg>
  );
}

function getItemDisplay(item) {
  if (typeof item !== "string") return { name: "Item", image: null };
  if (item.startsWith("http")) return { name: "Item", image: item };
  const urlIndex = item.indexOf("http");
  if (urlIndex > 0) {
    return { name: item.slice(0, urlIndex), image: item.slice(urlIndex) };
  }
  return { name: item, image: null };
}

function StudentCard({ student, onDelete }) {
  const [imgError, setImgError] = useState(false);

  const image = student.image || student.imgae || null;
  const name =
    student.firstname !== "idk"
      ? student.firstname.charAt(0).toUpperCase() + student.firstname.slice(1)
      : "Unknown";
  const lastName =
    student.lastname !== "idk"
      ? " " + student.lastname.charAt(0).toUpperCase() + student.lastname.slice(1)
      : "";
  const fullName = name + lastName;
  const country = student.country === "mongol" ? "MGL" : student.country.toUpperCase();
  const isMongol = student.country === "mongol";

  const colors = [
    "from-blue-400 to-indigo-500",
    "from-rose-400 to-pink-500",
    "from-emerald-400 to-teal-500",
    "from-amber-400 to-orange-500",
    "from-violet-400 to-purple-500",
  ];
  const colorClass = colors[(fullName.charCodeAt(0) || 0) % colors.length];

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 p-4 sm:p-5 flex flex-col gap-3 w-full">
      
      {/* Avatar */}
      <div className="flex justify-center pt-1">
        <div className="relative">
          {image && !imgError ? (
            <div className="w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-2 ring-offset-2 ring-gray-200">
              <img
                src={image}
                alt={fullName}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-top"
              />
            </div>
          ) : (
            <div className={`w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-2xl font-bold text-white ring-2 ring-offset-2 ring-gray-200`}>
              {name[0]}
            </div>
          )}
        </div>
      </div>

      {/* Country badge */}
      <div className="flex justify-center">
        <span className="flex items-center gap-1 bg-gray-100 text-gray-500 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
          {isMongol ? <MglFlag /> : <span>🌍</span>}
          {country}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 text-center">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">{fullName}</h2>
        <p className="text-[11px] sm:text-xs text-gray-400 truncate">{student.email}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 text-center">
        <div className="flex flex-col py-2 px-1 border-r border-gray-100">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">Age</span>
          <span className="text-sm font-bold text-gray-700">{student.age}</span>
        </div>
        <div className="flex flex-col py-2 px-1 border-r border-gray-100">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">cm</span>
          <span className="text-sm font-bold text-gray-700">{student.height}</span>
        </div>
        <div className="flex flex-col py-2 px-1">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">Job</span>
          <span className="text-[11px] font-semibold text-gray-700 truncate px-1">
            {student.job === "no" || !student.job ? "—" : student.job}
          </span>
        </div>
      </div>

      {/* Items */}
      {student.items && student.items.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Items</p>
          <div className="flex gap-2 flex-wrap">
            {student.items.map((item, i) => {
              const { name: itemName, image: itemImage } = getItemDisplay(item);
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  {itemImage ? (
                    <img
                      src={itemImage}
                      alt={itemName}
                      className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded-xl border border-gray-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-xl flex items-center justify-center text-base sm:text-lg">
                      🖱️
                    </div>
                  )}
                  {itemName && itemName !== "Item" && (
                    <span className="text-[10px] text-gray-400 capitalize">{itemName}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete button */}
      <button
        onClick={() => onDelete(student.id, student.email)}
        className="mt-auto w-full bg-red-50 hover:bg-red-500 border border-red-100 hover:border-red-500 text-red-400 hover:text-white text-xs sm:text-sm font-bold py-2 rounded-xl transition-all duration-200 cursor-pointer active:scale-95"
      >
        Delete
      </button>
    </div>
  );
}

export default function Page() {
  const [search, setSearch] = useState("");
  const [list, setList] = useState(data);

  const filtered = list.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.firstname.toLowerCase().includes(q) ||
      s.lastname.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.job.toLowerCase().includes(q)
    );
  });

  const handleDelete = (id, email) => {
    setList((prev) => prev.filter((s) => !(s.id === id && s.email === email)));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-bold text-center text-gray-900 mb-5 sm:mb-8 tracking-tight">
          Student List
        </h1>

        {/* Search */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xl border-2 border-blue-300 focus:border-blue-500 outline-none rounded-xl px-4 py-2 sm:py-2.5 text-gray-700 bg-white shadow-sm text-sm transition-colors"
          />
        </div>

        {/* Count */}
        <p className="text-center text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
          Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of{" "}
          <span className="font-semibold text-gray-600">{list.length}</span> people
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 mt-20 text-lg">No results found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
            {filtered.map((student, index) => (
              <StudentCard
                key={`${student.id}-${student.email}-${index}`}
                student={student}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}