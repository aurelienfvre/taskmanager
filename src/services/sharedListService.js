// Barrel : re-exporte toutes les fonctions des sous-modules pour ne pas
// casser les imports existants (`import { ... } from "@/services/sharedListService"`).
export { ROLES, createSharedList, deleteSharedList, subscribeToSharedList } from "./sharedListsCrud";
export { getUserRole, canEdit, canManageMembers } from "./sharedListRoles";
export { addMemberToList, linkCurrentUserToList, updateMemberRole, removeMemberFromList } from "./sharedListMembers";
export { getSharedListTasks, addSharedTask, updateSharedTask, deleteSharedTask, subscribeToSharedTasks } from "./sharedListTasks";
export { subscribeToSharedLists, getUserSharedLists } from "./sharedListsQueries";
