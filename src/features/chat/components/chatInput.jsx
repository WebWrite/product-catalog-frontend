import { useRef, useState } from "react";
import { Button, Input } from "antd";
import imageCompression from "browser-image-compression";
import { MdAttachFile, MdOutlineSend, MdClose } from "react-icons/md";

function ChatInput({
  onSend,
  disabled = false,
  loading = false,
  placeholder = "Write message...",
  onTyping,
}) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [imageError, setImageError] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const fileRef = useRef(null);

  const canSend =
    Boolean(text.trim() || files.length > 0) &&
    !disabled &&
    !loading &&
    !isCompressing;

  const handleFiles = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    setImageError("");

    if (!allowedTypes.includes(file.type)) {
      setImageError("Only JPG, PNG, and WEBP images are allowed.");
      return;
    }

    if (file.size > maxSize) {
      setImageError("Image must be 5 MB or smaller.");
      return;
    }

    setIsCompressing(true);

    try {
      const blob = await imageCompression(file, {
        maxSizeMB: 5,
        maxWidthOrHeight: 1280,
        initialQuality: 0.78,
        fileType: "image/webp",
        useWebWorker: true,
      });

      if (blob.type !== "image/webp" || blob.size > maxSize) {
        setImageError("Could not prepare the image. Please try another image.");
        return;
      }

      const compressedFile = new File(
        [blob],
        `${file.name.replace(/\.[^/.]+$/, "")}.webp`,
        {
          type: "image/webp",
          lastModified: file.lastModified,
        },
      );

      setFiles([compressedFile]);
    } catch (error) {
      console.error("Image compression failed:", error);
      setImageError("Image compression failed. Please try another image.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSend = async () => {
    if (!canSend) return;

    try {
      await onSend?.({ text: text.trim(), files });
      setText("");
      setFiles([]);
      setImageError("");
    } catch {}
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setImageError("");
  };

  return (
    <div className="theme-surface bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="theme-input rounded-xl bg-indigo-50/70 p-3 ring-1 ring-indigo-100">
        <Input.TextArea
          variant="borderless"
          style={{ boxShadow: "none", outline: "none" }}
          autoSize={{ minRows: 2, maxRows: 6 }}
          placeholder={placeholder}
          value={text}
          disabled={disabled}
          onChange={(e) => {
            setText(e.target.value);
            onTyping?.();
          }}
          onKeyDown={handleKeyDown}
          className="resize-none! bg-transparent! p-0! text-sm!"
        />

        {files.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {files.map((file, i) => (
              <span
                key={`${file.name}-${i}`}
                className="theme-surface flex max-w-48 items-center gap-1.5 rounded-lg bg-white px-2 py-1 text-[11px] text-slate-700 ring-1 ring-indigo-100"
              >
                <span className="truncate">{file.name}</span>

                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  disabled={isCompressing}
                  onClick={() => removeFile(i)}
                  className="flex cursor-pointer text-slate-400 hover:text-red-500"
                >
                  <MdClose />
                </button>
              </span>
            ))}
          </div>
        )}

        {imageError && (
          <p className="mt-2 text-xs text-red-500" role="alert">
            {imageError}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            aria-label="Attach image"
            disabled={disabled || isCompressing}
            onClick={() => fileRef.current?.click()}
            className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-xl text-slate-600 transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MdAttachFile />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={handleFiles}
          />

          <Button
            type="primary"
            size="large"
            disabled={!canSend}
            loading={loading || isCompressing}
            icon={<MdOutlineSend />}
            iconPlacement="end"
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
