'use client';

import React, { useState } from 'react';
import { StudySpot } from '@/lib/types';
import { Zap, Sun, Sparkles } from 'lucide-react';

interface SeatingFloorMapProps {
  spot: StudySpot;
}

interface Desk {
  id: string;
  name: string;
  isWindow: boolean;
  hasOutlet: boolean;
  isOccupied: boolean;
  type: 'carrel' | 'table' | 'booth';
}

export default function SeatingFloorMap({ spot }: SeatingFloorMapProps) {
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);

  // Generate deterministic desks based on spot id
  const desks: Desk[] = [
    { id: 'd-1', name: 'Carrel 1A (Window)', isWindow: true, hasOutlet: true, isOccupied: spot.busyness_score > 60, type: 'carrel' },
    { id: 'd-2', name: 'Carrel 1B (Window)', isWindow: true, hasOutlet: true, isOccupied: spot.busyness_score > 40, type: 'carrel' },
    { id: 'd-3', name: 'Carrel 1C (Window)', isWindow: true, hasOutlet: false, isOccupied: spot.busyness_score > 80, type: 'carrel' },
    { id: 'd-4', name: 'Corner Table 2A', isWindow: false, hasOutlet: true, isOccupied: spot.busyness_score > 50, type: 'table' },
    { id: 'd-5', name: 'Center Pod 2B', isWindow: false, hasOutlet: true, isOccupied: spot.busyness_score > 30, type: 'table' },
    { id: 'd-6', name: 'Center Pod 2C', isWindow: false, hasOutlet: false, isOccupied: false, type: 'table' },
    { id: 'd-7', name: 'Deep Stacks Carrel 3A', isWindow: false, hasOutlet: true, isOccupied: spot.busyness_score > 70, type: 'carrel' },
    { id: 'd-8', name: 'Deep Stacks Carrel 3B', isWindow: false, hasOutlet: true, isOccupied: false, type: 'carrel' },
  ];

  return (
    <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Interactive Seating & Outlet Map
          </h3>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Open
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Taken
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-amber-500" /> Outlet
          </span>
        </div>
      </div>

      {/* Floorplan Diagram */}
      <div className="relative p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
        {/* Top Window Wall Indicator */}
        <div className="w-full text-center pb-2 mb-2 border-b border-dashed border-slate-300 dark:border-slate-800 text-[10px] text-sky-500 font-semibold flex items-center justify-center gap-1">
          <Sun className="w-3 h-3 text-yellow-400" />
          <span>Floor-to-Ceiling Windows (Natural Light Wall)</span>
        </div>

        {/* Desks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {desks.map((desk) => {
            const isSelected = selectedDesk?.id === desk.id;
            return (
              <button
                key={desk.id}
                type="button"
                onClick={() => setSelectedDesk(desk)}
                className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 shadow-xs ring-2 ring-indigo-500/20 scale-[1.02]'
                    : desk.isOccupied
                    ? 'border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10'
                    : 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      desk.isOccupied ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                  />
                  <div className="flex items-center gap-1">
                    {desk.hasOutlet && <Zap className="w-3 h-3 text-amber-500" />}
                    {desk.isWindow && <Sun className="w-3 h-3 text-yellow-400" />}
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                  {desk.name}
                </span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {desk.isOccupied ? 'Occupied' : 'Open seat'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Entrance Label */}
        <div className="w-full text-center pt-2 mt-2 border-t border-dashed border-slate-300 dark:border-slate-800 text-[10px] text-slate-400">
          🚪 Main Hallway Entrance & Silent Zone Sign
        </div>
      </div>

      {/* Selected Desk Detail Box */}
      {selectedDesk && (
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs flex items-center justify-between animate-in fade-in">
          <div>
            <div className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>{selectedDesk.name}</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              {selectedDesk.hasOutlet ? '🔌 Dedicated dual 120V power outlets.' : 'No outlet at this carrel.'}{' '}
              {selectedDesk.isWindow ? '☀️ Great panoramic natural lighting.' : 'Quiet reading lamp illuminated.'}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                selectedDesk.isOccupied
                  ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                  : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {selectedDesk.isOccupied ? 'Taken' : 'Likely Open'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
