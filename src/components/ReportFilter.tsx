import React from 'react';
import { Container } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';

interface ReportFilterProps {
  onSearch: () => void;
  title: string;
}

const ReportFilter: React.FC<ReportFilterProps> = ({ onSearch, title }) => (
  <Container className="report-filter">
    <h1>{title}</h1>
    <button type="button" onClick={onSearch} aria-label="Search">
      <Search size={18} />
    </button>
  </Container>
);

export default ReportFilter;
