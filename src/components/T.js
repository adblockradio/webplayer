import React from "react";
import PropTypes from "prop-types";
import { LocaleContext } from "../LocaleContext";

import { translate } from "../helpers/locale";

function T(props) {
	const { str, children } = props;

	return <LocaleContext.Consumer>{value => children ? children(translate(value, str)) : translate(value, str)}</LocaleContext.Consumer>;
}

T.defaultProps = {
	children: null,
};

T.propTypes = {
	str: PropTypes.string.isRequired,
	children: PropTypes.func,
};

export default React.memo(T);
