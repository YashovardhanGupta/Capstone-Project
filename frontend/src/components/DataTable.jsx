import React from 'react';

const DataTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-32 text-everforest-light-fg/60 dark:text-everforest-dark-fg/60 italic">
        No data available to display.
      </div>
    );
  }

  // Dynamically extract columns from the first row of data
  const columns = Object.keys(data[0]);
  
  const totalRows = data.length;
  const displayData = data.slice(0, 20);

  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm font-medium text-everforest-light-fg/70 dark:text-everforest-dark-fg/70">
        Showing {displayData.length} of {totalRows} rows
      </div>
      <div className="overflow-x-auto rounded-xl border border-everforest-light-bg_dim dark:border-everforest-dark-bg_dim/50">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-everforest-light-bg_dim/50 dark:bg-everforest-dark-bg_dim/50 text-everforest-light-fg dark:text-everforest-dark-fg">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-6 py-4 font-semibold tracking-wider">
                  {col.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.map((row, index) => (
              <tr 
                key={index} 
                className={`border-b border-everforest-light-bg_dim/30 dark:border-everforest-dark-bg_dim/30 hover:bg-everforest-light-green/10 dark:hover:bg-everforest-dark-green/10 transition-colors duration-150 ${index % 2 === 0 ? 'bg-transparent' : 'bg-everforest-light-bg_dim/20 dark:bg-everforest-dark-bg_dim/20'}`}
              >
                {columns.map((col) => (
                  <td key={col} className="px-6 py-4 whitespace-nowrap text-everforest-light-fg/90 dark:text-everforest-dark-fg/90">
                    {/* Format numbers and dates beautifully if possible */}
                    {row[col] !== null ? String(row[col]) : <span className="text-everforest-light-red dark:text-everforest-dark-red italic">null</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
