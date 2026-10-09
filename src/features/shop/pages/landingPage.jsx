import { Carousel } from "antd";
import { FiArrowRight, FiRotateCcw, FiShield, FiTruck } from "react-icons/fi";
import { Link } from "react-router-dom";
import ProductCard from "../../../shared/components/product";
import NavBar from "../components/navbar";
import CarouselItem from "../components/carouselItem";

function LandingPage() {
  return (
    <div className="landing-page min-h-screen">
      <NavBar />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Carousel
          arrows
          autoplay={{ dotDuration: true }}
          autoplaySpeed={5000}
          className="w-full overflow-hidden rounded-3xl shadow-[0_18px_45px_rgba(37,99,235,0.14)]"
        >
          <CarouselItem
            img={
              "https://res.cloudinary.com/drawup2ef/image/upload/v1791530573/banner.jpg"
            }
          />
          <CarouselItem
            img={
              "https://res.cloudinary.com/drawup2ef/image/upload/v1791530573/banner.jpg"
            }
          />
          <CarouselItem
            img={
              "https://res.cloudinary.com/drawup2ef/image/upload/v1791530573/banner.jpg"
            }
          />
          <CarouselItem
            img={
              "https://res.cloudinary.com/drawup2ef/image/upload/v1791530573/banner.jpg"
            }
          />
        </Carousel>

        <section className="theme-panel mt-5 grid grid-cols-1 divide-y rounded-2xl border p-1 shadow-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex items-center gap-3 px-4 py-3">
            <FiTruck className="theme-accent size-5 shrink-0" />
            <div>
              <p className="theme-heading m-0 text-xs font-bold">
                Reliable delivery
              </p>
              <p className="theme-muted m-0 text-xs">Straight to your door</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <FiShield className="theme-accent size-5 shrink-0" />
            <div>
              <p className="theme-heading m-0 text-xs font-bold">
                Secure checkout
              </p>
              <p className="theme-muted m-0 text-xs">Shop with confidence</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <FiRotateCcw className="theme-accent size-5 shrink-0" />
            <div>
              <p className="theme-heading m-0 text-xs font-bold">
                Easy returns
              </p>
              <p className="theme-muted m-0 text-xs">
                Simple, stress-free shopping
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-7 flex flex-col sm:flex-row  sm:items-end justify-between gap-4">
            <div>
              <p className="theme-accent mb-1 text-xs font-bold uppercase tracking-[0.2em]">
                Featured collection
              </p>
              <h2 className="theme-heading m-0 text-2xl font-bold md:text-3xl">
                Popular right now
              </h2>
            </div>
            <div className="flex shrink-0 gap-3 justify-end">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Explore collection <FiArrowRight />
              </Link>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {" "}
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
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
