import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { EnquiryPayload } from '@/lib/types'

export function useEnquiry() {
  return useMutation({
    mutationFn: (data: EnquiryPayload) => api.submitEnquiry(data),
  })
}
