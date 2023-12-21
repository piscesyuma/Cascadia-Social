export function shortenString(string: string, length: number): string {
  if (!string) return "";
  if (string.length <= length) return string;
  return (
    string.slice(0, length) +
    "..." +
    string.slice(string.length - length, string.length)
  );
}
