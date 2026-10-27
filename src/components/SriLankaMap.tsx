import React from 'react';
import { HospitalRecord } from '../data/sriLankaData.js';
import { InteractiveMapNav } from './InteractiveMapNav.js';

interface SriLankaMapProps {
  onSelectHospital?: (hospital: HospitalRecord) => void;
  className?: string;
}

export const SriLankaMap: React.FC<SriLankaMapProps> = ({ onSelectHospital, className = '' }) => {
  return (
    <div className={className}>
      <InteractiveMapNav initialMode="all" initialDistrict="Jaffna" />
    </div>
  );
};
