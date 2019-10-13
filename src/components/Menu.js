import React, { useCallback } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Sidebar from "./Layout/Sidebar";
import GroupedButtons from "./Layout/GroupedButtons";
import Button from "./Controls/Button";
import T from "./T";

import musicIcon from "../img/type/1music.png";
import speechIcon from "../img/type/2speech.png";
import adsIcon from "../img/type/3ads.png";
import mute from "../img/action/mute.png";
import podium from "../img/action/podium.png";
import roundabout from "../img/action/roundabout.png";
import wand from "../img/wand.png";
import ratings from "../img/ratings100.png";
import flagIcon from "../img/flag2.svg";
import donate from "../img/donate_2226736.svg";

import consts from "../consts.js";

const StyledTitle = styled.div`
	color: white;
	font-weight: bold;
	font-size: 23px;
`;

const StyledGroupedButtons = styled(GroupedButtons)`
	margin-bottom: 40px;
	${props => props.condensed && "margin-bottom: 10px;"}
`;
const StyledButtons = styled(Button)`
	margin-bottom: 15px;
`;

const Hint = styled.div`
	color: white;
	font-size: 16px;
	margin: 5px;
`;

function Menu(props) {
	const { condensed, filterType, actionType, bsw, showOnboarding, showFeedback, showFlag } = props;

	const setFilterMusic = useCallback(() => bsw.changeFilterType(consts.FILTER_MUSIC), []);
	const setFilterSpeech = useCallback(() => bsw.changeFilterType(consts.FILTER_SPEECH), []);
	const setFilterOff = useCallback(() => bsw.changeFilterType(consts.FILTER_OFF), []);

	const setActionMute = useCallback(() => bsw.changeActionType(consts.ACTION_MUTE), []);
	const setActionPodium = useCallback(() => bsw.changeActionType(consts.ACTION_PODIUM), []);
	const setActionRoundabout = useCallback(() => bsw.changeActionType(consts.ACTION_ROUNDABOUT), []);

	// TODO: Migrate Sidebar isOpened argument to React.Context?
	return (
		<Sidebar condensed={condensed}>
			{isOpened => (
				<>
					{(!condensed || isOpened) && <StyledTitle><T str="menu.filter.title" /></StyledTitle>}

					<StyledGroupedButtons condensed={condensed}>
						<Button
							label={<T str="menu.filter.music" />}
							icon={musicIcon}
							iconOnly={!isOpened}
							condensed={condensed}
							active={filterType === consts.FILTER_MUSIC}
							onClick={setFilterMusic}
						/>
						<Button
							label={<T str="menu.filter.speech" />}
							icon={speechIcon}
							iconOnly={!isOpened}
							condensed={condensed}
							active={filterType === consts.FILTER_SPEECH}
							onClick={setFilterSpeech}
						/>
						<Button
							label={<T str="menu.filter.ads" />}
							icon={adsIcon}
							iconOnly={!isOpened}
							condensed={condensed}
							active={filterType === consts.FILTER_OFF}
							onClick={setFilterOff}
						/>
					</StyledGroupedButtons>

					{(!condensed || isOpened) && <StyledTitle>{<T str="menu.action.title" />}</StyledTitle>}

					<StyledGroupedButtons condensed={condensed}>
						<Button
							label={<T str="menu.action.mute" />}
							icon={mute}
							iconOnly={!isOpened}
							condensed={condensed}
							active={actionType === consts.ACTION_MUTE}
							onClick={setActionMute}
							disabled={filterType === consts.FILTER_OFF}
						/>

						<Button
							label={<T str="menu.action.podium" />}
							icon={podium}
							iconOnly={!isOpened}
							condensed={condensed}
							active={actionType === consts.ACTION_PODIUM}
							onClick={setActionPodium}
							disabled={filterType === consts.FILTER_OFF}
						/>

						<Button
							label={<T str="menu.action.roundabout" />}
							icon={roundabout}
							iconOnly={!isOpened}
							condensed={condensed}
							active={actionType === consts.ACTION_ROUNDABOUT}
							onClick={setActionRoundabout}
							disabled={filterType === consts.FILTER_OFF}
						/>
					</StyledGroupedButtons>

					<GroupedButtons spaced={true} condensed={condensed}>
						<StyledButtons
							icon={wand}
							label={<T str="menu.settings" />}
							iconOnly={!isOpened}
							condensed={condensed}
							onClick={showOnboarding}
						/>

						<StyledButtons
							icon={flagIcon}
							label={<T str="menu.flag" />}
							iconOnly={!isOpened}
							condensed={condensed}
							onClick={showFlag}
						/>

						<StyledButtons
							icon={ratings}
							label={<T str="menu.suggest" />}
							iconOnly={!isOpened}
							condensed={condensed}
							onClick={showFeedback}
						/>

						<T str="menu.donate.url">
							{value => <StyledButtons
								icon={donate}
								label={<T str="menu.donate" />}
								iconOnly={!isOpened}
								condensed={condensed}
								href={value}
							/>}
						</T>
					</GroupedButtons>

					{condensed && isOpened && <Hint><T str="menu.hint" /></Hint>}
				</>
			)}
		</Sidebar>
	);
}

Menu.defaults = {};

Menu.propTypes = {
	condensed: PropTypes.bool.isRequired,
	filterType: PropTypes.number.isRequired,
	actionType: PropTypes.number.isRequired,
	bsw: PropTypes.object.isRequired,
	showOnboarding: PropTypes.func.isRequired,
	showFeedback: PropTypes.func.isRequired,
	showFlag: PropTypes.func.isRequired
};

export default React.memo(Menu, (prev, next) => {
	// Only those props can rerender this component!
	return (
		prev.condensed === next.condensed &&
		prev.filterType === next.filterType &&
		prev.actionType === next.actionType
	);
});
