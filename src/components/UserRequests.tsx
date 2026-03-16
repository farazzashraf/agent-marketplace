import { useState, useEffect } from 'react';
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react';

interface UserRequest {
  email: string;
  requirements: string;
  date: string;
}

export default function UserRequests() {
  const [requests, setRequests] = useState<UserRequest[]>([]);

  useEffect(() => {
    const storedReqs = JSON.parse(localStorage.getItem('explorerRequirements') || '[]');
    setRequests(storedReqs);
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Requests</h1>
        <p className="mt-2 text-gray-500">Discover what users are looking for and build the agents they need.</p>
      </div>

      <div className="space-y-4">
        {requests.length > 0 ? (
          requests.map((req, index) => (
            <div key={index} className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <span className="text-sm font-medium">{req.email.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{req.email}</p>
                    <p className="text-xs text-gray-500">{new Date(req.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <p className="text-gray-700">
                  {req.requirements}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <h3 className="text-sm font-medium text-gray-900">No requests yet</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later for new user requirements.</p>
          </div>
        )}
      </div>
    </div>
  );
}
