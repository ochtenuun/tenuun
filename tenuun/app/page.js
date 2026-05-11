"use client";

import { useState } from "react";
const data = require("./utils/id.json");

function MglFlag() {
  return (
    <svg width="20" height="13" viewBox="0 0 22 14" className="inline-block rounded-sm">
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

  return (
    <div className="bg-white rounded-3xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 p-5 flex flex-col gap-4 group">
      {/* Avatar + country badge */}
      <div className="flex flex-col items-center gap-2">
        {image && !imgError ? (
          <img
            src={image}
            alt={fullName}
            onError={() => setImgError(true)}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-gray-100 group-hover:ring-blue-100 transition-all"
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-2xl font-bold text-indigo-500 ring-4 ring-gray-100 group-hover:ring-blue-100 transition-all">
            {name[0]}
          </div>
        )}

        <span className="flex items-center gap-1 bg-gray-100 text-gray-500 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
          {isMongol ? <MglFlag /> : "🌍"} {country}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col items-center text-center gap-0.5">
        <h2 className="text-sm font-bold text-gray-900">{fullName}</h2>
        <p className="text-[11px] text-gray-400 truncate w-full">{student.email}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 bg-gray-50 rounded-2xl text-center py-2">
        <div className="flex flex-col px-1">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">Age</span>
          <span className="text-sm font-bold text-gray-700">{student.age}</span>
        </div>
        <div className="flex flex-col px-1">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">Height</span>
          <span className="text-sm font-bold text-gray-700">{student.height}</span>
        </div>
        <div className="flex flex-col px-1">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">Job</span>
          <span className="text-[11px] font-semibold text-gray-700 truncate px-1">
            {student.job === "no" || !student.job ? "—" : student.job}
          </span>
        </div>
      </div>

      {/* Items */}
      {student.items && student.items.length > 0 && (
        <div className="flex gap-2 flex-wrap justify-center">
          {student.items.map((item, i) => {
            const { name: itemName, image: itemImage } = getItemDisplay(item);
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                {itemImage ? (
                  <img
                    src={itemImage}
                    alt={itemName}
                    className="w-9 h-9 object-cover rounded-xl border border-gray-100"
                  />
                ) : (
                  <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-base">
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
      )}

      {/* Delete */}
      <button
        onClick={() => onDelete(student.id, student.email)}
        className="mt-auto w-full bg-red-50 hover:bg-red-500 text-red-400 hover:text-white text-xs font-bold py-2 rounded-2xl transition-all duration-200 cursor-pointer border border-red-100 hover:border-red-500 active:scale-95"
      >
        Remove
      </button>
    </div>
  );
}

export default function Page() {
  const [list, setList] = useState(data);

  const handleDelete = (id, email) => {
    setList((prev) => prev.filter((s) => !(s.id === id && s.email === email)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            🎓 Students
          </h1>
          <p className="text-gray-400 text-sm mt-1">{list.length} people enrolled</p>
        </div>

        {list.length === 0 ? (
          <div className="text-center text-gray-400 mt-20 text-lg">No students found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {list.map((student, index) => (
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
