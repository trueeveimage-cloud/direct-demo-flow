interface AnalyticsEvent {
  event: string;
  properties: Record<string, unknown>;
  timestamp: string;
}

interface ExportOptions {
  events: AnalyticsEvent[];
  filename?: string;
}

export function exportToCSV({ events, filename = 'analytics-export' }: ExportOptions): void {
  if (events.length === 0) {
    console.warn('No events to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'Timestamp',
    'Event',
    'Page Path',
    'Session ID',
    'Device Type',
    'Referrer',
    'Screen Width',
    'Screen Height',
    'UTM Source',
    'UTM Medium',
    'UTM Campaign',
  ];

  // Convert events to CSV rows
  const rows = events.map(event => {
    const props = event.properties || {};
    return [
      event.timestamp,
      event.event,
      props.path || props.$pathname || '',
      props.session_id || props.$session_id || '',
      props.device_type || props.$device_type || '',
      props.referrer || props.$referrer || '',
      props.screen_width || props.$screen_width || '',
      props.screen_height || props.$screen_height || '',
      props.utm_source || '',
      props.utm_medium || '',
      props.utm_campaign || '',
    ].map(val => {
      // Escape quotes and wrap in quotes if contains comma
      const strVal = String(val || '');
      if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
        return `"${strVal.replace(/"/g, '""')}"`;
      }
      return strVal;
    }).join(',');
  });

  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function exportSubmissionsToCSV<T extends object>(submissions: T[], filename = 'submissions-export'): void {
  if (submissions.length === 0) {
    console.warn('No submissions to export');
    return;
  }

  // Get all unique keys from submissions
  const allKeys = new Set<string>();
  submissions.forEach(sub => {
    Object.keys(sub).forEach(key => allKeys.add(key));
  });
  
  const headers = Array.from(allKeys);

  // Convert to CSV rows
  const rows = submissions.map(sub => {
    return headers.map(header => {
      const val = (sub as Record<string, unknown>)[header];
      const strVal = val === null || val === undefined ? '' : 
        typeof val === 'object' ? JSON.stringify(val) : String(val);
      
      if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
        return `"${strVal.replace(/"/g, '""')}"`;
      }
      return strVal;
    }).join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
