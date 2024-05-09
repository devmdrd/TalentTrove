import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegistrationSuccess() {

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Verification pending...</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Profile Under Review</p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Thank you for submitting your profile. Our team is currently reviewing it, and we will be in touch soon.
            Please check back later for updates.
          </p>
        </div>
      </div>
    </div>
  );
}
