import { useState, useEffect } from "react";

import consts from "../consts";

const { breakpoints } = consts;

export function useBreakpoint(size) {
	const mediaQuery = window.matchMedia(`(min-width: ${breakpoints[size]}px)`);

	const [value, setValue] = useState(mediaQuery.matches);

	useEffect(() => {
		const handler = () => setValue(mediaQuery.matches);
		mediaQuery.addListener(handler);
		return () => mediaQuery.removeListener(handler);
	}, []);

	return value;
}

export default {
	useBreakpoint
};
