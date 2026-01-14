export function toProperCase(str) {
  if (!str) return "";

  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      // Handle hyphenated names: dela-cruz
      return word
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("-");
    })
    .join(" ");
}
