var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var hasCapacity = creep.store.getFreeCapacity() > 0;
        var targetSource = creep.memory.targetSource;
        var targetDefined = !(typeof targetSource === 'undefined');
        var hasCollectedResources = creep.store.getUsedCapacity() > 0;
        
        if(hasCapacity && targetDefined) {
            // Harvest
            if(creep.harvest(targetSource) == ERR_NOT_IN_RANGE) {
                // Not Close enough -> move to source
                creep.moveTo(targetSource, {visualizePathStyle: {stroke: '#ffaa00'}});
            } 
        }
        else {
            // Store collected resource
            if(hasCollectedResources) {
                // Find target structures to store collected resources
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                // Move & transfer resources
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } 
            }

        }
    }
};

module.exports = roleHarvester;