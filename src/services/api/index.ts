import { userModule } from "./module/user";
import { observationsModule } from "./module/observations";
import { featureTypesModule } from "./module/featureTypes";
import { campaignsModule } from "./module/campaigns";

const api = {
  ...observationsModule,
  ...featureTypesModule,
  ...campaignsModule,
  ...userModule,
};

export default api;
