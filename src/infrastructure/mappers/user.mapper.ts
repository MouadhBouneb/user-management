import { createMap, forMember, mapFrom } from "@automapper/core";
import { User } from "domain/entities/user";
import "./role.mapper";
import "./permission.mapper";
import { mapper } from "./autoMapper";
import { CreateUserDto, UserDto } from "../../application/dto/user.dto";
import { Email } from "domain/value-objects/email";
import { Password } from "domain/value-objects/password";
import { Permission } from "domain/entities/permission";
import { Role } from "domain/entities/role";

createMap(
  mapper,
  User,
  UserDto,
  forMember(
    (dest) => dest.id,
    mapFrom((src) => src.id)
  ),
  forMember(
    (dest) => dest.email,
    mapFrom((src) => src.email.getValue())
  ),
  forMember(
    (dest) => dest.roles,
    mapFrom((src) => src.roles)
  ),
  forMember(
    (dest) => dest.permissions,
    mapFrom((src) => src.permissions)
  )
);

createMap(
  mapper,
  CreateUserDto,
  User,
  forMember(
    (dest) => dest.id,
    mapFrom(() => "")
  ), // will be set in useCase
  forMember(
    (dest) => dest.email,
    mapFrom((src) => Email.create(src.email))
  ),
  //   forMember(
  //   (dest) => dest.password,
  //   mapFrom((src) => Password.create(src.password))
  // ),
  forMember(
    (dest) => dest.roles,
    mapFrom((src) => src.roles ?? [])
  ),
  forMember(
    (dest) => dest.permissions,
    mapFrom((src) => src.permissions ?? [])
  )
);
