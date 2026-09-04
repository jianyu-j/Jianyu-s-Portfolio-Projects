import React, { useState, ReactNode } from 'react';
import { Button } from '../../ui/Button';

// ============================================
// TYPES
// ============================================
type DateRangeOption = '7days' | '30days' | 'month' | 'quarter' | 'year' | 'custom';
type GroupByOption = 'daily' | 'weekly' | 'monthly';
type CompareToOption = 'none' | 'previous' | 'lastYear';

interface SmartChartProps {
  title: string;
  children: ReactNode;
  insight?: string;
  showDateRange?: boolean;
  showCompare?: boolean;
  showGroupBy?: boolean;
  showTrendLine?: boolean;
  showForecast?: boolean;
  filterOptions?: { label: string; options: string[] }[];
  onDateRangeChange?: (range: DateRangeOption) => void;
  onCompareChange?: (compare: CompareToOption) => void;
  onGroupByChange?: (groupBy: GroupByOption) => void;
  onFilterChange?: (filterKey: string, value: string) => void;
  onExport?: (format: 'pdf' | 'csv') => void;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================
const SmartChart: React.FC<SmartChartProps> = ({
  title,
  children,
  insight,
  showDateRange = true,
  showCompare = false,
  showGroupBy = false,
  showTrendLine = false,
  showForecast = false,
  filterOptions = [],
  onDateRangeChange,
  onCompareChange,
  onGroupByChange,
  onFilterChange,
  onExport,
  className = ''
}) => {
  const [dateRange, setDateRange] = useState<DateRangeOption>('30days');
  const [compareTo, setCompareTo] = useState<CompareToOption>('none');
  const [groupBy, setGroupBy] = useState<GroupByOption>('monthly');
  const [showTrend, setShowTrend] = useState(false);
  const [showForecastLine, setShowForecastLine] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleDateRangeChange = (value: DateRangeOption) => {
    setDateRange(value);
    onDateRangeChange?.(value);
  };

  const handleCompareChange = (value: CompareToOption) => {
    setCompareTo(value);
    onCompareChange?.(value);
  };

  const handleGroupByChange = (value: GroupByOption) => {
    setGroupBy(value);
    onGroupByChange?.(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    onFilterChange?.(key, value);
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    onExport?.(format);
    setIsExportOpen(false);
    // Mock export - in production would generate actual files
    console.log(`Exporting as ${format}...`);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {/* Header with title and controls */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold text-gray-800">{title}</h3>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Date Range Filter */}
            {showDateRange && (
              <select
                value={dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value as DateRangeOption)}
                className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-tennis-500 focus:border-tennis-500"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            )}
            
            {/* Compare To Filter */}
            {showCompare && (
              <select
                value={compareTo}
                onChange={(e) => handleCompareChange(e.target.value as CompareToOption)}
                className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-tennis-500 focus:border-tennis-500"
              >
                <option value="none">No Comparison</option>
                <option value="previous">vs Previous Period</option>
                <option value="lastYear">vs Last Year</option>
              </select>
            )}
            
            {/* Group By Filter */}
            {showGroupBy && (
              <select
                value={groupBy}
                onChange={(e) => handleGroupByChange(e.target.value as GroupByOption)}
                className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-tennis-500 focus:border-tennis-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            )}
            
            {/* Custom Filters */}
            {filterOptions.map(filter => (
              <select
                key={filter.label}
                value={filters[filter.label] || ''}
                onChange={(e) => handleFilterChange(filter.label, e.target.value)}
                className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-tennis-500 focus:border-tennis-500"
              >
                <option value="">All {filter.label}</option>
                {filter.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ))}
          </div>
        </div>
        
        {/* Toggles Row */}
        {(showTrendLine || showForecast) && (
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200">
            {showTrendLine && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTrend}
                  onChange={(e) => setShowTrend(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-tennis-600 focus:ring-tennis-500"
                />
                <span className="text-xs text-gray-600">Show Trend Line</span>
              </label>
            )}
            {showForecast && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showForecastLine}
                  onChange={(e) => setShowForecastLine(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-tennis-600 focus:ring-tennis-500"
                />
                <span className="text-xs text-gray-600">Show Forecast</span>
              </label>
            )}
          </div>
        )}
      </div>
      
      {/* Chart Content */}
      <div className="p-4">
        {children}
      </div>
      
      {/* Footer with insight and export */}
      <div className="px-4 pb-4 flex flex-wrap items-center justify-between gap-3">
        {/* Auto-Insight */}
        {insight && (
          <div className="flex-1 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
            <p className="text-xs text-blue-700">{insight}</p>
          </div>
        )}
        
        {/* Export Options */}
        <div className="relative">
          <Button 
            variant="secondary" 
            className="text-xs"
            onClick={() => setIsExportOpen(!isExportOpen)}
          >
            📤 Export
          </Button>
          
          {isExportOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
              <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2"
              >
                📄 Export PDF
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2 border-t border-gray-100"
              >
                Export CSV
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartChart;
