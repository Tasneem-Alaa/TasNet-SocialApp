import { useEffect, useState } from "react";

export default function TypingWords({
  words,
  speed = 120,
  delay = 1500,
  className = "",
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeout;

    if (!isDeleting && charIndex < currentWord.length) {
      timeout = setTimeout(() => {
        setCharIndex((c) => c + 1);
      }, speed);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setCharIndex((c) => c - 1);
      }, speed / 2);
    } else if (!isDeleting && charIndex === currentWord.length) {
      timeout = setTimeout(() => setIsDeleting(true), delay);
    } else if (isDeleting && charIndex === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      }, 0);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex, words, speed, delay]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      {words[wordIndex].slice(0, charIndex)}
      <span className="ml-0.5 animate-pulse">|</span>
    </span>
  );
}
