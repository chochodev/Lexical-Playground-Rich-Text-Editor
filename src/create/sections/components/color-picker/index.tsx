'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@heroui/react';
import { LuPaintbrush, LuText } from 'react-icons/lu';
import { SketchPicker, type ColorResult } from 'react-color';

interface ColorPickerProps {
  defaultColor?: string;
  label?: string;
  type?: 'text' | 'background';
  onChange?: (color: string) => void;
}

export const ColorPicker = ({
  defaultColor = '#000000',
  label = 'Text Color',
  type = 'text',
  onChange,
}: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close the picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleColorChange = (color: ColorResult) => {
    setSelectedColor(color.hex);
    onChange?.(color.hex);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <Button
        variant="faded"
        radius="sm"
        size="sm"
        className="flex items-center gap-1"
        onPress={() => setIsOpen(!isOpen)}
        aria-label={label}
      >
        <div
          className="h-3.5 w-3.5 rounded-sm border border-solid border-gray-300"
          style={{ backgroundColor: selectedColor }}
        />
        {type === 'text' ? (
          <LuText className="h-4 w-4" />
        ) : (
          <LuPaintbrush className="h-4 w-4" />
        )}
      </Button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1">
          <SketchPicker
            color={selectedColor}
            onChange={handleColorChange}
            disableAlpha={true}
            presetColors={[
              '#D0021B',
              '#F5A623',
              '#F8E71C',
              '#8B572A',
              '#7ED321',
              '#417505',
              '#BD10E0',
              '#9013FE',
              '#4A90E2',
              '#50E3C2',
              '#B8E986',
              '#000000',
              '#4A4A4A',
              '#9B9B9B',
              '#FFFFFF',
            ]}
          />
        </div>
      )}
    </div>
  );
};
