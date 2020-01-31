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
        }
    }

    // Respawn by role
    basicRespawner.checkAndRespawn(Game.creeps, 'harvester', 3);
    //basicRespawner.checkAndRespawn(Game.creeps, 'builder', 1);
    //basicRespawner.checkAndRespawn(Game.creeps, 'upgrader', 2);

    // Spawning message
    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }
    
    //--------------------------------------------------------------------------
    // Harvesting distribution // -- This should be calculated only after a source or harvesters is added or deleted (see Memory.lastAssignment)
    // Record initialization - Executed only the first time
    if(typeof Memory.lastAssignment === 'undefined') {
        Memory.lastAssignment = {
          amountHarvesters: 0,
          amountSources: 0,
        };
    }
    
    // Obtain all sources
    var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES_ACTIVE);
    
    // Obtain all harvesters
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    
    // TODO REMOVE TRUE
    var somethingChanged = true || Memory.lastAssignment.amountHarvesters != harvesters.length || Memory.lastAssignment.amountSources != sources.length;
    
    
    // Check if possible to distribute harvesters into sources
    if(harvesters.length > 0 && sources.length > 0 && somethingChanged) {
        // Save current amounts - used for detecting changes and redistributing harvesters
        Memory.lastAssignment = {
          amountHarvesters: harvesters.length,
          amountSources: sources.length,
        };
        
        // Generate assignment record
        Memory.sourceAssignment = [];
        for(var source in sources) {
            Memory.sourceAssignment.push({
                source: sources[source],    // I DON'T UNDERSTAND WHY IT'S WORKING AS AN INDEX IF IT'S A FOR OBJECT IN OBJECT X_X
                harvesters: []
            });
        }
        
        // Assign harversters
        var round = 0;
        var amountSources = sources.length;
        for(var index = 0; index < harvesters.length; index++) {
            // Assign harvester to source
            var currentHarvester = harvesters[index];
            var currentAssignment = Memory.sourceAssignment[index-(round*amountSources)];
            currentAssignment.harvesters.push(currentHarvester);
            currentHarvester.memory.targetSource = currentAssignment.source;
            
            // Each source is assigned one harvester each round (round is completed on the index goes over the array)
            if(index % amountSources == 0) {
                round = index / amountSources;
            }
        }
    }
    //--------------------------------------------------------------------------
    
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