import { USER_ROLES } from "./constants";

export function canAccessAdmin(user) {
  return (
    user.role === USER_ROLES.ADMIN ||
    user.role === USER_ROLES.SUPERADMIN
  );
}

export function isSuperAdmin(user) {
  return user.role === USER_ROLES.SUPERADMIN;
}

export function canManageUsers(user) {
  return (
    user.role === USER_ROLES.ADMIN ||
    user.role === USER_ROLES.SUPERADMIN
  );
}

export function canAccessKeystatic(user) {
  return [
    USER_ROLES.SUPERADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.EDITOR,
  ].includes(user.role);
}

export function canCreateRole(user, role) {

  if (role === USER_ROLES.SUPERADMIN) {
    return false;
  }

  if (user.role === USER_ROLES.SUPERADMIN) {
    return true;
  }

  if (user.role === USER_ROLES.ADMIN) {
    return (
      role === USER_ROLES.EDITOR ||
      role === USER_ROLES.VIEWER
    );
  }

  return false;
}

export function canUpdateUser(actor, target, updates) {

  if (actor.role === USER_ROLES.SUPERADMIN) {
     // нельзя создать второго superadmin
    if (
      updates.role === USER_ROLES.SUPERADMIN &&
      target.role !== USER_ROLES.SUPERADMIN
    ) {
      return false;
    }

    // Никто не может менять себя так,
    // чтобы лишить себе суперправа
    if (
      actor.username === target.username &&
      updates.role &&
      updates.role !== USER_ROLES.SUPERADMIN
    ) {
      return false;
    }

    return true;
  }

  //ADMIN
  if (actor.role === USER_ROLES.ADMIN) {
    // admin не может менять admin и superadmin
    if (
      target.role === USER_ROLES.ADMIN ||
      target.role === USER_ROLES.SUPERADMIN
    ) {
      return false;
    }

    // admin не может повышать роли
    if (
      updates.role &&
      !canCreateRole(actor, updates.role)
    ) {
      return false;
    }

    return true;
  }
  return false;
}

export function canEditUser(actor, target) {
  return canUpdateUser(actor, target, {});
}

export function canDeleteUser(actor, target) {
  // нельзя удалить самого себя
  if (actor.username === target.username) {
    return false;
  }

  // нельзя удалить суперадмин
  if (target.role === USER_ROLES.SUPERADMIN) {
    return false;
  }

  // superadmin может удалить любого кроме себя
  if (
    actor.role === USER_ROLES.SUPERADMIN
  ) {
    return true;
  }

  // admin может удалить только editor/viewer, не удаляет admin/superadmin
  if (
    actor.role === USER_ROLES.ADMIN
  ) {
    return (
      target.role == USER_ROLES.EDITOR ||
      target.role == USER_ROLES.VIEWER
    );
  }

  return false;
}

export function canCreateUser(actor) {
  return (
    actor.role === USER_ROLES.ADMIN ||
    actor.role === USER_ROLES.SUPERADMIN
  );
}
