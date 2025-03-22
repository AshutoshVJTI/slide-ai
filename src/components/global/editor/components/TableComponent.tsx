'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useSlideStore } from '@/store/useSlideStore';
import React, { useEffect } from 'react'

type Props = {
  content: string[][];
  onChange: (newContent: string[][]) => void;
  isPreview?: boolean;
  isEditable?: boolean;
  initialRowSize?: number;
  initialColumnSize?: number;
}

const TableComponent = (props: Props) => {
  const { content, onChange, isPreview, isEditable, initialRowSize, initialColumnSize } = props;

  const { currentTheme } = useSlideStore();

  const [tableData, setTableData] = React.useState<string[][]>(() => {
    if (content.length === 0 || content[0].length === 0) {
      return Array(initialRowSize).fill(Array(initialColumnSize).fill(''));
    }
    return content;
  });
  const [colSizes, setColSizes] = React.useState<number[]>([]);
  const [rowSizes, setRowSizes] = React.useState<number[]>([]);

  const handleResizeCol = (index: number, newSize: number) => {
    if (!isEditable) return;
    const newSizes = [...colSizes];
    newSizes[index] = newSize;
    setColSizes(newSizes);
  }

  const updateCell = (rowIndex: number, colIndex: number, newValue: string) => {
    if (!isEditable) return;
    const newData = tableData.map((row, rIndex) =>
      rIndex === rowIndex
        ? row.map((cell, cIndex) => cIndex === colIndex ? newValue : cell)
        : row
    )
    setTableData(newData)
    onChange(newData)
  }

  useEffect(() => {
    setRowSizes(Array(tableData.length).fill(100 / tableData.length))
    setColSizes(Array(tableData[0].length).fill(100 / tableData[0].length))
  }, [tableData])

  if (isPreview) {
    return (
      <div className='w-full overflow-x-auto text-xs'>
        <table className="w-full">
          <thead>
            <tr>
              {tableData[0].map((cell, index) => (
                <th key={index} className="p-2 border" style={{ width: `${colSizes[index]}%` }}>
                  {cell || 'Type here'}
                </th>
              ))
              }
            </tr>
          </thead>
          <tbody>
            {tableData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex} style={{ height: `${rowSizes[rowIndex + 1]}%` }}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="p-2 border">
                    {cell || 'Type here'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className='w-full h-full relative' style={{
      background: currentTheme.gradientBackground || currentTheme.backgroundColor,
      borderRadius: '8px'
    }}>
      <ResizablePanelGroup
        direction='vertical'
        className={`w-full h-full rounded-lg border ${initialColumnSize === 2
          ? 'min-h-[100px]'
          : initialColumnSize === 3
            ? 'min-h-[150px]'
            : initialColumnSize === 4
              ? 'min-h-[200px]'
              : 'min-h-[100px]'
          }`}
        onLayout={(sizes) => { setRowSizes(sizes) }}
      >
        {tableData.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {rowIndex > 0 && <ResizableHandle />}
            <ResizablePanelGroup
              direction='horizontal'
              onLayout={(sizes) => { setColSizes(sizes) }}
              className='w-full h-full'>
              {row.map((cell, colIndex) => (
                <React.Fragment key={colIndex}>
                  {colIndex > 0 && <ResizableHandle />}
                  <ResizablePanel
                    defaultSize={colSizes[colIndex]}
                    onResize={(size) => { handleResizeCol(colIndex, size) }}
                    className='w-full h-full min-h-9'
                  >
                    <div className='relative w-full h-full min-h-3'>
                      <input
                        value={cell}
                        onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                        className='w-full h-full p-4 bg-transparent focus:outline-none focus:ring-2'
                        placeholder='Type here'
                        style={{ color: currentTheme.fontColor }}
                        readOnly={!isEditable}
                      />
                    </div>
                  </ResizablePanel>
                </React.Fragment>
              ))}
            </ResizablePanelGroup>
          </React.Fragment>
        ))}
      </ResizablePanelGroup>
    </div>
  )
}

export default TableComponent