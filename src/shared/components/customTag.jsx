import { Tag } from "antd";

function CustomTag({ icon, color, text, className }) {
  return (
    <Tag
      variant="outlined"
      className={`font-sans text-black! ${className}`}
      color={color}
      icon={icon}
    >
      {text}
    </Tag>
  );
}

export default CustomTag;
