import { useState } from 'react';
import { Lock, CheckCircle, Play, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Agent } from '../types';

interface AgentTesterProps {
  agents: Agent[];
}

export default function AgentTester({ agents }: AgentTesterProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<{
    status: 'success' | 'warning' | 'error';
    score: number;
    summary: string;
    message: string;
    details: string[];
  } | null>(null);

  const handleTestAgent = () => {
    if (!selectedAgentId) return;
    
    setIsTesting(true);
    setTestResults(null);

    // Simulate testing process
    setTimeout(() => {
      setIsTesting(false);
      const randomOutcome = Math.random();
      if (randomOutcome > 0.3) {
        setTestResults({
          status: 'success',
          score: Math.floor(Math.random() * 10) + 90, // 90-99
          summary: 'Excellent performance. The agent demonstrates high accuracy, fast response times, and robust security measures.',
          message: 'Agent passed all automated tests.',
          details: [
            'API endpoints responding correctly',
            'Authentication flow verified',
            'Response latency within acceptable limits (< 500ms)',
            'No security vulnerabilities detected'
          ]
        });
      } else if (randomOutcome > 0.1) {
        setTestResults({
          status: 'warning',
          score: Math.floor(Math.random() * 15) + 70, // 70-84
          summary: 'Acceptable performance, but some areas need optimization. Response times were occasionally slow.',
          message: 'Agent passed with warnings.',
          details: [
            'API endpoints responding correctly',
            'Response latency slightly high (800ms)',
            'Consider optimizing prompt structure'
          ]
        });
      } else {
        setTestResults({
          status: 'error',
          score: Math.floor(Math.random() * 30) + 30, // 30-59
          summary: 'Critical failures detected during testing. The agent is currently unstable and requires immediate developer attention.',
          message: 'Agent failed automated tests.',
          details: [
            'API endpoint timeout',
            'Failed to authenticate with provided credentials',
            'Please contact the developer'
          ]
        });
      }
    }, 2500);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-indigo-600" />
          Automated Agent Tester
        </h2>
        <p className="mt-2 text-gray-500">
          Select an agent from the marketplace to run automated verification tests.
        </p>
      </div>

      <div className="mb-8 max-w-xl">
        <label htmlFor="agent-select" className="mb-2 block text-sm font-medium text-gray-700">
          Select Agent to Test
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            id="agent-select"
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">-- Select an agent --</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.name} by {agent.developer.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleTestAgent}
            disabled={!selectedAgentId || isTesting}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 whitespace-nowrap"
          >
            {isTesting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Play className="h-5 w-5" />
            )}
            Run Tests
          </button>
        </div>
      </div>

      {testResults && (
        <div className={`rounded-2xl border p-6 sm:p-8 ${
          testResults.status === 'success' ? 'border-emerald-200 bg-emerald-50' :
          testResults.status === 'warning' ? 'border-amber-200 bg-amber-50' :
          'border-red-200 bg-red-50'
        }`}>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center mb-6">
            <div className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 bg-white shadow-sm ${
              testResults.status === 'success' ? 'border-emerald-500 text-emerald-600' :
              testResults.status === 'warning' ? 'border-amber-500 text-amber-600' :
              'border-red-500 text-red-600'
            }`}>
              <span className="text-3xl font-bold">{testResults.score}</span>
            </div>
            
            <div>
              <div className="mb-2 flex items-center gap-3">
                {testResults.status === 'success' ? (
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                ) : testResults.status === 'warning' ? (
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                )}
                <h3 className={`text-xl font-bold ${
                  testResults.status === 'success' ? 'text-emerald-900' :
                  testResults.status === 'warning' ? 'text-amber-900' :
                  'text-red-900'
                }`}>
                  {testResults.message}
                </h3>
              </div>
              <p className={`text-sm leading-relaxed ${
                testResults.status === 'success' ? 'text-emerald-800' :
                testResults.status === 'warning' ? 'text-amber-800' :
                'text-red-800'
              }`}>
                {testResults.summary}
              </p>
            </div>
          </div>
          
          <div className={`rounded-xl bg-white/60 p-5 border ${
            testResults.status === 'success' ? 'border-emerald-100' :
            testResults.status === 'warning' ? 'border-amber-100' :
            'border-red-100'
          }`}>
            <h4 className={`text-sm font-semibold mb-3 ${
              testResults.status === 'success' ? 'text-emerald-900' :
              testResults.status === 'warning' ? 'text-amber-900' :
              'text-red-900'
            }`}>Detailed Report</h4>
            <ul className="space-y-2 pl-2">
              {testResults.details.map((detail, idx) => (
                <li key={idx} className={`text-sm flex items-start gap-2 ${
                  testResults.status === 'success' ? 'text-emerald-700' :
                  testResults.status === 'warning' ? 'text-amber-700' :
                  'text-red-700'
                }`}>
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
