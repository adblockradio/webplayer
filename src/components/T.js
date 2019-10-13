import React from "react";
import PropTypes from "prop-types";
import { LocaleContext } from "../LocaleContext";

import en from "../locales/en.json";
import fr from "../locales/fr.json";

const langs = {
	en,
	fr,
};

function T(props) {
	const { str } = props;

	return <LocaleContext.Consumer>{value => langs[value][str]}</LocaleContext.Consumer>;
}

T.propTypes = {
	str: PropTypes.string.isRequired,
};

export default React.memo(T);
