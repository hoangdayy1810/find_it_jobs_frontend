import React from "react";
import Footer_Left from "../molecules/Footer_Left";
import Footer_Right from "../molecules/Footer_Right";

const Footer = () => {
  return (
    <div className="w-full p-4 text-black md:bg-[#FFFFFF]">
      <div className="mx-auto md:flex md:justify-center md:items-center md:w-5/6">
        <div className="md:w-1/3">
          <Footer_Left />
        </div>
        <div className="md:w-2/3">
          <Footer_Right />
        </div>
      </div>
    </div>
  );
};

export default Footer;
