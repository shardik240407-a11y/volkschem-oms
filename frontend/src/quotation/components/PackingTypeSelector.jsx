import { Wine, Pipette, Package, Archive, Cylinder, Drum } from 'lucide-react';

const typeIcons = {
  Bottle:     Wine,
  Ampoule:    Pipette,
  Pouch:      Package,
  'Jar/Dabba': Archive,
  Bucket:     Cylinder,
  Drum:       Drum,
};

export default function PackingTypeSelector({ availableTypes, selectedType, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
      {availableTypes.map((type) => {
        const Icon = typeIcons[type] || Package;
        const isSelected = selectedType === type;
        return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
              isSelected
                ? 'border-primary bg-primary-50 shadow-sm'
                : 'border-border bg-white hover:border-primary-lighter hover:bg-surface-alt'
            }`}
          >
            {isSelected && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
            )}
            <div className="relative">
              <Icon size={28} className={isSelected ? 'text-primary' : 'text-text-secondary'} />
            </div>
            <span className={`text-xs font-medium ${isSelected ? 'text-primary' : 'text-text-secondary'}`}>{type}</span>
          </button>
        );
      })}
    </div>
  );
}
