import { campaignsModule } from "./module/campaigns";
import { measurementsModule } from "./module/litterTypes";
import { observationModule } from "./module/observations";
import { userModule } from "./module/user";
import { settingsModule } from "./module/settings";

const localStorage = {
  ...campaignsModule,
  ...measurementsModule,
  ...observationModule,
  ...userModule,
  ...settingsModule
};

export default localStorage;
