import { useState } from 'react';
import { Calendar, Clock, MapPin, User, Filter } from 'lucide-react';
import { ClassScheduleItem } from '../types';

interface ScheduleSectionProps {
  schedule: ClassScheduleItem[];
  onBookClassForTime: (programName: string, time: string) => void;
}

export function ScheduleSection({ schedule, onBookClassForTime }: ScheduleSectionProps) {
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'] as const;
  const [selectedDay, setSelectedDay] = useState<'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado'>('Segunda');
  const [filterProgram, setFilterProgram] = useState<string>('Todas');

  const filteredSchedule = schedule.filter((item) => {
    const matchesDay = item.day === selectedDay;
    const matchesProgram = filterProgram === 'Todas' || item.program.toLowerCase().includes(filterProgram.toLowerCase());
    return matchesDay && matchesProgram;
  });

  return (
    <section id="horarios" className="py-20 bg-[#08080b] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-red-500 font-heading">
              GRADE DE HORÁRIOS SEMANAIS
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            TREINE NO SEU RITMO
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Mais de 40 aulas semanais divididas entre manhã, horário de almoço, tarde e noite. Encontre o horário ideal para a sua rotina.
          </p>
        </div>

        {/* Day Selectors Bar */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 gap-2 no-scrollbar">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedDay === day
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-[#14141c] text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Modalidade Quick Filter */}
        <div className="mt-4 mb-8 flex items-center justify-center gap-2 flex-wrap text-xs">
          <span className="text-neutral-500 text-[11px] font-bold uppercase flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filtrar:
          </span>
          {['Todas', 'Boxe', 'Muay Thai', 'Jiu-Jitsu', 'MMA', 'Preparação'].map((prog) => (
            <button
              key={prog}
              onClick={() => setFilterProgram(prog)}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                filterProgram === prog
                  ? 'bg-neutral-700 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {prog}
            </button>
          ))}
        </div>

        {/* Schedule Cards for Selected Day */}
        <div className="space-y-3 max-w-4xl mx-auto">
          {filteredSchedule.length === 0 ? (
            <div className="text-center py-12 bg-[#121218] rounded-xl border border-neutral-800">
              <p className="text-neutral-400 text-xs">Nenhuma turma com esse filtro para {selectedDay}.</p>
            </div>
          ) : (
            filteredSchedule.map((item) => (
              <div
                key={item.id}
                className="bg-[#121218] hover:bg-[#161620] border border-neutral-800/90 hover:border-red-500/40 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                {/* Time & Program */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-20 shrink-0 text-center bg-[#0d0d12] py-2 px-1 rounded-lg border border-neutral-800">
                    <span className="text-xs font-bold text-red-500 tabular-nums font-mono block">
                      {item.time.split(' - ')[0]}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono block">
                      até {item.time.split(' - ')[1]}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white font-heading uppercase">
                        {item.program}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-red-500" />
                        {item.coach}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-500" />
                        {item.room}
                      </span>
                      <span>·</span>
                      <span className="text-amber-400 font-medium">
                        {item.level}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Button */}
                <div className="shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onBookClassForTime(item.program, item.time)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-red-600/90 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer shadow-md"
                  >
                    Agendar Esta Aula
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}
