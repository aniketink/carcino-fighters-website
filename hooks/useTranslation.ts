import { useLanguage } from "@/components/LanguageProvider";
import { translations, Language } from "@/lib/translations";

export function useTranslation() {
    const { language } = useLanguage();

    // Fallback to English if language is not found (though types prevent this)
    const currentLanguage = (language as Language) || 'en';

    return {
        t: translations[currentLanguage],
        language: currentLanguage
    };
}
