import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, totalItems } = pagination;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      marginTop: '2rem',
      paddingTop: '1.25rem',
      borderTop: '1px solid var(--border-light)'
    }}>
      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Showing page <strong style={{ color: 'var(--text-main)' }}>{currentPage}</strong> of <strong style={{ color: 'var(--text-main)' }}>{totalPages}</strong> ({totalItems} listings)
      </div>

      <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.375rem 0.625rem' }}
        >
          <ChevronLeft size={16} /> Prev
        </button>

        {pages.map(p => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={p === currentPage ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            style={{ minWidth: '2.25rem' }}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.375rem 0.625rem' }}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
