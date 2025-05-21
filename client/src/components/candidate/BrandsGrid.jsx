import React from "react";
import { FaGoogle, FaFacebook, FaApple, FaMicrosoft, FaAmazon } from "react-icons/fa";
import { motion } from "framer-motion";

function BrandsGrid() {
  const brands = [
    { icon: <FaGoogle className="h-8 w-8 text-blue-500" />, name: "Google" },
    { icon: <FaFacebook className="h-8 w-8 text-blue-800" />, name: "Facebook" },
    { icon: <FaApple className="h-8 w-8 text-black" />, name: "Apple" },
    { icon: <FaMicrosoft className="h-8 w-8 text-green-600" />, name: "Microsoft" },
    { icon: <FaAmazon className="h-8 w-8 text-yellow-600" />, name: "Amazon" },
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center text-xl font-semibold leading-8 text-gray-600"
        >
          Trusted by top companies worldwide
        </motion.h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-3 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="col-span-1 flex flex-col items-center"
            >
              <div className="h-16 w-16 flex items-center justify-center rounded-lg bg-white shadow-md p-3">
                {brand.icon}
              </div>
              <p className="mt-3 text-sm font-medium text-gray-600">{brand.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrandsGrid;