import styled from "styled-components";

export const Title = styled.p`
	font-size: 36px;
	&.condensed {
		font-size: 26px;
	}
`;

export const SlideText = styled.p`
	font-size: 20px;
	&.condensed {
		font-size: 14px;
	}
`;

export const ChoiceList = styled.div`
	display: flex;
	flex-direction: column;
	margin: auto;
	margin-top: 2em;
	&.condensed {
		margin-top: 0;
	}
`;