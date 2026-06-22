import type { SimulateRequest, SimulationJob, AgentEvent } from '@/types/simulation';

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

/**
 * GET /simulate/{job_id}/stream — opens an SSE connection for real-time events.
 * Returns a cleanup function to close the connection.
 */
export function streamSimulation(
  jobId: string,
  onEvent: (event: AgentEvent) => void,
  onError?: (error: Event) => void
): () => void {
  const url = `${API_URL}/simulate/${jobId}/stream`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (e) => {
    try {
      const event: AgentEvent = JSON.parse(e.data);
      onEvent(event);
    } catch {
      console.warn('Failed to parse SSE event:', e.data);
    }
  };

  eventSource.onerror = (e) => {
    if (onError) onError(e);
    eventSource.close();
  };

  // Return cleanup function
  return () => {
    eventSource.close();
  };
}

/**
 * GET /simulations — fetch past simulation history.
 */
export async function getSimulations(): Promise<any[]> {
  const res = await fetch(`${API_URL}/simulations`, { cache: 'no-store' });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to fetch simulations: ${err}`);
  }
  return res.json();
}

/**
 * GET /simulations/{id} — fetch a specific past simulation.
 */
export async function getSimulationById(id: string): Promise<any> {
  const res = await fetch(`${API_URL}/simulations/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Simulation not found');
    }
    const err = await res.text();
    throw new Error(`Failed to fetch simulation: ${err}`);
  }
  return res.json();
}
