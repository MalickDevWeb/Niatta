import { Injectable, inject } from '@angular/core';
import { ApiResponse, ApiService } from './api.service';
import { Observable } from 'rxjs';
import { User } from './auth.service';

export interface Verification {
  id: string;
  agentId: string;
  observationId: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  notes?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminFieldAgentService {
  private apiService = inject(ApiService);

  getAgents(): Observable<ApiResponse<User[]>> {
    return this.apiService.get<User[]>('/admin/field-agents');
  }

  createAgent(agent: Partial<User>): Observable<ApiResponse<User>> {
    return this.apiService.post<User>('/admin/field-agents', agent);
  }

  updateAgent(id: string, updates: Partial<User>): Observable<ApiResponse<User>> {
    return this.apiService.put<User>(`/admin/field-agents/${id}`, updates);
  }

  getVerifications(): Observable<ApiResponse<Verification[]>> {
    return this.apiService.get<Verification[]>('/admin/verifications');
  }
}
