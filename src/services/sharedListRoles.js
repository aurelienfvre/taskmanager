// Helpers de rôle/permissions pour les listes partagées.
import { ROLES } from "./sharedListsCrud";

// Récupère le rôle d'un utilisateur sur une liste. Fallback vers 'editor'
// pour les anciens docs sans map `roles`.
export function getUserRole(list, uid, email) {
  if (!list || (!uid && !email)) return null;
  if (list.ownerId === uid) return ROLES.ADMIN;
  if (list.roles && list.roles[uid]) return list.roles[uid];
  const e = email?.trim().toLowerCase();
  if (e && list.emailRoles?.[e]) return list.emailRoles[e];
  if (Array.isArray(list.members) && list.members.includes(uid)) return ROLES.EDITOR;
  return null;
}

export const canEdit = (role) => role === ROLES.ADMIN || role === ROLES.EDITOR;
export const canManageMembers = (role) => role === ROLES.ADMIN;

export function assertPeutEditer(list, uid, email) {
  if (!canEdit(getUserRole(list, uid, email))) {
    throw new Error("Accès refusé : vous n'avez pas les droits d'édition.");
  }
}

export function assertPeutGererMembres(list, uid, email) {
  if (!canManageMembers(getUserRole(list, uid, email))) {
    throw new Error("Accès refusé : seuls les admins peuvent gérer les membres.");
  }
}
