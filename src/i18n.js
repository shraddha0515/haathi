import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
    en: {
        translation: {
            "dashboard_title": "User Dashboard",
            "status_active": "Status: Active",
            "live_map": "Live Map",
            "notifications": "Notifications",
            "no_notifications": "No new notifications",
            "danger_alert": "DANGER: Elephant detected nearby!",
            "safe_status": "You are in a safe zone.",
            "switch_language": "हिंदी में बदलें",
            "welcome": "Welcome",
            "logout": "Logout"
        },
    },
    hi: {
        translation: {
            "dashboard_title": "उपयोगकर्ता डैशबोर्ड",
            "status_active": "स्थिति: सक्रिय",
            "live_map": "लाइव मैप",
            "notifications": "सूचनाएं",
            "no_notifications": "कोई नई सूचना नहीं",
            "danger_alert": "खतरा: हाथी पास में देखा गया है!",
            "safe_status": "आप सुरक्षित क्षेत्र में हैं।",
            "switch_language": "Switch to English",
            "welcome": "स्वागत है",
            "logout": "लॉग आउट"
        },
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
