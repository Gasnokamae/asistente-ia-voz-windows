
import React from 'react';

const LinkIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      d="M1.757 10.303a.75.75 0 00-1.06 1.061l3 3a4 4 0 005.656 0l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a2.5 2.5 0 01-3.535 0l-3-3z"
      clipRule="evenodd"
    />
  </svg>
);

export default LinkIcon;
