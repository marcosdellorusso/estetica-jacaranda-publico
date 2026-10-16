'use client';

import React from 'react';

type CardPreguntaProps = {
  label: string;
  value: boolean | null;
  onChange: (valor: boolean) => void;
  inputValue?: string;
  onInputChange?: (valor: string) => void;
  placeholder?: string;
  requiredText?: boolean;
};

const CardPregunta: React.FC<CardPreguntaProps> = ({
  label,
  value,
  onChange,
  inputValue,
  onInputChange,
  placeholder,
  requiredText = false,
}) => {
  return (
    <div className="bg-[#f3ecff] border border-[#e3d5fa] p-4 rounded-2xl shadow-md mb-5">
      <label className="font-semibold text-[#7455c3] text-base">{label}</label>
      <div className="flex space-x-4 mt-3">
        <button
          type="button"
          className={`px-5 py-1 rounded-xl font-semibold transition 
            ${value === true ? 'bg-[#ae7bfa] text-white shadow' : 'bg-[#e3d5fa] text-[#7455c3] hover:bg-[#e3d5fa]/80'}
          `}
          onClick={() => onChange(true)}
        >
          Sí
        </button>
        <button
          type="button"
          className={`px-5 py-1 rounded-xl font-semibold transition 
            ${value === false ? 'bg-[#ae7bfa] text-white shadow' : 'bg-[#e3d5fa] text-[#7455c3] hover:bg-[#e3d5fa]/80'}
          `}
          onClick={() => onChange(false)}
        >
          No
        </button>
      </div>
      {value === true && onInputChange && (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={placeholder || '¿Cuál?'}
          className="border border-[#d1c4e9] rounded-xl p-2 w-full mt-3 focus:ring-2 focus:ring-[#ae7bfa] outline-none bg-white text-[#7455c3]"
          required={requiredText}
        />
      )}
    </div>
  );
};

export default CardPregunta;