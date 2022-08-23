import { setIsWelcomeMessageVisible } from "./index";
import { Thunk } from "../../store";


export const loadSettings: Thunk = () => async (
    dispatch,
    _,
    { localStorage }
  ) => {
    const settings  = await localStorage.getSettings()

    if (settings) {
        dispatch(setIsWelcomeMessageVisible(settings.isWelcomeMessageVisible));
    }
    else dispatch(setIsWelcomeMessageVisible(true))
    
  };
  

export const disbaleWelcomeMessage: Thunk = () => async (
  dispatch,
  _,
  { localStorage }
) => {
    const settings  = await localStorage.getSettings()
    if (settings) { 
        const newSettings = {...settings, isWelcomeMessageVisible: false}
        await localStorage.saveSettings(newSettings);
    } else {
        await localStorage.saveSettings({isWelcomeMessageVisible: false});
    }
    dispatch(setIsWelcomeMessageVisible(false));
};
