import React from 'react';

interface CircleNavProps {
  sections: {
    id: string;
    title: string;
    color?: string;
  }[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export const CircleNav: React.FC<CircleNavProps> = ({
  sections,
  activeSection,
  onSectionChange,
}) => {
  return (
    <div className="flex justify-center items-center gap-4 sm:gap-8 my-6">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`relative group`}
        >
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 
              ${activeSection === section.id 
                ? 'border-blue-500 bg-blue-500/20' 
                : 'border-gray-600 bg-gray-800/50 hover:border-blue-400 hover:bg-blue-500/10'
              } 
              transition-all duration-300 flex items-center justify-center`}
          >
            <span className="absolute -bottom-8 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {section.title}
            </span>
          </div>
          {activeSection === section.id && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4">
              <div className="w-3 h-3 bg-blue-500 rotate-45 transform origin-center"></div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
