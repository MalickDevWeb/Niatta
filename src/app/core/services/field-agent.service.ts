import { Injectable, inject } from '@angular/core';
import { ApiResponse, ApiService } from './api.service';
import { Observable, map } from 'rxjs';

export interface FieldTask {
  id: string;
  price: number;
  productName: string;
  shopName?: string;
  latitude: number;
  longitude: number;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  createdAt: string;
  storeImageUrl?: string;
  observationPhotoUrl?: string;
  address?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FieldAgentService {
  private apiService = inject(ApiService);

  getTasks(): Observable<ApiResponse<FieldTask[]>> {
    return this.apiService.get<any[]>('/field-agent/tasks').pipe(
      map(res => {
        if (!res.success) return res as unknown as ApiResponse<FieldTask[]>;
        const mappedData: FieldTask[] = res.data.map(item => ({
          id: item.id,
          price: item.price || 0,
          productName: item.productFormat?.product?.name ? `${item.productFormat.product.name} - ${item.productFormat.label}` : 'Produit inconnu',
          shopName: item.store?.name || 'Boutique inconnue',
          latitude: item.latitude || 0,
          longitude: item.longitude || 0,
          status: item.status === 'pending' ? 'PENDING' : item.status === 'confirmed' ? 'CONFIRMED' : 'REJECTED',
          createdAt: item.createdAt,
          storeImageUrl: item.store?.imageUrl,
          observationPhotoUrl: item.photoUrl,
          address: item.store?.address || item.neighborhood || item.city
        }));
        return { ...res, data: mappedData };
      })
    );
  }

  submitVerification(taskId: string, status: 'CONFIRMED' | 'REJECTED', notes?: string): Observable<ApiResponse<unknown>> {
    const isConfirmed = status === 'CONFIRMED';
    return this.apiService.post<unknown>(`/field-agent/tasks`, { 
      observationId: taskId, 
      isConfirmed, 
      comment: notes 
    });
  }
}

