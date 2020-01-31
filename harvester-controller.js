var harvesterController = {

    distributeHarvesters: function() {
      // This should be calculated only after a source or harvesters is added or deleted (see Memory.lastAssignment)
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
      var somethingChanged = Memory.lastAssignment.amountHarvesters != harvesters.length || Memory.lastAssignment.amountSources != sources.length;


      // Check if possible to distribute harvesters into sources
      if(harvesters.length > 0 && sources.length > 0 && somethingChanged) {
         // Display text announcing process
         new RoomVisual().text("🔄 Redistributing Harvesters", 1, 3, {color: 'yellow', font: 1, align: 'left'});

          // Save current amounts - used for detecting changes and redistributing harvesters
          Memory.lastAssignment = {
            amountHarvesters: harvesters.length,
            amountSources: sources.length,
          };

          // Generate assignment record
          Memory.sourceAssignment = [];
          for(var source in sources) {
              Memory.sourceAssignment.push({
                  source: sources[source],
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

    }

};

module.exports = harvesterController;
