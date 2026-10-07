import { Carousel } from "antd";
import { FiArrowRight, FiRotateCcw, FiShield, FiTruck } from "react-icons/fi";
import { Link } from "react-router-dom";
import ProductCard from "../../../shared/components/product";
import NavBar from "../components/navbar";

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
          <div className="group relative h-72 w-full overflow-hidden rounded-3xl md:h-[26rem]">
            <img
              src="/src/assets/banner.jpg"
              alt="Banner"
              className="h-full w-full object-cover saturate-105 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center bg-gradient-to-r from-slate-950/80 via-slate-900/35 to-transparent px-8 md:px-14">
              <div className="max-w-md">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                  Curated for you
                </p>
                <h1 className="m-0 text-3xl font-bold text-white md:text-5xl">
                  Find something you’ll love.
                </h1>
                <p className="mt-3 max-w-sm text-sm text-white/80 md:text-base">
                  Discover everyday essentials and standout picks in one place.
                </p>
                <Link
                  to="/"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-900 transition hover:bg-blue-50"
                >
                  Shop now <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>

          <div className="group relative h-72 w-full overflow-hidden rounded-3xl md:h-[26rem]">
            <img
              src="/src/assets/banner.jpg"
              alt="Banner"
              className="h-full w-full object-cover saturate-105 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center bg-gradient-to-r from-slate-950/80 via-slate-900/35 to-transparent px-8 md:px-14">
              <div className="max-w-md">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                  New arrivals
                </p>
                <h2 className="m-0 text-3xl font-bold text-white md:text-5xl">
                  Your next favorite is here.
                </h2>
                <p className="mt-3 text-sm text-white/80 md:text-base">
                  Fresh styles and useful upgrades, all in one scroll.
                </p>
              </div>
            </div>
          </div>

          <div className="group relative h-72 w-full overflow-hidden rounded-3xl md:h-[26rem]">
            <img
              src="/src/assets/banner.jpg"
              alt="Banner"
              className="h-full w-full object-cover saturate-105 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center bg-gradient-to-r from-slate-950/80 via-slate-900/35 to-transparent px-8 md:px-14">
              <div className="max-w-md">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                  Shop with confidence
                </p>
                <h2 className="m-0 text-3xl font-bold text-white md:text-5xl">
                  Quality picks, made simple.
                </h2>
              </div>
            </div>
          </div>

          <div className="group relative h-72 w-full overflow-hidden rounded-3xl md:h-[26rem]">
            <img
              src="/src/assets/banner.jpg"
              alt="Banner"
              className="h-full w-full object-cover saturate-105 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center bg-gradient-to-r from-slate-950/80 via-slate-900/35 to-transparent px-8 md:px-14">
              <div className="max-w-md">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                  Made for every day
                </p>
                <h2 className="m-0 text-3xl font-bold text-white md:text-5xl">
                  Little upgrades, big difference.
                </h2>
              </div>
            </div>
          </div>
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
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="theme-accent mb-1 text-xs font-bold uppercase tracking-[0.2em]">
                Featured collection
              </p>
              <h2 className="theme-heading m-0 text-2xl font-bold md:text-3xl">
                Popular right now
              </h2>
            </div>
            <div className="flex shrink-0 gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Explore collection <FiArrowRight />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
