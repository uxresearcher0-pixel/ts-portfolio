"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect, useId } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function RichTextEditor({ label, value, onChange }: Props) {
  const id = useId();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" }
      })
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        id,
        role: "textbox",
        "aria-label": label,
        "aria-multiline": "true"
      }
    },
    onUpdate: ({ editor: current }) => onChange(current.isEmpty ? "" : current.getHTML())
  });

  useEffect(() => {
    if (!editor || editor.getHTML() === value) return;
    editor.commands.setContent(value || "", { emitUpdate: false });
  }, [editor, value]);

  if (!editor) return <div className="rich-editor-loading">Loading editor…</div>;

  const setLink = () => {
    const existing = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Enter a web address", existing || "https://");
    if (href === null) return;
    if (!href.trim()) editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run();
  };

  const button = (name: string, labelText: string, active: boolean, action: () => void, disabled = false) => (
    <button type="button" title={labelText} aria-label={labelText} aria-pressed={active} disabled={disabled} onClick={action}>{name}</button>
  );

  return <div className="field field-wide rich-field">
    <label htmlFor={id}>{label}</label>
    <div className="rich-editor">
      <div className="rich-toolbar" role="toolbar" aria-label={`${label} formatting`}>
        {button("P", "Paragraph", editor.isActive("paragraph"), () => editor.chain().focus().setParagraph().run())}
        {button("H2", "Heading level 2", editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
        {button("H3", "Heading level 3", editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run())}
        <span className="toolbar-separator" aria-hidden="true" />
        {button("B", "Bold", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run())}
        {button("I", "Italic", editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run())}
        {button("S", "Strikethrough", editor.isActive("strike"), () => editor.chain().focus().toggleStrike().run())}
        {button("• List", "Bulleted list", editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run())}
        {button("1. List", "Numbered list", editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run())}
        {button("❝", "Block quote", editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run())}
        {button("Link", "Add or edit link", editor.isActive("link"), setLink)}
        {button("Unlink", "Remove link", false, () => editor.chain().focus().unsetLink().run(), !editor.isActive("link"))}
        <span className="toolbar-separator" aria-hidden="true" />
        {button("↶", "Undo", false, () => editor.chain().focus().undo().run(), !editor.can().undo())}
        {button("↷", "Redo", false, () => editor.chain().focus().redo().run(), !editor.can().redo())}
      </div>
      <EditorContent editor={editor} />
    </div>
    <p className="helper">Use headings sparingly. Links open in a new tab on the public portfolio.</p>
  </div>;
}
