var basicRespawner = {

    checkAndRespawn: function(creeps, role, minAmount) {
    
        var filteredCreeps = _.filter(creeps, (creep) => creep.memory.role == role);
    
        if(filteredCreeps.length < minAmount) {
            var newName = role + Game.time;
            Game.spawns['Spawn1'].spawnCreep(
                    [WORK,CARRY,MOVE], 
                    newName,
                    {memory: {role: role}}
                );
        }

    }

};

module.exports = basicRespawner;