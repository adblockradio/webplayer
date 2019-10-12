import React, { useCallback } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import GroupedButtons from "./Layout/GroupedButtons";
import PopupFeedback from "./PopupFeedback";
import Sidebar from "./Layout/Sidebar";
import Button from "./Controls/Button";

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
	const { condensed, uiLang, filterType, actionType, bsw, showOnboarding, showFlag } = props;

	const filterTitle = { fr: "Je veux écouter\xa0:", en: "I want to listen to:" }[uiLang];

	const musicBtnLabel = { fr: "Musique", en: "Music only" }[uiLang];
	const speechBtnLabel = { fr: "Pas de pub", en: "Music & talk" }[uiLang];
	const adsBtnLabel = { fr: "Sans filtre", en: "Anything" }[uiLang];

	const setFilterMusic = useCallback(() => bsw.changeFilterType(consts.FILTER_MUSIC), []);
	const setFilterSpeech = useCallback(() => bsw.changeFilterType(consts.FILTER_SPEECH), []);
	const setFilterOff = useCallback(() => bsw.changeFilterType(consts.FILTER_OFF), []);

	const actionTitle = { fr: "En cas de pub…", en: "On ad detection…" }[uiLang];

	const muteBtnLabel = { fr: "Silence", en: "Mute" }[uiLang];
	const podiumBtnLabel = { fr: "Zappe & revient", en: "Hop & return" }[uiLang];
	const roundaboutBtnLabel = { fr: "Zappe & reste", en: "Hop & stay" }[uiLang];

	const setActionMute = useCallback(() => bsw.changeActionType(consts.ACTION_MUTE), []);
	const setActionPodium = useCallback(() => bsw.changeActionType(consts.ACTION_PODIUM), []);
	const setActionRoundabout = useCallback(() => bsw.changeActionType(consts.ACTION_ROUNDABOUT), []);

	const settingsBtnLabel = { fr: "Réglages", en: "Settings" }[uiLang];
	const bugBtnLabel = { fr: "Bug de filtrage\xa0?", en: "Filtering error?" }[uiLang];
	const suggestBtnLabel = { fr: "Vos suggestions", en: "Give feedback" }[uiLang];
	const donateBtnLabel = { fr: "Faites un don", en: "Donate" }[uiLang];

	const hintLabel = {
		fr:
			"Astuce: sur Chrome mobile, ce site est une application installable. Allez dans le menu et cliquez sur \"Ajouter à l'écran d'accueil\".",
		en:
			"Tip: on Chrome mobile, this website is an installable application. Open the menu and click on \"Add to home screen\"."
	}[uiLang];

	// TODO: Migrate Sidebar isOpened argument to React.Context?
	return (
		<Sidebar condensed={condensed}>
			{isOpened => (
				<>
					{(!condensed || isOpened) && <StyledTitle>{filterTitle}</StyledTitle>}

					<StyledGroupedButtons condensed={condensed}>
						<Button
							label={musicBtnLabel}
							icon={musicIcon}
							iconOnly={!isOpened}
							condensed={condensed}
							active={filterType === consts.FILTER_MUSIC}
							onClick={setFilterMusic}
						/>
						<Button
							label={speechBtnLabel}
							icon={speechIcon}
							iconOnly={!isOpened}
							condensed={condensed}
							active={filterType === consts.FILTER_SPEECH}
							onClick={setFilterSpeech}
						/>
						<Button
							label={adsBtnLabel}
							icon={adsIcon}
							iconOnly={!isOpened}
							condensed={condensed}
							active={filterType === consts.FILTER_OFF}
							onClick={setFilterOff}
						/>
					</StyledGroupedButtons>

					{(!condensed || isOpened) && <StyledTitle>{actionTitle}</StyledTitle>}

					<StyledGroupedButtons condensed={condensed}>
						<Button
							label={muteBtnLabel}
							icon={mute}
							iconOnly={!isOpened}
							condensed={condensed}
							active={actionType === consts.ACTION_MUTE}
							onClick={setActionMute}
							disabled={filterType === consts.FILTER_OFF}
						/>

						<Button
							label={podiumBtnLabel}
							icon={podium}
							iconOnly={!isOpened}
							condensed={condensed}
							active={actionType === consts.ACTION_PODIUM}
							onClick={setActionPodium}
							disabled={filterType === consts.FILTER_OFF}
						/>

						<Button
							label={roundaboutBtnLabel}
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
							label={settingsBtnLabel}
							iconOnly={!isOpened}
							condensed={condensed}
							onClick={showOnboarding}
						/>

						<StyledButtons
							icon={flagIcon}
							label={bugBtnLabel}
							iconOnly={!isOpened}
							condensed={condensed}
							onClick={showFlag}
						/>

						<PopupFeedback
							trigger={
								<StyledButtons icon={ratings} label={suggestBtnLabel} iconOnly={!isOpened} condensed={condensed} />
							}
							uiLang={uiLang}
							onSend={bsw.sendFeedback}
						/>

						<StyledButtons
							icon={donate}
							label={donateBtnLabel}
							iconOnly={!isOpened}
							condensed={condensed}
							href={`https://${uiLang}.liberapay.com/asto/donate`}
						/>
					</GroupedButtons>

					{condensed && isOpened && <Hint>{hintLabel}</Hint>}
				</>
			)}
		</Sidebar>
	);
}

Menu.defaults = {};

Menu.propTypes = {
	condensed: PropTypes.bool.isRequired,
	uiLang: PropTypes.string.isRequired,
	filterType: PropTypes.number.isRequired,
	actionType: PropTypes.number.isRequired,
	bsw: PropTypes.object.isRequired,
	showOnboarding: PropTypes.func.isRequired,
	showFlag: PropTypes.func.isRequired
};

export default React.memo(Menu, (prev, next) => {
	// Only those props can rerender this component!
	return (
		prev.condensed === next.condensed &&
		prev.uiLang === next.uiLang &&
		prev.filterType === next.filterType &&
		prev.actionType === next.actionType
	);
});
