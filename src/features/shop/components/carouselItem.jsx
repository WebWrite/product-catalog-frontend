function CarouselItem({ img }) {
  return (
    <div className="group relative h-72 w-full overflow-hidden rounded-3xl md:h-[26rem]">
      <img
        src={img}
        alt="Banner"
        className="h-full w-full object-cover saturate-105 transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex items-center bg-gradient-to-r from-slate-950/30 via-slate-900/30 to-transparent px-8 md:px-14"></div>
    </div>
  );
}

export default CarouselItem;
