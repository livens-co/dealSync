import { ReactNode } from "react";
import { format } from "date-fns";
import "./style.scss";

interface Column<T> {
  header: string;
  accessor: keyof T;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
}

type Stringify<T> = {
  [K in keyof T]: T[K] extends object ? string : T[K];
};

const Table = <T,>({
  data,
  columns,
  onRowClick,
}: TableProps<Stringify<T>>) => {
  const renderCellContent = (header: string, content: string | number | boolean): ReactNode => {
    if (header === "Status") {
      return (
        <span className={getStatusClassName(content as string)}>
          {content.toString()}
        </span>
      );
    }

    if ( header === "Rok isporuke") {
      return format(new Date(content.toString()), "dd.MM.yyyy.");
    }

    return content.toString();
  };

  const getStatusClassName = (status: string) => {
    switch (status) {
      case "KREIRANO":
        return "statusCreated";
      case "NARUČENO":
        return "statusOrdered";
      case "ISPORUČENO":
        return "statusDelivered";
      default:
        return "";
    }
  };

  return (
    <div className="tableContainer">
    
        <table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr key={rowIndex} onClick={() => onRowClick && onRowClick(item)}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {renderCellContent(column.header, item[column.accessor] as string | number | boolean)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
   
  );
};

export default Table;
