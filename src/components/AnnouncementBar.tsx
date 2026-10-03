interface AnnouncementBarProps {
  onClaimOffer: () => void;
}

export function AnnouncementBar({ onClaimOffer }: AnnouncementBarProps) {
  return (
    <aside aria-label="Aviso promocional" className="w-full bg-[#850b1d] hover:bg-[#9d0e23] transition-colors text-white py-2 px-4 text-xs font-semibold tracking-wider text-center flex items-center justify-center gap-2 cursor-pointer z-50 border-b border-red-500/20"
      onClick={onClaimOffer}
    >
      <span className="text-amber-300">★</span>
      <span>OFERTA PARA NOVOS ALUNOS: GANHE SUA PRIMEIRA SEMANA GRÁTIS!</span>
      <span className="inline-flex items-center underline underline-offset-2 ml-1 text-white hover:text-amber-200">
        GARANTIR VAGA GRÁTIS &rarr;
      </span>
    </aside>
  );
}
