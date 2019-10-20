import React, { useCallback } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import GroupedButtons from "./Layout/GroupedButtons";
import PopupFeedback from "./PopupFeedback";
import PopupFlag from "./PopupFlag";
import Sidebar from "./Layout/Sidebar";
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

import { useBreakpoint } from "../helpers/hooks";
import breakpoint from "../helpers/breakpoint";

import consts from "../consts.js";

const StyledTitle = styled.div`
	color: white;
	font-weight: bold;
	font-size: 23px;
`;

const StyledGroupedButtons = styled(GroupedButtons)`
	margin-bottom: 10px;

	${breakpoint.min.l`
		margin-bottom: 40px;
		width: 240px;
	`}

	${props => props.sidebarMobileOpened && "width: 240px;"}
	${props => props.margin && `margin-top: ${props.margin}px;`}
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
	const { filterType, actionType, bsw, showOnboarding } = props;

	const isDesktop = useBreakpoint("l");

	const setFilterMusic = useCallback(() => bsw.changeFilterType(consts.FILTER_MUSIC), []);
	const setFilterSpeech = useCallback(() => bsw.changeFilterType(consts.FILTER_SPEECH), []);
	const setFilterOff = useCallback(() => bsw.changeFilterType(consts.FILTER_OFF), []);

	const setActionMute = useCallback(() => bsw.changeActionType(consts.ACTION_MUTE), []);
	const setActionPodium = useCallback(() => bsw.changeActionType(consts.ACTION_PODIUM), []);
	const setActionRoundabout = useCallback(() => bsw.changeActionType(consts.ACTION_ROUNDABOUT), []);

	// TODO: Migrate Sidebar isOpened argument to React.Context?
	return (
		<Sidebar>
			{isOpened => (
				<>
					{(isDesktop || isOpened) && (
						<StyledTitle>
							<T str="menu.filter.title" />
						</StyledTitle>
					)}

					<StyledGroupedButtons sidebarMobileOpened={!isDesktop && isOpened}>
						<Button
							label={<T str="menu.filter.music" />}
							icon={musicIcon}
							iconOnly={!isOpened}
							active={filterType === consts.FILTER_MUSIC}
							onClick={setFilterMusic}
						/>
						<Button
							label={<T str="menu.filter.speech" />}
							icon={speechIcon}
							iconOnly={!isOpened}
							active={filterType === consts.FILTER_SPEECH}
							onClick={setFilterSpeech}
						/>
						<Button
							label={<T str="menu.filter.ads" />}
							icon={adsIcon}
							iconOnly={!isOpened}
							active={filterType === consts.FILTER_OFF}
							onClick={setFilterOff}
						/>
					</StyledGroupedButtons>

					{(isDesktop || isOpened) && (
						<StyledTitle>
							<T str="menu.action.title" />
						</StyledTitle>
					)}

					<StyledGroupedButtons sidebarMobileOpened={!isDesktop && isOpened}>
						<Button
							label={<T str="menu.action.mute" />}
							icon={mute}
							iconOnly={!isOpened}
							active={actionType === consts.ACTION_MUTE}
							onClick={setActionMute}
							disabled={filterType === consts.FILTER_OFF}
						/>

						<Button
							label={<T str="menu.action.podium" />}
							icon={podium}
							iconOnly={!isOpened}
							active={actionType === consts.ACTION_PODIUM}
							onClick={setActionPodium}
							disabled={filterType === consts.FILTER_OFF}
						/>

						<Button
							label={<T str="menu.action.roundabout" />}
							icon={roundabout}
							iconOnly={!isOpened}
							active={actionType === consts.ACTION_ROUNDABOUT}
							onClick={setActionRoundabout}
							disabled={filterType === consts.FILTER_OFF}
						/>
					</StyledGroupedButtons>

					<StyledGroupedButtons spaced={true} sidebarMobileOpened={!isDesktop && isOpened} margin={20}>
						<StyledButtons
							icon={wand}
							label={<T str="menu.settings" />}
							iconOnly={!isOpened}
							onClick={showOnboarding}
						/>

						<PopupFlag
							trigger={<StyledButtons icon={flagIcon} label={<T str="menu.flag" />} iconOnly={!isOpened} />}
							getUnmaintainedRadioList={bsw.getUnmaintainedRadioList}
							onOpened={bsw.sendFlag}
						/>

						<PopupFeedback
							trigger={<StyledButtons icon={ratings} label={<T str="menu.suggest" />} iconOnly={!isOpened} />}
							onSend={bsw.sendFeedback}
						/>

						<T str="menu.donate.url">
							{value => (
								<StyledButtons icon={donate} label={<T str="menu.donate" />} iconOnly={!isOpened} href={value} />
							)}
						</T>
					</StyledGroupedButtons>

					{!isDesktop && isOpened && (
						<Hint>
							<T str="menu.hint" />
						</Hint>
					)}
				</>
			)}
		</Sidebar>
	);
}

Menu.defaults = {};

Menu.propTypes = {
	filterType: PropTypes.number.isRequired,
	actionType: PropTypes.number.isRequired,
	bsw: PropTypes.object.isRequired,
	showOnboarding: PropTypes.func.isRequired
};

export default React.memo(Menu, (prev, next) => {
	// Only those props can rerender this component!
	return prev.filterType === next.filterType && prev.actionType === next.actionType;
});
