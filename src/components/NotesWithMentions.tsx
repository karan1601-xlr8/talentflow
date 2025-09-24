import React, { useState, useRef, useEffect } from "react";

interface MentionUser {
  id: string;
  name: string;
  email: string;
}

interface NotesWithMentionsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

const NotesWithMentions: React.FC<NotesWithMentionsProps> = ({
  value,
  onChange,
  placeholder = "Add a note...",
  rows = 3,
  className = "",
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<MentionUser[]>([]);
  const [mentionStart, setMentionStart] = useState(-1);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Mock users for mentions - in a real app, this would come from props or API
  const mentionUsers: MentionUser[] = [
    { id: "1", name: "John Smith", email: "john@company.com" },
    { id: "2", name: "Sarah Johnson", email: "sarah@company.com" },
    { id: "3", name: "Mike Wilson", email: "mike@company.com" },
    { id: "4", name: "Emily Davis", email: "emily@company.com" },
    { id: "5", name: "David Brown", email: "david@company.com" },
  ];

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const cursorPos = e.target.selectionStart;

    onChange(text);

    // Check for @ mention
    const textBeforeCursor = text.substring(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase();
      const filteredUsers = mentionUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );

      setSuggestions(filteredUsers);
      setMentionStart(cursorPos - mentionMatch[0].length);
      setShowSuggestions(true);
      setSelectedSuggestion(0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestion((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestion((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
      case "Tab":
        e.preventDefault();
        if (suggestions[selectedSuggestion]) {
          insertMention(suggestions[selectedSuggestion]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  const insertMention = (user: MentionUser) => {
    if (!textareaRef.current) return;

    const text = value;
    const beforeMention = text.substring(0, mentionStart);
    const afterMention = text.substring(textareaRef.current.selectionStart);
    const mentionText = `@${user.name}`;

    const newText = beforeMention + mentionText + " " + afterMention;
    onChange(newText);

    setShowSuggestions(false);

    // Focus back to textarea and position cursor after mention
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = beforeMention.length + mentionText.length + 1;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleSuggestionClick = (user: MentionUser) => {
    insertMention(user);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderTextWithMentions = (text: string) => {
    const parts = text.split(/(@\w+)/g);

    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        const userName = part.substring(1);
        const user = mentionUsers.find((u) => u.name === userName);
        if (user) {
          return (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-1 rounded text-sm font-medium"
            >
              {part}
            </span>
          );
        }
      }
      return part;
    });
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${className}`}
      />

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto"
        >
          {suggestions.map((user, index) => (
            <div
              key={user.id}
              onClick={() => handleSuggestionClick(user)}
              className={`px-3 py-2 cursor-pointer text-sm ${
                index === selectedSuggestion
                  ? "bg-emerald-50 text-emerald-700"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="font-medium">{user.name}</div>
              <div className="text-gray-500 text-xs">{user.email}</div>
            </div>
          ))}
        </div>
      )}

      {value && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
          <div className="text-gray-600 mb-1">Preview:</div>
          <div className="text-gray-900">{renderTextWithMentions(value)}</div>
        </div>
      )}
    </div>
  );
};

export default NotesWithMentions;
