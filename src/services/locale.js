import en from "../locales/en.json";
import fr from "../locales/fr.json";

const langs = {
	en,
	fr
};

export const translate = function(lang, str) {
	return langs[lang][str];
};

export default {
	translate
};
