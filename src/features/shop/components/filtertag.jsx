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
      className="theme-tag rounded-2xl!"
    >
      {text}
    </Tag>
  );
}

export default FilterTag;
