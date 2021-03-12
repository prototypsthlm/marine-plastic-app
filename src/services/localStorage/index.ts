import { campaignsModule } from "./module/campaigns";
import { measurementsModule } from "./module/litterTypes";
import { observationModule } from "./module/observations";
import { userModule } from "./module/user";

const localStorage = {
  ...campaignsModule,
  ...measurementsModule,
  ...observationModule,
  ...userModule,
};

export default localStorage;
