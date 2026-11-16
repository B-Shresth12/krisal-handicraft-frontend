/**
 * Krisal Handicraft Checkout Validation Schema
 * Form validation powered by Zod and integrated with React Hook Form.
 */

import { z } from 'zod';

export const checkoutSchema = z
  .object({
    // Shipping details
    fullName: z
      .string()
      .trim()
      .min(2, { message: 'Full name must be at least 2 characters.' })
      .max(80, { message: 'Full name cannot exceed 80 characters.' }),
    email: z
      .string()
      .trim()
      .min(1, { message: 'Email address is required.' })
      .email({ message: 'Please enter a valid notification email address.' }),
    phone: z
      .string()
      .trim()
      .min(7, { message: 'Please provide a valid courier contact phone number.' })
      .max(18, { message: 'Phone number cannot exceed 18 characters.' }),
    address: z
      .string()
      .trim()
      .min(5, { message: 'Street delivery address is required.' }),
    city: z
      .string()
      .trim()
      .min(2, { message: 'City is required.' }),
    province: z
      .string()
      .trim()
      .min(2, { message: 'Province/State is required.' }),
    postalCode: z
      .string()
      .trim()
      .min(2, { message: 'Postal/Zip code is required.' }),
    country: z
      .string()
      .trim()
      .min(2, { message: 'Country is required.' }),
    orderNotes: z
      .string()
      .max(400, { message: 'Notes cannot exceed 400 characters.' })
      .optional()
      .or(z.literal('')),

    // Billing address toggle
    useShippingForBilling: z.boolean(),

    // Separate billing fields (optional when useShippingForBilling is true)
    billingFullName: z.string().optional(),
    billingAddress: z.string().optional(),
    billingCity: z.string().optional(),
    billingProvince: z.string().optional(),
    billingPostalCode: z.string().optional(),
    billingCountry: z.string().optional(),

    // Shipping & Payment selection
    deliveryMethod: z.enum(['standard', 'express'], {
      message: 'Please select a delivery method.',
    }),
    paymentMethod: z.enum(['cod', 'fonepay', 'card'], {
      message: 'Please select a payment method.',
    }),

    // Simulated card fields (purely cosmetic simulation)
    simCardName: z.string().optional(),
    simCardNumber: z.string().optional(),
    simCardExpiry: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // If separate billing is selected, validate billing fields
    if (!data.useShippingForBilling) {
      if (!data.billingFullName || data.billingFullName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['billingFullName'],
          message: 'Billing name is required.',
        });
      }
      if (!data.billingAddress || data.billingAddress.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['billingAddress'],
          message: 'Billing street address is required.',
        });
      }
      if (!data.billingCity || data.billingCity.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['billingCity'],
          message: 'Billing city is required.',
        });
      }
    }

    // If card payment is chosen in demo, ensure demo cardholder name is entered
    if (data.paymentMethod === 'card') {
      if (!data.simCardName || data.simCardName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['simCardName'],
          message: 'Name on card is required for demo simulation.',
        });
      }
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
