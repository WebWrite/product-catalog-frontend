import { Button } from "antd";

function CustomButton({ icon, className, type, text, onClick }) {
  return (
    <Button
      className={`${className}`}
      type={type}
      onClick={onClick}
      icon={icon}
    >
      {text}
    </Button>
  );
}

export default CustomButton;
