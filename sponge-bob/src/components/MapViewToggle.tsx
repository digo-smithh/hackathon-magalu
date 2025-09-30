import { useState } from 'react';
import { Button } from './ui/button';
import { Map, List } from 'lucide-react';

interface MapViewToggleProps {
  isMapView: boolean;
  onToggle: (isMapView: boolean) => void;
}

export function MapViewToggle({ isMapView, onToggle }: MapViewToggleProps) {
  return (
    <div className="flex bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-blue-200 shadow-sm">
      <Button
        variant={!isMapView ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggle(false)}
        className={`flex items-center space-x-2 ${
          !isMapView 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
        }`}
      >
        <List size={16} />
        <span>Lista</span>
      </Button>
      
      <Button
        variant={isMapView ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggle(true)}
        className={`flex items-center space-x-2 ${
          isMapView 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
        }`}
      >
        <Map size={16} />
        <span>Mapa</span>
      </Button>
    </div>
  );
}