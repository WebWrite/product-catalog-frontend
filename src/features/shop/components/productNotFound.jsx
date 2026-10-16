import { Button, Result } from "antd";
import { Link } from "react-router-dom";

function ProductNotFound() {
  return (
    <Result
      status="404"
      title="Product not found"
      subTitle="This product may have been removed or is unavailable."
      extra={
        <Link to="/shop">
          <Button type="primary">Back to shop</Button>
        </Link>
      }
    />
  );
}

export default ProductNotFound;
