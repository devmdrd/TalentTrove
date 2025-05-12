import React from "react";
import { FaSearch, FaUserAlt, FaCheckCircle } from "react-icons/fa";

function Features() {
  return (
    <section className="rounded-xl ">
      <div className="container px-6 py-10 mx-auto">
        <div className="lg:flex lg:items-center">
          <div className="w-full space-y-12 lg:w-1/2 ">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl ">
                explore our <br /> Job portal Find your next Dream job
              </h1>
              <div className="mt-2">
                <span className="inline-block w-40 h-1 bg-blue-500 rounded-full" />
                <span className="inline-block w-3 h-1 ml-1 bg-blue-500 rounded-full" />
                <span className="inline-block w-1 h-1 ml-1 bg-blue-500 rounded-full" />
              </div>
            </div>
            <div className="md:flex md:items-start md:-mx-4">
              <span className="inline-block p-2 text-blue-500 bg-blue-100 rounded-xl md:mx-4">
                <FaSearch className="text-2xl" />
              </span>
              <div className="mt-4 md:mx-4 md:mt-0">
                <h1 className="text-xl font-semibold text-gray-700 capitalize ">
                  Search & Filter Jobs
                </h1>
                <p className="mt-3 text-gray-500 ">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Provident ab nulla quod dignissimos vel non corrupti doloribus
                  voluptatum eveniet
                </p>
              </div>
            </div>
            <div className="md:flex md:items-start md:-mx-4">
              <span className="inline-block p-2 text-blue-500 bg-blue-100 rounded-xl md:mx-4">
                <FaUserAlt className="text-2xl" />
              </span>
              <div className="mt-4 md:mx-4 md:mt-0">
                <h1 className="text-xl font-semibold text-gray-700 capitalize ">
                  Zero Fees
                </h1>
                <p className="mt-3 text-gray-500 ">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Provident ab nulla quod dignissimos vel non corrupti doloribus
                  voluptatum eveniet
                </p>
              </div>
            </div>
            <div className="md:flex md:items-start md:-mx-4">
              <span className="inline-block p-2 text-blue-500 bg-blue-100 rounded-xl md:mx-4">
                <FaCheckCircle className="text-2xl" />
              </span>
              <div className="mt-4 md:mx-4 md:mt-0">
                <h1 className="text-xl font-semibold text-gray-700 capitalize ">
                  verified recruiters
                </h1>
                <p className="mt-3 text-gray-500 ">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Provident ab nulla quod dignissimos vel non corrupti doloribus
                  voluptatum eveniet
                </p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex lg:items-center lg:w-1/2 lg:justify-center">
            <img
              className="w-[28rem] h-[28rem] object-cover xl:w-[34rem] xl:h-[34rem] rounded-full"
              src="https://res.cloudinary.com/dprxebwil/image/upload/v1681571472/9365666_4149593_oovvzj.jpg"
              alt=""
            />
          </div>
        </div>
        <hr className="my-12 border-gray-200 " />
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
          <div className="flex items-center justify-center col-span-1 md:col-span-2 lg:col-span-1"></div>
          <div className="flex items-center justify-center col-span-1 md:col-span-2 lg:col-span-1"></div>
        </div>
      </div>
    </section>
  );
}

export default Features;
