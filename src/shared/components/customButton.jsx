import { Button } from "antd";

function CustomButton({ icon, className, type, text }) {
  return (
    <Button className={`${className}`} type={type} icon={icon}>
      {text}
    </Button>
  );
}

export default CustomButton;
