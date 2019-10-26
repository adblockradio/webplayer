import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import breakpoint from "../../helpers/breakpoint";

// I didn't success to refer directly to the Button component. So I used `a` & `button` instead.
const StyledGroupedButton = styled.div`
	display: flex;
	flex-direction: column;

	& > button,
	& > a {
		${breakpoint.max.l`
			&:first-child {
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
				margin-bottom: 0;
			}
			&:not(:first-child):not(:last-child) {
				border-radius: 0;
				margin-top: 0;
				margin-bottom: 0;
			}
			&:last-child {
				border-top-left-radius: 0;
				border-top-right-radius: 0;
				margin-top: 0;
			}
		`}
	}
`;

function GroupedButtons(props) {
	const { children, className, spaced } = props;

	return (
		<StyledGroupedButton className={className} spaced={spaced}>
			{children}
		</StyledGroupedButton>
	);
}

GroupedButtons.defaultProps = {
	className: null,
	spaced: false
};

GroupedButtons.propTypes = {
	className: PropTypes.string,
	spaced: PropTypes.bool,
	children: PropTypes.array.isRequired
};

export default GroupedButtons;
