import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 bg-[#0b0b0e] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (matching reference image) */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <div className="text-xs uppercase font-bold tracking-[0.2em] text-red-500 font-heading">
            HISTÓRIAS DE SUPERAÇÃO
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase text-white font-heading tracking-wide">
            Pessoas Reais. Resultados Reais.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Veja o depoimento de quem treina lado a lado com nossos campeões e transformou sua vida na Knockout Gym.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={t.id}
              className={`bg-[#121217] rounded-2xl border ${
                idx === currentIndex ? 'border-red-500/50 shadow-xl shadow-red-950/20' : 'border-neutral-800'
              } p-6 flex flex-col justify-between space-y-6 transition-all`}
            >
              <div className="space-y-4">
                {/* Quote Icon & Stars */}
                <div className="flex items-center justify-between">
                  <Quote className="w-8 h-8 text-red-600/40" />
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Highlight Tag */}
                <span className="inline-block text-[11px] font-bold uppercase text-red-400 tracking-wider">
                  "{t.highlight}"
                </span>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-800/80">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-red-600/30"
                />
                <div>
                  <h4 className="text-sm font-bold text-white font-heading uppercase">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400 leading-tight">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
