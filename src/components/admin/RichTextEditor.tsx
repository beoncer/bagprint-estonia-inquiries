
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Bold, Italic, Link, List, ListOrdered, Heading1, Heading2, Heading3 } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label = "Content",
  placeholder = "Write your content here...",
  rows = 10
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = 
      value.substring(0, start) + 
      before + 
      selectedText + 
      after + 
      value.substring(end);
    
    onChange(newText);
    
    // Set cursor position after insertion
    setTimeout(() => {
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const insertHeading = (level: number) => {
    const heading = '#'.repeat(level) + ' ';
    insertText(heading);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      const text = prompt('Enter link text:') || url;
      insertText(`[${text}](${url})`);
    }
  };

  const formatButtons = [
    {
      icon: Heading1,
      label: "Heading 1",
      action: () => insertHeading(1)
    },
    {
      icon: Heading2,
      label: "Heading 2", 
      action: () => insertHeading(2)
    },
    {
      icon: Heading3,
      label: "Heading 3",
      action: () => insertHeading(3)
    },
    {
      icon: Bold,
      label: "Bold",
      action: () => insertText('**', '**')
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertText('*', '*')
    },
    {
      icon: Link,
      label: "Link",
      action: insertLink
    },
    {
      icon: List,
      label: "Bullet List",
      action: () => insertText('- ')
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertText('1. ')
    }
  ];

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border rounded-lg bg-gray-50">
        {formatButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={button.action}
            title={button.label}
            className="h-8 w-8 p-0"
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Text Area */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="font-mono text-sm"
      />

      {/* Markdown Help */}
      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Markdown supported:</strong></p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <span>**bold text**</span>
          <span>*italic text*</span>
          <span># Heading 1</span>
          <span>## Heading 2</span>
          <span>[link text](url)</span>
          <span>- bullet point</span>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
