import { Carousel } from "antd";
import ProductCard from "../../../shared/components/product";
import NavBar from "../components/navbar";

function LandingPage() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="w-full p-10">
        <Carousel
          arrows
          autoplay={{ dotDuration: true }}
          autoplaySpeed={5000}
          className="w-full"
        >
          <div className="h-64 w-full overflow-hidden rounded-2xl">
            <img
              src="/src/assets/banner.jpg"
              alt="Banner"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="h-64 w-full overflow-hidden rounded-2xl">
            <img
              src="/src/assets/banner.jpg"
              alt="Banner"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="h-64 w-full overflow-hidden rounded-2xl">
            <img
              src="/src/assets/banner.jpg"
              alt="Banner"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="h-64 w-full overflow-hidden rounded-2xl">
            <img
              src="/src/assets/banner.jpg"
              alt="Banner"
              className="h-full w-full object-cover"
            />
          </div>
        </Carousel>

        <div className="grid grid-cols-2  my-14 md:grid-cols-3 lg:grid-cols-4 gap-x-16 gap-y-10">
          <ProductCard />
          <ProductCard image="https://int.stylo.pk/cdn/shop/files/AT7482-02.png?v=1767854323" />
          <ProductCard image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS25i-Q4HGofsn7uQSemI3y5cuRLo5F61i0TwpT4MIL-OUoxhr1SHrh3Blz&s=10" />

          <ProductCard />
          <ProductCard image="https://int.stylo.pk/cdn/shop/files/AT7482-02.png?v=1767854323" />
          <ProductCard image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS25i-Q4HGofsn7uQSemI3y5cuRLo5F61i0TwpT4MIL-OUoxhr1SHrh3Blz&s=10" />

          <ProductCard />
          <ProductCard image="https://int.stylo.pk/cdn/shop/files/AT7482-02.png?v=1767854323" />
          <ProductCard image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS25i-Q4HGofsn7uQSemI3y5cuRLo5F61i0TwpT4MIL-OUoxhr1SHrh3Blz&s=10" />

          <ProductCard />
          <ProductCard image="https://int.stylo.pk/cdn/shop/files/AT7482-02.png?v=1767854323" />
          <ProductCard image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS25i-Q4HGofsn7uQSemI3y5cuRLo5F61i0TwpT4MIL-OUoxhr1SHrh3Blz&s=10" />

          <ProductCard />
          <ProductCard image="https://int.stylo.pk/cdn/shop/files/AT7482-02.png?v=1767854323" />
          <ProductCard image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS25i-Q4HGofsn7uQSemI3y5cuRLo5F61i0TwpT4MIL-OUoxhr1SHrh3Blz&s=10" />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
