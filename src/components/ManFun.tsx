import React from "react";
import {
  Listbox,
  ListboxItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Card,
  Selection // Import the Selection type from the library if it's exported
            // Or use type Selection = Set<React.Key> | "all";
} from "@heroui/react";

interface Section {
  id: string;
  title: string;
  content: string;
}

const sections: Section[] = [
  {
    id: "soft-tissue",
    title: "Soft Tissue",
    content: "Soft tissue content and details go here...",
  },
  {
    id: "joint-mobilization",
    title: "Joint Mobilization",
    content: "Joint mobilization techniques and information...",
  },
  {
    id: "dry-needling",
    title: "Dry Needling",
    content: "Dry needling procedures and protocols...",
  },
];

const categories = [
  "ADL",
  "Balance",
  "Endurance",
  "Ergonomics",
  "Gait",
  "Posture",
  "Athletics",
  "Transfers",
  "Work task",
];

interface ManFunProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}

function ManFun({ selectedCategories, setSelectedCategories }: ManFunProps) {
  const [activeSection, setActiveSection] = React.useState<Section | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSectionClick = (section: Section) => {
    setActiveSection(section);
    onOpen();
  };

  // Updated handler to correctly process the Selection type
  const handleSelectionChange = (keys: Selection) => {
     let selectedKeysArray: string[];

     if (keys === "all") {
       // If the Listbox supports selecting "all" and it happens,
       // update state with all available categories.
       // Adjust if "select all" isn't applicable to your use case.
       selectedKeysArray = [...categories];
     } else if (keys instanceof Set) {
       // Convert the Set<React.Key> to string[].
       // Since your keys are strings, this conversion is straightforward.
       // Using String() handles potential number keys if the type were broader.
       selectedKeysArray = Array.from(keys).map(key => String(key));
     } else {
       // Fallback for any unexpected case
       selectedKeysArray = [];
     }

    setSelectedCategories(selectedKeysArray); // Call the prop setter with the processed array
  };


  return (
    <div className="flex w-full pt-2 gap-4">
      {/* Left Column */}
      <div className="flex-none mr-2">
        <div className="top-4">
          <Listbox
           aria-label="Categories"
           selectionMode="multiple"
           selectedKeys={new Set(selectedCategories)} // Keep passing a Set here
           onSelectionChange={handleSelectionChange} // The handler is now correctly typed
           className="gap-2"
           disableAnimation
          >
            {/* ... ListboxItems ... */}
             {categories.map((category) => {
              // Check inclusion using the array prop
              const isSelected = selectedCategories.includes(category);
              return (
                <ListboxItem
                  key={category}
                  className="p-0 data-[hover]:bg-transparent focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!bg-transparent"
                  hideSelectedIcon
                  style={{ outline: 'none !important', boxShadow: 'none !important' }}
                >
                  <div className="m-1">
                    <div
                      className={`flex items-center justify-center text-center rounded-full px-4 py-2 transition-all duration-200 ${
                        isSelected
                          ? "bg-primary text-white font-semibold  shadow-md hover:bg-primary-600"
                          : "bg-content1 text-default-800 font-semibold  border-default-200 hover:bg-default-100"
                      }`}
                    >
                      {category}
                    </div>
                  </div>
                </ListboxItem>
              );
            })}
          </Listbox>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full shrink">
        <div className="grid grid-cols-1 gap-4 h-full">
          {sections.map((section) => (
            <Card 
              key={section.id} 
              className="h-full p-2 relative group cursor-pointer"
              isPressable={true}
              onPress={() => handleSectionClick(section)}
            >
              <div className="flex items-center">
                <h2 className="text-l font-semibold">{section.title}</h2>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        size="4xl" 
        placement="center"
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.1,
                ease: "easeOut",
              },
            },
            exit: {
              y: 0,
              opacity: 0,
              transition: {
                duration: 0.1,
                ease: "easeIn",
              },
            },
          },
        }}
        backdrop="blur"
        classNames={{
          backdrop: "backdrop-blur-sm transition-all duration-100"  
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{activeSection?.title}</ModalHeader>
              <ModalBody>{activeSection?.content}</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ManFun;