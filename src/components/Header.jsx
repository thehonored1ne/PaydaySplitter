const Header = () => {
  return (
    <header className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <h1 className="flex flex-wrap items-center gap-x-2 text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter text-black uppercase leading-[1.1]">
            <span>Payday</span>
            <span className="bg-[#fbe334] px-2 neo-border inline-block">Splitter</span>
          </h1>
          <p className="text-xs md:text-lg font-bold text-black max-w-lg border-l-4 border-black pl-4 leading-relaxed">
            Financial automation for the modern era. Based on 2025 PH statutory rules.
          </p>
        </div>
        
      </div>
    </header>
  );
};

export default Header;