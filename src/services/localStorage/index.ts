import { campaignsModule } from "./module/campaigns";
import { featureTypesModule } from "./module/featureTypes";
import { observationModule } from "./module/observations";
import { userModule } from "./module/user";

const localStorage = {
  ...campaignsModule,
  ...featureTypesModule,
  ...observationModule,
  ...userModule,
};

export default localStorage;
