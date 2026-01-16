'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quoteFormSchema, type QuoteFormData, formatPhoneNumber } from '@/lib/formValidation';
import { FormInput } from './ui/FormInput';
import { CustomSelect } from './ui/CustomSelect';
import { FormTextarea } from './ui/FormTextarea';
import { RadioGroup } from './ui/RadioGroup';

interface QuoteFormProps {
  onSubmit: (data: QuoteFormData) => Promise<void>;
}

export default function QuoteForm({ onSubmit }: QuoteFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    mode: 'onBlur',
    defaultValues: {
      state: undefined,
      facilityType: '',
      squareFootage: '',
      cleaningFrequency: '',
    },
  });

  const facilityType = watch('facilityType');
  const additionalDetails = watch('additionalDetails') || '';

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue('phone', formatted, { shouldValidate: true });
  };

  const validateStep1 = async () => {
    const isValid = await trigger(['fullName', 'email', 'phone', 'businessName']);
    if (isValid) {
      setStep(2);
      setSubmitError(null);
    }
  };

  const onFormSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(data);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again or call us at (555) 123-4567'
      );
      setIsSubmitting(false);
    }
  };

  const facilityTypeOptions = [
    { value: 'Car Dealership', label: 'Car Dealership' },
    { value: 'Office Building', label: 'Office Building' },
    { value: 'Retail Space', label: 'Retail Space' },
    { value: 'Medical Facility', label: 'Medical Facility' },
    { value: 'Warehouse/Industrial', label: 'Warehouse/Industrial' },
    { value: 'Other', label: 'Other' },
  ];

  const squareFootageOptions = [
    { value: 'Under 5,000 sq ft', label: 'Under 5,000 sq ft' },
    { value: '5,000 - 10,000 sq ft', label: '5,000 - 10,000 sq ft' },
    { value: '10,000 - 25,000 sq ft', label: '10,000 - 25,000 sq ft' },
    { value: '25,000 - 50,000 sq ft', label: '25,000 - 50,000 sq ft' },
    { value: 'Over 50,000 sq ft', label: 'Over 50,000 sq ft' },
    { value: 'Not sure', label: 'Not sure' },
  ];

  const cleaningFrequencyOptions = [
    { value: 'Daily', label: 'Daily' },
    { value: '2-3 times per week', label: '2-3 times per week' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Bi-weekly', label: 'Bi-weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'One-time deep clean', label: 'One-time deep clean' },
    { value: 'Not sure yet', label: 'Not sure yet' },
  ];

  const contactTimeOptions = [
    { value: 'Morning (8am-12pm)', label: 'Morning (8am-12pm)' },
    { value: 'Afternoon (12pm-5pm)', label: 'Afternoon (12pm-5pm)' },
    { value: 'Evening (5pm-8pm)', label: 'Evening (5pm-8pm)' },
    { value: 'Anytime', label: 'Anytime' },
  ];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="w-full">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-azul">
            Step {step} of 2
          </span>
          <span className="text-sm text-gray-500">
            {step === 1 ? '50%' : '100%'} Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-naranja h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Contact Information */}
      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold text-azul mb-2">Contact Information</h2>
            <p className="text-gray-600">Let's start with your basic information</p>
          </div>

          <FormInput
            label="Full Name"
            {...register('fullName')}
            error={errors.fullName?.message}
            required
            autoFocus
            placeholder="John Doe"
          />

          <FormInput
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            required
            placeholder="john@company.com"
          />

          <FormInput
            label="Phone Number"
            type="tel"
            {...register('phone')}
            onChange={handlePhoneChange}
            error={errors.phone?.message}
            required
            placeholder="(555) 123-4567"
            maxLength={17}
          />

          <FormInput
            label="Business/Company Name"
            {...register('businessName')}
            error={errors.businessName?.message}
            required
            placeholder="ABC Company Inc."
          />

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={validateStep1}
              className="px-8 py-3 bg-naranja text-blanco rounded-lg font-semibold hover:bg-[#d45a15] transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Service Details */}
      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold text-azul mb-2">Service Details</h2>
            <p className="text-gray-600">Tell us about your cleaning needs</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FormInput
              label="Street Address"
              {...register('streetAddress')}
              error={errors.streetAddress?.message}
              required
              placeholder="123 Main Street"
            />

            <FormInput
              label="City"
              {...register('city')}
              error={errors.city?.message}
              required
              placeholder="Sterling"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <CustomSelect
              label="State"
              name="state"
              value={watch('state')}
              onChange={(value) => setValue('state', value as 'DC' | 'Maryland' | 'Virginia', { shouldValidate: true })}
              error={errors.state?.message}
              required
              placeholder="Select state"
              options={[
                { value: 'DC', label: 'Washington DC' },
                { value: 'Maryland', label: 'Maryland' },
                { value: 'Virginia', label: 'Virginia' },
              ]}
            />

            <FormInput
              label="ZIP Code"
              {...register('zipCode')}
              error={errors.zipCode?.message}
              required
              placeholder="20164"
              maxLength={5}
              pattern="[0-9]{5}"
            />
          </div>

          <CustomSelect
            label="Facility Type"
            name="facilityType"
            value={watch('facilityType')}
            onChange={(value) => setValue('facilityType', value, { shouldValidate: true })}
            error={errors.facilityType?.message}
            required
            placeholder="Select facility type"
            options={facilityTypeOptions}
          />

          {facilityType === 'Other' && (
            <FormInput
              label="Please specify"
              {...register('facilityTypeOther', {
                required: facilityType === 'Other' ? 'Please specify the facility type' : false,
                minLength: facilityType === 'Other' ? { value: 2, message: 'Please enter at least 2 characters' } : undefined,
              })}
              error={errors.facilityTypeOther?.message}
              required={facilityType === 'Other'}
              placeholder="Enter facility type"
            />
          )}

          <CustomSelect
            label="Approximate Square Footage"
            name="squareFootage"
            value={watch('squareFootage')}
            onChange={(value) => setValue('squareFootage', value, { shouldValidate: true })}
            error={errors.squareFootage?.message}
            required
            placeholder="Select square footage"
            options={squareFootageOptions}
          />

          <RadioGroup
            label="Cleaning Frequency"
            name="cleaningFrequency"
            value={watch('cleaningFrequency')}
            onChange={(value) => setValue('cleaningFrequency', value, { shouldValidate: true })}
            error={errors.cleaningFrequency?.message}
            required
            options={cleaningFrequencyOptions}
          />

          <RadioGroup
            label="Best Time to Contact"
            name="bestTimeToContact"
            value={watch('bestTimeToContact')}
            onChange={(value) => setValue('bestTimeToContact', value)}
            options={contactTimeOptions}
          />

          <FormTextarea
            label="Additional Details"
            {...register('additionalDetails')}
            error={errors.additionalDetails?.message}
            placeholder="Tell us about any specific cleaning needs, areas of focus, or special requirements..."
            characterLimit={500}
            currentLength={additionalDetails.length}
          />

          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
          )}

          <div className="flex gap-4 justify-between pt-4">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setSubmitError(null);
              }}
              className="px-8 py-3 border-2 border-gray-300 text-azul rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-naranja text-blanco rounded-lg font-semibold hover:bg-[#d45a15] transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Request Free Quote'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Honeypot field for spam prevention */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: 'absolute', left: '-9999px' }}
        aria-hidden="true"
      />
    </form>
  );
}
