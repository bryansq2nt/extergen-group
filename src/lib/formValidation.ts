import { z } from 'zod';

// Phone number validation - accepts various formats and normalizes to (XXX) XXX-XXXX
const phoneRegex = /^[\d\s\-\(\)]+$/;

export const quoteFormSchema = z.object({
  // Step 1: Contact Information
  fullName: z.string().min(2, 'Please enter your full name').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .regex(phoneRegex, 'Please enter a valid phone number'),
  businessName: z.string().min(2, 'Please enter your business name').max(100),

  // Step 2: Service Details
  streetAddress: z.string().min(5, 'Please enter a valid street address').max(200),
  city: z.string().min(2, 'Please enter a valid city').max(100),
  state: z.enum(['DC', 'Maryland', 'Virginia'], {
    required_error: 'Please select a state',
  }),
  zipCode: z.string().regex(/^\d{5}$/, 'Please enter a valid 5-digit ZIP code'),
  facilityType: z.string().min(1, 'Please select a facility type'),
  facilityTypeOther: z.string().optional(),
  squareFootage: z.string().min(1, 'Please select approximate square footage'),
  cleaningFrequency: z.string().min(1, 'Please select cleaning frequency'),
  bestTimeToContact: z.string().optional(),
  additionalDetails: z.string().max(500, 'Additional details must be 500 characters or less').optional(),
}).refine(
  (data) => {
    // If facilityType is "Other", facilityTypeOther is required
    if (data.facilityType === 'Other') {
      return data.facilityTypeOther && data.facilityTypeOther.length >= 2;
    }
    return true;
  },
  {
    message: 'Please specify the facility type',
    path: ['facilityTypeOther'],
  }
);

export type QuoteFormData = z.infer<typeof quoteFormSchema>;

// Format phone number to (XXX) XXX-XXXX
export function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length === 0) return '';
  if (numbers.length <= 3) return `(${numbers}`;
  if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
}
