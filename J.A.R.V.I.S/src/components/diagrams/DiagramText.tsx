import { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface DiagramTextProps {
  text: string;
  onTextChange: (text: string) => void;
  width: number;
  height: number;
}

export function DiagramText({ text, onTextChange }: DiagramTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditText(text);
  }, [text]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    onTextChange(editText);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onTextChange(editText);
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setEditText(text);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <textarea
        ref={inputRef}
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full h-full bg-transparent border-none outline-none resize-none text-center p-2 text-white"
        style={{ fontSize: '14px', fontFamily: 'inherit', fontWeight: 600 }}
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className="w-full h-full flex items-center justify-center p-2 cursor-text text-white text-center"
      style={{ fontSize: '14px', minHeight: '20px', fontWeight: 600 }}
    >
      {text || <span className="text-white/50">Click to edit</span>}
    </div>
  );
}

