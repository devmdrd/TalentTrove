import React from "react";
import { FaGoogle, FaFacebook, FaApple, FaMicrosoft, FaAmazon } from "react-icons/fa"; 

function BrandsGrid() {
  return (
    <div className="py-24 sm:py-32 rounded-xl">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
          Trusted by the world’s most innovative teams
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <div className="col-span-2 max-h-12 w-full flex justify-center items-center lg:col-span-1">
            <FaGoogle className="h-12 w-12 text-blue-500" />
          </div>
          <div className="col-span-2 max-h-12 w-full flex justify-center items-center lg:col-span-1">
            <FaFacebook className="h-12 w-12 text-blue-800" />
          </div>
          <div className="col-span-2 max-h-12 w-full flex justify-center items-center lg:col-span-1">
            <FaApple className="h-12 w-12 text-black" />
          </div>
          <div className="col-span-2 max-h-12 w-full flex justify-center items-center sm:col-start-2 lg:col-span-1">
            <FaMicrosoft className="h-12 w-12 text-green-600" />
          </div>
          <div className="col-span-2 col-start-2 max-h-12 w-full flex justify-center items-center sm:col-start-auto lg:col-span-1">
            <FaAmazon className="h-12 w-12 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandsGrid;
