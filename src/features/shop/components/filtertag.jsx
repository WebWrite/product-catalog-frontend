import { Tag } from "antd";

function FilterTag({ text, onClose }) {
  const handleClose = (e) => {
    e.preventDefault();
    onClose?.();
  };

  return (
    <Tag
      color="#EAEDFF"
      closable
      onClose={handleClose}
      className="rounded-2xl! text-black!"
    >
      {text}
    </Tag>
  );
}

export default FilterTag;
