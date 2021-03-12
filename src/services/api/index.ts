import { userModule } from "./module/user";
import { observationsModule } from "./module/observations";
import { measurementsModule } from "./module/measurements";
import { litterTypesModule } from "./module/litterTypes";
import { campaignsModule } from "./module/campaigns";

const api = {
  ...observationsModule,
  ...measurementsModule,
  ...litterTypesModule,
  ...campaignsModule,
  ...userModule,
};

export default api;
