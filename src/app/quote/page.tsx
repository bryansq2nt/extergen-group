'use client';

import { useState } from 'react';
import Link from 'next/link';
import QuoteForm from '@/components/QuoteForm';
import { type QuoteFormData } from '@/lib/formValidation';

export default function QuotePage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<QuoteFormData | null>(null);

  const handleSubmit = async (data: QuoteFormData) => {
    try {
      const response = await fetch('/api/submit-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit quote request');
      }

      setSubmittedData(data);
      setIsSuccess(true);
    } catch (error) {
      throw error;
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-azul via-azul to-azul/90 py-20">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="bg-blanco rounded-2xl shadow-2xl p-8 md:p-12 text-center">
              {/* Success Animation */}
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-scale-in">
                  <svg
                    className="w-12 h-12 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-azul mb-4">
                Thank You!
              </h1>
              <p className="text-xl text-gray-700 mb-2">
                We've received your quote request
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our team will contact you within 24 hours to discuss your cleaning needs.
              </p>

              {submittedData?.email && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">
                    A confirmation email has been sent to{' '}
                    <span className="font-semibold text-azul">{submittedData.email}</span>
                  </p>
                </div>
              )}

              <Link
                href="/"
                className="inline-block bg-naranja text-blanco px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#d45a15] transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-azul via-azul to-azul/90 py-12 md:py-20">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blanco/90 hover:text-naranja transition-colors duration-200 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-blanco mb-2">
            Request Your Free Quote
          </h1>
          <p className="text-xl text-blanco/90">
            Get a customized cleaning solution for your business
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-blanco rounded-2xl shadow-2xl p-6 md:p-10">
            <QuoteForm onSubmit={handleSubmit} />
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center text-blanco/80">
            <p className="text-sm">
              🔒 Your information is secure and will never be shared
            </p>
            <p className="text-sm mt-2">
              Questions? Call us at{' '}
              <a href="tel:+1234567890" className="text-naranja hover:underline">
                (555) 123-4567
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
