var basicDefense = {

    defend: function(spawns) {
      for (var spawn in spawns) {
        var room = Game.spawns[spawn].room;
        var hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
        if(hostileCreeps.length > 0) {
          var roomName = room.name
          var hostileUser = hostileCreeps[0].owner.username;
          Game.notify(`User ${hostileUser} spotted in room ${roomName}`);
          if(room.controller.safeModeAvailable > 0) {
            room.controller.activateSafeMode()
          }
        }
      }
    }
};

module.exports = basicDefense;
