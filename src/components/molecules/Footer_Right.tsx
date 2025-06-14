import React from "react";
import Footer_List_Li from "../atoms/Footer_List_Li";

const Footer_Right = ({ t }: { t: any }) => {
  return (
    <div className="mt-2 md:mt-0 md:pl-10">
      <div className="grid gap-4 lg:grid-cols-3 grid-cols-2 md:gap-16">
        <div>
          <div className="mb-2">
            <h3 className="font-bold text-lg">
              {t("footer.footer-right.service.name").toUpperCase()}
            </h3>
          </div>
          <div>
            <ul>
              <Footer_List_Li text={t("footer.footer-right.service.item-1")} />
              <Footer_List_Li text={t("footer.footer-right.service.item-2")} />
              <Footer_List_Li text={t("footer.footer-right.service.item-3")} />
              <Footer_List_Li text={t("footer.footer-right.service.item-4")} />
            </ul>
          </div>
        </div>
        <div>
          <div className="mb-2">
            <h3 className="font-bold text-lg">
              {t("footer.footer-right.support.name").toUpperCase()}
            </h3>
          </div>
          <div>
            <ul>
              <Footer_List_Li text={t("footer.footer-right.support.item-1")} />
              <Footer_List_Li text={t("footer.footer-right.support.item-2")} />
              <Footer_List_Li text={t("footer.footer-right.support.item-3")} />
            </ul>
          </div>
        </div>
        <div>
          <div className="mb-2">
            <h3 className="font-bold text-lg">
              {t("footer.footer-right.my-account.name").toUpperCase()}
            </h3>
          </div>
          <div>
            <ul>
              <Footer_List_Li
                text={t("footer.footer-right.my-account.item-1")}
              />
              <Footer_List_Li
                text={t("footer.footer-right.my-account.item-2")}
              />
              <Footer_List_Li
                text={t("footer.footer-right.my-account.item-3")}
              />
              <Footer_List_Li
                text={t("footer.footer-right.my-account.item-4")}
              />
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2">
          <h3 className="font-bold text-lg">
            {t("footer.footer-right.contact.name").toUpperCase()}
          </h3>
        </div>
        <div>
          <ul className="grid grid-cols-1 md:grid-cols-3 md:gap-16">
            <li className="text-sm py-2">
              <i className="fa-solid fa-location-dot fa-lg mr-1"></i>
              {t("footer.footer-right.contact.item-1")}
            </li>
            <li className="text-sm py-2">
              <i className="fa-solid fa-envelope fa-lg mr-1"></i>
              {t("footer.footer-right.contact.item-3")}
            </li>
            <li className="text-sm py-2">
              <i className="fa-solid fa-phone fa-lg mr-1"></i>
              {t("footer.footer-right.contact.item-2")}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer_Right;
