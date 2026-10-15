import { Spin } from "antd";

export default function PageLoader() {
    console.log("this page is currenty downloading js code browser ")
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spin size="large" />
    </div>
  );
}