import { fetchOne } from '@/services/fetchData/api-client';
import type { PromotionProps } from '@/types';

export const BASE = '/promotion'

export const getPromotionImage = async():Promise<PromotionProps[]> => {
    return fetchOne<PromotionProps[]>(`${BASE}/fetch`)
}