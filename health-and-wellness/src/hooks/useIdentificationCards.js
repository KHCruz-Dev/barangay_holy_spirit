import { useState } from "react";

export const useIdentificationCards = () => {
  const [cards, setCards] = useState([{ idTypeId: null, idNumber: "" }]);

  const addRow = () =>
    setCards((prev) => [...prev, { idTypeId: null, idNumber: "" }]);

  const removeRow = (index) =>
    setCards((prev) => prev.filter((_, i) => i !== index));

  const updateRow = (index, field, value) =>
    setCards((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );

  return { cards, setCards, addRow, removeRow, updateRow };
};
