import React from 'react';
import { TimelineItem, TimelineProps } from '@/types/types';

export default function EventTimeline({ timeline }: TimelineProps) {
  const now = new Date();

  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()
  );

  const currentIndex = sortedTimeline.findIndex(item => new Date(item.dateISO) > now);

  const timelineWithStatus = sortedTimeline.map((item, index) => {
    let status: "completed" | "current" | "upcoming";

    if (currentIndex === -1) {
      // If no future events are found, everything is completed
      status = "completed";
    } else if (index < currentIndex) {
      // Everything before the closest future event is done
      status = "completed";
    } else if (index === currentIndex) {
      // The closest future event is the current focus
      status = "current";
    } else {
      // Everything else is further in the future
      status = "upcoming";
    }

    return { ...item, status };
  });

  return (
    <section className="space-y-8 py-10">
      <div className="flex items-center gap-4">
        <h3 className="text-3xl font-bold text-white">Event Timeline</h3>
        <div className="h-[2px] flex-1 bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
      </div>

      <div className="relative pl-12 space-y-12">
        {timelineWithStatus.map((item, idx) => {
          const isLast = idx === timelineWithStatus.length - 1;
          const nextItem = timelineWithStatus[idx + 1];

          let lineClass = "bg-white/10";
          if (nextItem?.status === 'completed') {
            lineClass = "bg-[linear-gradient(to_bottom,#10b981,#059669,#10b981)] bg-[length:100%_200%] animate-timeline-flow";
          } else if (nextItem?.status === 'current') {
            lineClass = "bg-[linear-gradient(to_bottom,#3f3f46,#f59e0b,#3f3f46)] bg-[length:100%_200%] animate-timeline-flow";
          }

          return (
            <div key={idx} className="relative group">
              {/* Vertical Line Segment */}
              {!isLast && (
                    <div 
                    className={`absolute left-[-36px] top-1/2 h-[calc(100%+3rem)] w-[2px] -translate-x-1/2 z-0 ${lineClass}`} 
                    />
                )}

              {/* Timeline Dot */}
              <div className={`absolute left-[-36px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-[#0a0a0a] z-10 flex items-center justify-center transition-all duration-500 ${
                item.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 
                item.status === 'current' ? 'bg-white ring-4 ring-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.6)]' : 
                'bg-zinc-800 border-zinc-700'
              }`}>
                {item.status === 'completed' && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {item.status === 'current' && (
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                )}
              </div>

              {/* Event Box */}
              <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 transition-all group-hover:bg-white/[0.08] group-hover:-translate-y-1 ${
                item.status === 'current' ? 'ring-1 ring-emerald-500/50 bg-emerald-500/5' : ''
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h4 className={`text-xl font-bold ${item.status === 'upcoming' ? 'text-white/40' : 'text-white'}`}>
                    {item.name}
                  </h4>
                  <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-colors ${
                    item.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                    item.status === 'current' ? 'bg-emerald-500 text-black border-emerald-500' :
                    'bg-white/5 border-white/10 text-white/40'
                  }`}>
                    {item.date}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${item.status === 'upcoming' ? 'text-white/20' : 'text-white/60'}`}>
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
