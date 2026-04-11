import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      login: "Login",
      signup: "Signup",
      newPatient: "New Patient",
      dashboard: "Dashboard",
      emergency: "Emergency",
    },
  },
  hi: {
    translation: {
      welcome: "स्वागत है",
      login: "लॉगिन",
      signup: "साइनअप",
      newPatient: "नया मरीज",
      dashboard: "डैशबोर्ड",
      emergency: "आपातकाल",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("lang") || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;