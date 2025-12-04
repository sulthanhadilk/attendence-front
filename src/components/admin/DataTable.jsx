import React from 'react'
export default function DataTable({ columns = [], data = [], rowKey = (row, idx) => idx, onRowClick }) {
  return (
    <div className="card">
      <div className="card-body">
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key || col.accessor} className="text-left">{col.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={rowKey(row, idx)} className="hover-row" onClick={() => onRowClick && onRowClick(row)}>
                  {columns.map(col => (
                    <td key={col.key || col.accessor}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={columns.length} className="text-muted">No records</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
