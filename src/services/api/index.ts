import { userModule } from "./module/user";
import { observationsModule } from "./module/observations";
import { featuresModule } from "./module/features";
import { featureTypesModule } from "./module/featureTypes";
import { campaignsModule } from "./module/campaigns";

const api = {
  ...observationsModule,
  ...featuresModule,
  ...featureTypesModule,
  ...campaignsModule,
  ...userModule,
};

export default api;
