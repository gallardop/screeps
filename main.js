var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var basicRespawner = require('basic-respawner');
var roleDefinition = require('role.definition');

module.exports.loop = function () {

    // Clear memory
    for(var name in Memory.creeps) {
        if(!Memory.creeps[name]) {
            delete Memory.creeps[name];
            //console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Respawn by role
    basicRespawner.checkAndRespawn(Game.creeps, 'harvester', 3);
    basicRespawner.checkAndRespawn(Game.creeps, 'builder', 1);
    basicRespawner.checkAndRespawn(Game.creeps, 'upgrader', 2);

    // Spawning message
    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    // Execute behavior by role
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }

    }
}