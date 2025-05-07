"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import { useEffect } from "react";
import EditorNavbar from "./EditorNavbar";

import { mergeAttributes } from "@tiptap/core";

const CustomHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level;
    const classes = {
      1: "font-bold text-2xl leading-tight my-2",
      2: "font-bold text-xl leading-tight my-2",
    };

    const headingLevel = `h${level}`;

    return [
      headingLevel,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: classes[level as 1 | 2] || "",
      }),
      0,
    ];
  },
});

interface TipTapEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

const TipTapEditor = ({
  value = "",
  onChange,
  placeholder = "Start typing...",
}: TipTapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      BulletList.configure({
        HTMLAttributes: { class: "list-disc pl-6 my-2" },
      }),
      OrderedList.configure({
        HTMLAttributes: { class: "list-decimal pl-6 my-2" },
      }),
      ListItem,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CustomHeading.configure({
        levels: [1, 2, 3],
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[150px]",
        placeholder: placeholder,
      },
    },
  });

  // Update content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-col mt-4 min-h-64 border-2 border-gray-300 rounded-lg shadow-sm">
      <EditorNavbar editor={editor} />
      <div className="flex-grow overflow-auto p-4">
        <EditorContent editor={editor} className="min-h-full" />
      </div>
    </div>
  );
};

export default TipTapEditor;
