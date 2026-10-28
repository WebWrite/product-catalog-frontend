import { useRef, useState } from "react";
import { Button, Input } from "antd";
import { MdAttachFile, MdOutlineSend, MdClose } from "react-icons/md";

function ChatInput({
  onSend,
  disabled = false,
  loading = false,
  placeholder = "Write message...",
}) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const fileRef = useRef(null);

  const canSend = (text.trim() || files.length > 0) && !disabled && !loading;

  const handleSend = () => {
    if (!canSend) return;
    onSend?.({ text: text.trim(), files });
    setText("");
    setFiles([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFiles = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    e.target.value = "";
  };

  const removeFile = (index) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="rounded-xl bg-indigo-50/70 p-3 ring-1 ring-indigo-100">
        <Input.TextArea
          variant="borderless"
          style={{ boxShadow: "none", outline: "none" }}
          autoSize={{ minRows: 2, maxRows: 6 }}
          placeholder={placeholder}
          value={text}
          disabled={disabled}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="resize-none! bg-transparent! p-0! text-sm!"
        />

        {files.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {files.map((file, i) => (
              <span
                key={`${file.name}-${i}`}
                className="flex max-w-48 items-center gap-1.5 rounded-lg bg-white px-2 py-1 text-[11px] text-slate-700 ring-1 ring-indigo-100"
              >
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => removeFile(i)}
                  className="flex cursor-pointer text-slate-400 hover:text-red-500"
                >
                  <MdClose />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            aria-label="Attach file"
            disabled={disabled}
            onClick={() => fileRef.current?.click()}
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-xl text-slate-600 transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MdAttachFile />
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            hidden
            onChange={handleFiles}
          />

          <Button
            type="primary"
            size="large"
            disabled={!canSend}
            loading={loading}
            icon={<MdOutlineSend />}
            iconPosition="end"
            onClick={handleSend}
            className="bg-indigo-800! text-white! px-5! text-sm! font-semibold! hover:bg-indigo-900! disabled:opacity-60!"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
