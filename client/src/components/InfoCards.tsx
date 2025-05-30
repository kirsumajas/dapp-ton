export default function InfoCards() {
  return (
    <div className="overflow-x-auto px-3 pb-6">
      <div className="flex gap-4 min-w-max">
        {/* Card 1: Tokenomics */}
        <div className="min-w-[280px] min-h-[320px] bg-[#2e2c33] rounded-xl p-4 text-white flex flex-col justify-between">
          <h3 className="font-bold mb-2">Chopa tokenomics</h3>
          <img
            src="/assets/infocards/tokenomics.png"
            alt="Tokenomics"
            className="rounded object-contain"
          />
        </div>

        {/* Card 2: Who is Chopa */}
        <div className="min-w-[280px] min-h-[320px] bg-[#2e2c33] rounded-xl p-4 text-white flex flex-col justify-between">
          <div>
            <h3 className="font-bold mb-2">Who is Chopa</h3>
            <p className="text-sm text-white/70 mb-2">
              Chekhovsky Choppa is a fictional hoppa character...
            </p>
          </div>
          <img
            src="/assets/infocards/whoischoppa.png"
            alt="Who is Chopa"
            className="rounded object-contain"
          />
        </div>

        {/* Card 3: Strategy */}
        <div className="min-w-[280px] min-h-[320px] bg-[#2e2c33] rounded-xl p-4 text-white flex flex-col justify-between">
          <h3 className="font-bold mb-2">Chopa strategy</h3>
          <img
            src="/assets/infocards/strategy.png"
            alt="Strategy"
            className="rounded object-contain mb-2"
          />
          <p className="text-sm text-white/70">Chekhovsky Choppa is a fictional...</p>
        </div>
      </div>
    </div>
  );
}
