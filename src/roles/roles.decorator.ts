import { SetMetadata } from '@nestjs/common';
import { Role } from './role';

export const ROLES_KEY = 'roles';
// custom decorator: assigning role to metadata
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
