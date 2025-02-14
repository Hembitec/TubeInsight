import React from 'react';

interface TabNavProps {
  sections: {
    id: string;
    title: string;
  }[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  className?: string;
}

export const TabNav: React.FC<TabNavProps> = ({
  sections,
  activeSection,
  onSectionChange,
  className
}) => {
  return (
    <div className={`bg-[#1E2235] border-b border-gray-700 ${className || ''}`}>
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center h-10">
          {sections.map((section, index) => (
            <React.Fragment key={section.id}>
              {index > 0 && (
                <div className="h-5 w-[1px] bg-gray-700" />
              )}
              <button
                onClick={() => onSectionChange(section.id)}
                className={`h-full px-6 text-sm font-medium transition-colors relative hover:bg-[#252B43]
                  ${activeSection === section.id 
                    ? 'text-blue-400 bg-[#252B43]' 
                    : 'text-gray-400'
                  }`}
              >
                <span className="relative z-10">{section.title}</span>
                {activeSection === section.id && (
                  <div className="absolute inset-0 border-t-2 border-blue-500" />
                )}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
