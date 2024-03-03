export const colorizeText = (text: string): JSX.Element[] => {
  const CHAR_CODE_0 = 48;
  const CHAR_CODE_9 = 57;

  return text.split('').map((val, index) => {
    const isNumber = val.charCodeAt(0) >= CHAR_CODE_0 && val.charCodeAt(0) <= CHAR_CODE_9;

    return isNumber ? (
      <span key={index} className="text-orange-600 font-extrabold">
        {val}
      </span>
    ) : (
      <span key={index} className="text-indigo-600 font-extrabold">
        {val}
      </span>
    );
  });
}