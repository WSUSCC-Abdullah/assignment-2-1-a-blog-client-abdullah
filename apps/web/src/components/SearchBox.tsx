import React from "react";

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      type="text"
      placeholder="Search posts..."
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
    />
  );
}