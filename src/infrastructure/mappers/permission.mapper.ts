import { Permission } from "domain/entities/permission";
import { createMap } from "@automapper/core";
import { PermissionDto } from "application/dto/permission.dto";
import { mapper } from "./autoMapper";

createMap(mapper, Permission, PermissionDto);
