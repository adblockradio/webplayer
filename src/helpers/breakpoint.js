import { css } from "styled-components";

import consts from "../consts";

const { breakpoints } = consts;

export const min = Object.keys(breakpoints).reduce((acc, label) => {
	acc[label] = (...args) => css`
		@media (min-width: ${breakpoints[label]}px) {
			${css(...args)};
		}
	`;
	return acc;
}, {});

export const max = Object.keys(breakpoints).reduce((acc, label) => {
	acc[label] = (...args) => css`
		@media (max-width: ${breakpoints[label] - 1}px) {
			${css(...args)};
		}
	`;
	return acc;
}, {});

export default { min, max };
