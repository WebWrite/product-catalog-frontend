import { Button, Input } from "antd";
import { TfiSearch } from "react-icons/tfi";

function NotFound() {
  return (
    <div className="theme-page min-h-screen">
      <div className="flex justify-center items-center flex-col min-h-screen">
        <h3 className="theme-heading text-xl font-bold font-raleway">404 - Not Found</h3>
        <p className="theme-muted text-center mt-2 font-sans text-xs">
          The page you're looking for doesn't exist.
        </p>
        <p className="mt-0.5 font-sans text-xs">
          Try searching for what you need below.
        </p>
        <div>
          <Input
            className="w-64! mt-4"
            placeholder="Try searching for pages..."
            searchIcon={false}
            prefix={<TfiSearch />}
          />
        </div>
        <p className="theme-muted text-center mt-2 font-raleway text-xs">
          Need help?{" "}
          <Button type="link" className="p-0!">
            Contact support
          </Button>
        </p>
      </div>
    </div>
  );
}

export default NotFound;
