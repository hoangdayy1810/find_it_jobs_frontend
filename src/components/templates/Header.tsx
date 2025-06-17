"use client";
import React, { useEffect, useState } from "react";
import Button_Header from "../atoms/Button_Header";
import Search_Header from "../atoms/Search_Header";
import Logo from "../atoms/Logo";
import NavBar from "../organisms/NavBar";
import LanguageSwitcher from "../atoms/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { useCandidate, useEmployer, useTag } from "@/contexts/AppContext";
import { observer } from "mobx-react-lite";
import ProvinceSelect from "../molecules/ProvineSelect";

const Header = observer(() => {
  const t = useTranslations();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProvine, setCurrentProvine] = useState("all");
  const candidateStore = useCandidate();
  const employerStore = useEmployer();
  const tagStore = useTag();

  let srcImg;
  if (candidateStore && candidateStore.candidate?.avatar) {
    srcImg = candidateStore.candidate.avatar;
  }
  if (employerStore && employerStore.employer?.logo) {
    srcImg = employerStore.employer.logo;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 35);
    };

    window.addEventListener("scroll", handleScroll);
    const savedProvine = localStorage.getItem("currentProvine");
    if (savedProvine) {
      setCurrentProvine(savedProvine);
    }
    setIsLoading(true);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("currentProvine", currentProvine);
    const fetchData = async () => {
      const result = await tagStore?.postCurrentProvine(currentProvine);
      console.log("result", result);
    };
    fetchData();
  }, [currentProvine]);

  return (
    <div className="bg-[#FFFFFF]">
      <div className="relative mx-auto hidden md:block">
        <div className="flex justify-start items-center">
          <div className="w-1/4">
            <Logo style="w-64" src="/images/Logo.png" />
          </div>
          <div className="w-full flex justify-between items-center">
            <div className="w-3/4 p-3 flex space-x-4">
              <div className="w-1/6">
                <ProvinceSelect
                  value={currentProvine}
                  onChange={(selectedValue: any, option: any) => {
                    console.log(selectedValue);
                    setCurrentProvine(selectedValue);
                  }}
                />
              </div>
              <div className="w-full">
                <Search_Header />
              </div>
            </div>

            <div className="w-1/5 flex justify-around items-center py-2 text-center">
              <Button_Header
                src="/images/header/ico_bell_regular.svg"
                text={t("header.notification")}
                style="mx-auto w-6 h-6"
                id="notification"
              />
              <Button_Header
                src={
                  srcImg && isLoading
                    ? srcImg
                    : "/images/header/ico_user_regular.svg"
                }
                text={t("header.user")}
                style={`mx-auto w-6 h-6 ${
                  srcImg && isLoading ? "rounded-full" : ""
                }`}
                id="account"
              />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto relative text-center bg-[#C92127] md:hidden">
        <div
          className={`transition-all duration-1000 ${
            isScrolled ? "opacity-0 h-0" : "opacity-100 h-auto"
          }`}
        >
          <Logo
            style="w-36 mx-auto pt-2 transition-all duration-300"
            src="/images/Logo.png"
          />
        </div>

        <div
          className={`w-full z-40 flex justify-around items-center bg-[#C92127] transition-all duration-300 ${
            isScrolled ? "fixed top-0 left-0 shadow-md" : "sticky top-0"
          }`}
        >
          <NavBar />

          <div className="w-4/5 p-2">
            <Search_Header />
          </div>

          <div className="w-1/6 flex justify-around items-center">
            <Button_Header
              src="/images/header/ico_bell_regular.svg"
              text=""
              style="w-8 mx-auto px-1"
              id="notification"
            />
            <Button_Header
              src="/images/header/ico_thongtintk.svg"
              text=""
              style="w-7 mx-auto px-1"
              id="account"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Header;
