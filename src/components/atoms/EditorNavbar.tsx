"use client";
import { Editor } from "@tiptap/react";

const EditorNavbar = ({ editor }: { editor: Editor }) => {
  if (!editor) return null;

  return (
    <div className="bg-gray-700 shadow-lg border-b rounded-t-lg border-gray-700">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center flex-wrap gap-1 py-2">
          <div className="flex items-center space-x-1 mr-4">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded text-white transition-colors ${
                editor.isActive("bold") ? "bg-blue-600" : "hover:bg-gray-500"
              }`}
              title="Bold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded text-white transition-colors ${
                editor.isActive("italic") ? "bg-blue-600" : "hover:bg-gray-500"
              }`}
              title="Italic"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded text-white transition-colors ${
                editor.isActive("underline")
                  ? "bg-blue-600"
                  : "hover:bg-gray-500"
              }`}
              title="Underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-1 mr-4">
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`p-2 rounded text-white transition-colors ${
                editor.isActive("heading", { level: 1 })
                  ? "bg-blue-600"
                  : "hover:bg-gray-500"
              }`}
              title="Heading 1"
            >
              <span className="font-bold">H1</span>
            </button>
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`p-2 rounded text-white transition-colors ${
                editor.isActive("heading", { level: 2 })
                  ? "bg-blue-600"
                  : "hover:bg-gray-500"
              }`}
              title="Heading 2"
            >
              <span className="font-bold">H2</span>
            </button>
          </div>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded text-white transition-colors ${
                editor.isActive("bulletList")
                  ? "bg-blue-600"
                  : "hover:bg-gray-500"
              }`}
              title="Bullet List"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16M2 6h.01M2 12h.01M2 18h.01"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded text-white transition-colors ${
                editor.isActive("orderedList")
                  ? "bg-blue-600"
                  : "hover:bg-gray-500"
              }`}
              title="Numbered List"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 7h12M7 12h12M7 17h12M3 7h.01M3 12h.01M3 17h.01"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorNavbar;
