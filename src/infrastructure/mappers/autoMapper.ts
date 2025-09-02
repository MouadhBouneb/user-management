import { Mapper, createMapper } from "@automapper/core";
import { classes } from "@automapper/classes";
import "reflect-metadata";

export const mapper: Mapper = createMapper({
  strategyInitializer: classes(),
});

import "./user.mapper";
import "./role.mapper";
import "./permission.mapper";
