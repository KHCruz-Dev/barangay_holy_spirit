const getAvailableIdTypes = (currentIndex) => {
  const selectedTypes = identificationCards
    .filter((_, i) => i !== currentIndex)
    .map((row) => row.idType)
    .filter(Boolean);

  return ID_TYPE_OPTIONS.filter((opt) => !selectedTypes.includes(opt.value));
};

const addIdentificationRow = () => {
  setIdentificationCards((prev) => [...prev, { idType: "", idNumber: "" }]);
};

const removeIdentificationRow = (index) => {
  setIdentificationCards((prev) => prev.filter((_, i) => i !== index));
};

const updateIdentificationRow = (index, field, value) => {
  setIdentificationCards((prev) =>
    prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
  );
};
