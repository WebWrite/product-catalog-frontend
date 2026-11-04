import { Button, Tooltip, Dropdown, Divider, Space } from "antd";
import {
  BsAlignCenter,
  BsChevronDown,
  BsCode,
  BsList,
  BsQuote,
} from "react-icons/bs";
import { CiAlignLeft, CiAlignRight } from "react-icons/ci";
import { FaBold, FaItalic, FaMinus, FaUnderline } from "react-icons/fa";
import { GrStrikeThrough } from "react-icons/gr";
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuListOrdered,
  LuRedo2,
  LuUndo2,
} from "react-icons/lu";

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  children,
  label,
}) {
  return (
    <Tooltip title={label}>
      <Button
        type={active ? "primary" : "text"}
        size="small"
        disabled={disabled}
        onClick={onClick}
        className="flex! h-8! w-8! items-center! justify-center! p-0!"
      >
        {children}
      </Button>
    </Tooltip>
  );
}

function EditorToolbar({ editor }) {
  if (!editor) return null;

  const headingItems = [
    {
      key: "paragraph",
      label: "Paragraph",
      onClick: () => editor.chain().focus().setParagraph().run(),
    },
    {
      key: "h1",
      label: (
        <Space>
          <LuHeading1 size={16} />
          Heading 1
        </Space>
      ),
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      key: "h2",
      label: (
        <Space>
          <LuHeading2 size={16} />
          Heading 2
        </Space>
      ),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      key: "h3",
      label: (
        <Space>
          <LuHeading3 size={16} />
          Heading 3
        </Space>
      ),
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
  ];

  const handleHeadingClick = ({ key }) => {
    const item = headingItems.find((item) => item.key === key);
    item?.onClick();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b bg-white px-2 py-1.5">
      <ToolbarButton
        label="Undo"
        onClick={() => editor.chain().focus().undo().run()}
      >
        <LuUndo2 size={16} />
      </ToolbarButton>

      <ToolbarButton
        label="Redo"
        onClick={() => editor.chain().focus().redo().run()}
      >
        <LuRedo2 size={16} />
      </ToolbarButton>

      <Divider type="vertical" className="mx-1! h-6!" />

      <Dropdown
        menu={{
          items: headingItems.map(({ key, label }) => ({
            key,
            label,
          })),
          onClick: handleHeadingClick,
        }}
        trigger={["click"]}
        placement="bottomLeft"
      >
        <Button
          type="text"
          size="small"
          className="flex! h-8! items-center! gap-1!"
        >
          <LuHeading1 size={16} />
          <span className="hidden sm:inline">Heading</span>
          <BsChevronDown size={14} />
        </Button>
      </Dropdown>

      <Divider type="vertical" className="mx-1! h-6!" />

      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FaBold size={16} />
      </ToolbarButton>

      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FaItalic size={16} />
      </ToolbarButton>

      <ToolbarButton
        label="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <FaUnderline size={16} />
      </ToolbarButton>

      <ToolbarButton
        label="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <GrStrikeThrough size={16} />
      </ToolbarButton>

      <ToolbarButton
        label="Inline code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <BsCode size={16} />
      </ToolbarButton>

      <Divider type="vertical" className="mx-1! h-6!" />

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <BsList size={16} />
      </ToolbarButton>

      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <LuListOrdered size={16} />
      </ToolbarButton>

      <ToolbarButton
        label="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <BsQuote size={16} />
      </ToolbarButton>

      <Divider type="vertical" className="mx-1! h-6!" />

      <ToolbarButton
        label="Align left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <CiAlignLeft size={16} />
      </ToolbarButton>

      <ToolbarButton
        label="Align center"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <BsAlignCenter size={16} />
      </ToolbarButton>

      <ToolbarButton
        label="Align right"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <CiAlignRight size={16} />
      </ToolbarButton>

      <Divider type="vertical" className="mx-1! h-6!" />

      <ToolbarButton
        label="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <FaMinus size={16} />
      </ToolbarButton>
    </div>
  );
}
export default EditorToolbar;
