// src/app/admin/super/audit-log/page.tsx

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '@/components/common/Loading';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);

interface LogEntry {
  id: string;
  actorEmail: string;
  action: string;
  targetEmail: string | null;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/admin/super/audit-log', { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(({ data }) => setLogs(data.data))
      .finally(() => setIsLoading(false));
  }, []);

  const describeDetails = (log: LogEntry) => {
    if (!log.details) return '';
    try {
      const d = JSON.parse(log.details);
      if (d.from && d.to) return `${d.from} → ${d.to}`;
      return log.details;
    } catch {
      return log.details;
    }
  };

  if (isLoading) return <Loading text="Loading audit log..." />;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold">Audit Log</h1>
      </div>

      {logs.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-12">No activity recorded yet</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="card-sm text-sm flex flex-col md:flex-row md:items-center md:justify-between gap-1"
            >
              <div>
                <span className="font-medium">{log.actorEmail}</span>
                <span className="text-gray-500 dark:text-gray-400"> changed </span>
                <span className="font-medium">{log.targetEmail}</span>
                <span className="text-gray-500 dark:text-gray-400">'s role: </span>
                <span className="badge badge-primary">{describeDetails(log)}</span>
              </div>
              <div className="text-xs text-gray-400 flex-shrink-0">
                {new Date(log.createdAt).toLocaleString('bn-BD')}
                {log.ipAddress && ` · ${log.ipAddress}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
