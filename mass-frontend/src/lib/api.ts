import type { SimulateRequest, SimulationJob } from '@/types/simulation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * POST /simulate — kicks off a background simulation job.
 * Returns { job_id, status: "pending" }.
 */
export async function startSimulation(data: SimulateRequest): Promise<SimulationJob> {
  const res = await fetch(`${API_URL}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Simulation failed to start: ${err}`);
  }

  return res.json();
}

/**
 * GET /simulate/{job_id} — polls job status.
 * Returns { job_id, status, result?, error? }.
 */
export async function getSimulationStatus(jobId: string): Promise<SimulationJob> {
  const res = await fetch(`${API_URL}/simulate/${jobId}`);

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Simulation job not found');
    }
    const err = await res.text();
    throw new Error(`Failed to fetch status: ${err}`);
  }

  return res.json();
}
