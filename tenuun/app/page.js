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

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-200 p-5 flex flex-col gap-3">
      <div className="flex justify-center">
        {image && !imgError ? (
          <img
            src={image}
            alt={fullName}
            onError={() => setImgError(true)}
            className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 shadow"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-2xl font-bold text-gray-500 border-4 border-gray-100 shadow">
            {name[0]}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
        {isMongol ? <MglFlag /> : <span>🌍</span>}
        <span>{country}</span>
      </div>

      <div className="flex flex-col gap-0.5">
        <h2 className="text-base font-bold text-gray-900 leading-snug">{fullName}</h2>
        <p className="text-xs text-gray-400 truncate">{student.email}</p>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-semibold">Age:</span> {student.age}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Job:</span>{" "}
          {student.job === "no" || !student.job ? "Student" : student.job}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Height:</span> {student.height} cm
        </p>
      </div>

      {student.items && student.items.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1.5">Items:</p>
          <div className="flex gap-2 flex-wrap">
            {student.items.map((item, i) => {
              const { name: itemName, image: itemImage } = getItemDisplay(item);
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  {itemImage ? (
                    <img
                      src={itemImage}
                      alt={itemName}
                      className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
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

      <button
        onClick={() => onDelete(student.id, student.email)}
        className="mt-auto w-full bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-bold py-2 rounded-xl transition-all duration-150 cursor-pointer"
      >
        Delete
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
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8 tracking-tight">
          Student List
        </h1>

        {list.length === 0 ? (
          <div className="text-center text-gray-400 mt-20 text-lg">No results found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
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
