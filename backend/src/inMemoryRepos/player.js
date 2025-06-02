const players = new Map();
export const PlayerRepo = {
   create: (id, data) => players.set(id, data),
   get: (id) => players.get(id),
   remove: (id) => players.delete(id),
   list: () => [...players.values()],
};