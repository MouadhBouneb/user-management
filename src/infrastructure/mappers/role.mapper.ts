import { Role } from "domain/entities/role";
import "./permission.mapper"; // ensure permission mapping exists
import { RoleDto } from "application/dto/role.dto";
import { createMap, forMember, mapFrom } from "@automapper/core";
import { mapper } from "./autoMapper";

createMap(
  mapper,
  Role,
  RoleDto,
  forMember(
    (dest) => dest.permissions,
    mapFrom((src) => src.permissions)
  )
);
