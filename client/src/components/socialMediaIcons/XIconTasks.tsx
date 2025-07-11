import React from 'react';

const XIconTasks: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={20}
    fill="none"
    viewBox="0 0 18 20"
    {...props}
  >
    <path
      d="m17.873 18.708-6.4-10.241 6.315-7.074a.843.843 0 0 0-.062-1.17.81.81 0 0 0-1.149.05L10.561 7.01 6.422.386A.82.82 0 0 0 5.732 0H.825C.678 0 .534.04.408.116A.845.845 0 0 0 .135 1.28l6.4 10.24L.218 18.6a.84.84 0 0 0-.218.602.85.85 0 0 0 .267.581.82.82 0 0 0 .594.216.8.8 0 0 0 .568-.28l6.015-6.737 4.14 6.624a.82.82 0 0 0 .69.381h4.907c.147 0 .29-.04.417-.116a.845.845 0 0 0 .274-1.163ZM12.723 18.322 2.315 1.666H5.28l10.414 16.656z"
      fill="#fff"
    />
  </svg>
);

export default XIconTasks;
