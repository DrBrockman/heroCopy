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
  Selection,
} from "@heroui/react";
import { TreatmentSelector } from "@/components/manualArea/treatment-selector";
import { Treatment, TreatmentType } from "@/types/treatment"; // Import the type
import { SavedTreatments } from "@/components/manualArea/saved-treatments";

interface Section {
  id: TreatmentType | string; // Use TreatmentType for our specific sections
  title: string;
  content: string | React.ReactNode;
}

const sections: Section[] = [
  {
    id: "soft-tissue",
    title: "Soft Tissue",
    content: null,
  },
  {
    id: "joint-mobilization",
    title: "Joint Mobilization",
    content: null,
  },
  {
    id: "dry-needling",
    title: "Dry Needling",
    content: null,
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
  manual: Treatment[]; // Optional prop for manual treatments
  setManual: React.Dispatch<React.SetStateAction<Treatment[]>>; // Optional setter for manual treatments
}

function ManFun({
  selectedCategories,
  setSelectedCategories,
  manual = [],
  setManual = () => {},
}: ManFunProps) {
  const [activeSection, setActiveSection] = React.useState<Section | null>(
    null
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSectionClick = (section: Section) => {
    setActiveSection(section);
    onOpen();
  };

  const handleSelectionChange = (keys: Selection) => {
    let selectedKeysArray: string[];
    if (keys instanceof Set) {
      selectedKeysArray = Array.from(keys).map((key) => String(key));
    } else {
      selectedKeysArray = categories; // Assumes 'all'
    }
    setSelectedCategories(selectedKeysArray);
  };

  // setManual is expected to be passed as a prop, but if not provided, define a no-op fallback.
  return (
    <div className="flex w-full pt-2 gap-2 overflow-y-scroll">
      {/* Left Column */}
      <div className="flex-none mr-1">
        <div className="top-4">
          <Listbox
            aria-label="Categories"
            selectionMode="multiple"
            selectedKeys={new Set(selectedCategories)}
            onSelectionChange={handleSelectionChange}
            className="gap-2"
            disableAnimation
          >
            {categories.map((category) => (
              <ListboxItem
                key={category}
                className="p-0 data-[hover]:bg-transparent focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!bg-transparent"
                hideSelectedIcon
                style={{
                  outline: "none !important",
                  boxShadow: "none !important",
                }}
              >
                <div className="m-1">
                  <div
                    className={`flex items-center justify-center text-center rounded-full px-4 py-2 transition-all duration-200 ${
                      selectedCategories.includes(category)
                        ? "bg-primary text-white font-semibold  shadow-md hover:bg-primary-600"
                        : "bg-content1 text-default-800 font-semibold  border-default-200 hover:bg-default-100"
                    }`}
                  >
                    {category}
                  </div>
                </div>
              </ListboxItem>
            ))}
          </Listbox>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full ">
        <div className="grid grid-cols-1 gap-3 h-full">
          {sections.map((section) => (
            <Card
              key={section.id}
              className="h-full p-2 relative group cursor-pointer"
              isPressable={true}
              onPress={() => handleSectionClick(section)}
            >
              <div className="flex items-center">
                <h2 className="text-sm font-semibold">{section.title}</h2>
              </div>
              {/* Show saved treatments for this section */}
              {["soft-tissue", "joint-mobilization", "dry-needling"].includes(
                section.id
              ) && (
                <div className="">
                  <SavedTreatments
                    type={section.id as TreatmentType}
                    manual={manual}
                    setManual={setManual}
                  />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
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
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{activeSection?.title}</ModalHeader>
              <ModalBody>
                {activeSection &&
                ["soft-tissue", "joint-mobilization", "dry-needling"].includes(
                  activeSection.id
                ) ? (
                  <TreatmentSelector
                    onClose={onClose}
                    type={activeSection.id as TreatmentType}
                    manual={manual}
                    setManual={setManual}
                  />
                ) : (
                  activeSection?.content || "Content not available."
                )}
              </ModalBody>
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
