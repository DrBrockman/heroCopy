import React from 'react';
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useDrag } from '@use-gesture/react'; // NEW: Import the gesture hook

interface NumberPadModalProps {
  onClose: () => void;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  onSwipe: (direction: 'left' | 'right') => void;
}

export const NumberPadModal: React.FC<NumberPadModalProps> = ({ onClose, label, value, onValueChange, onSwipe }) => {
  const handleInput = (char: string) => {
    if (value.length >= 3) return;
    onValueChange(value + char);
  };

  const handleDelete = () => {
    onValueChange(value.slice(0, -1));
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // NEW: Set up the drag/swipe gesture handler
  const bind = useDrag(({ swipe: [swipeX], last }) => {
    // `swipe` provides a direction vector [x, y] where x is -1 for left, 1 for right
    // We only trigger the action on the 'last' event of the drag to avoid multiple fires.
    if (last) {
        if (swipeX === -1) onSwipe('left');
        if (swipeX === 1) onSwipe('right');
    }
  }, {
    // Optional config: set a threshold so small movements aren't registered as swipes
    swipe: { distance: 40 } 
  });

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      {/* NEW: Spread the bind() props onto the element you want to be draggable/swipable */}
      <div
        {...bind()}
        onClick={handleModalContentClick}
        className="bg-content1 rounded-lg p-4 w-80 shadow-xl touch-none flex flex-col gap-4"
      >
        <div className="flex justify-between items-center">
          <Button
            isIconOnly
            variant="light"
            onPress={() => onSwipe('left')}
            className="text-xl"
          >
            <Icon icon="lucide:chevron-left" />
          </Button>
          <h2 className="text-xl font-bold">{label}</h2>
          <Button
            isIconOnly
            variant="light"
            onPress={() => onSwipe('right')}
            className="text-xl"
          >
            <Icon icon="lucide:chevron-right" />
          </Button>
        </div>

        <div className="text-center text-4xl font-mono p-2 border-b-2 border-divider min-h-[56px]">
          {value || <span className="text-default-400">0</span>}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
            <Button
              key={num}
              onPress={() => handleInput(num.toString())}
              variant="flat"
              size="lg"
              className="text-2xl h-16"
            >
              {num}
            </Button>
          ))}
          <Button
            onPress={handleDelete}
            variant="flat"
            color="danger"
            size="lg"
            className="text-xl h-16"
          >
            <Icon icon="lucide:delete" className="text-2xl" />
          </Button>
          <Button
            onPress={() => handleInput('0')}
            variant="flat"
            size="lg"
            className="text-2xl h-16"
          >
            0
          </Button>
          <Button
            onPress={onClose}
            variant="flat"
            color="success"
            size="lg"
            className="text-xl h-16"
          >
            <Icon icon="lucide:check" className="text-2xl" />
          </Button>
        </div>
      </div>
    </div>
  );
};