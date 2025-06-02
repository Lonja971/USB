const battles = new Map();
export const BattleRepo = {
   create: (id, battle) => battles.set(id, battle),
   get: (id) => battles.get(id),
   remove: (id) => battles.delete(id),
   list: () => [...battles.values()],
};