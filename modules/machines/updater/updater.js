var Machineupdater = new Class({

    create: function(machine){
        // Tie the machine and 
        this.parent_machine = machine;
        machine.updater = this;

        // Set this updater to update every second
        var _that = this; 
        setInterval(function(){
            _that.second_tick.call(_that); 
        },1000);

    },

    second_tick: function(){
        // Every second, try to call the machine to get information

        // Do not call if more than one request is currently being sent, as we do not want to disturb the board too much
        if(this.parent_machine.interface.is_busy()){ return; }

        // Send a request for multiple G-codes
        this.parent_machine.interface.send_command({
            command: "M105\nM119\nM114\nprogress\n",
            caller: this,
            done: this.update_received,
        });
    },

    update_received: function( request, answer ){
        // Parse the answer
        var result = {};

        // Separate into lines
        var lines = answer.split("\n");

        // Extract temperatures
        // Cut into different readings
        var decomposed = lines[0].replace(/\s\r$/gi, '').split(/([A-Z])/);
        decomposed.shift();

        // For each reading, add values to the result
        result.temperature = {};
        while( decomposed.length ){
            var letter = decomposed.shift();
            var reading = decomposed.shift().replace(/^(:)*/g,'').replace(/(\s)*$/g,'');
            var values = reading.split(/\s/g);
            result.temperature[letter] = {
                temperature: values[0],
                target: values[1].replace(/(\/)/g,''),
                pwm: values[2].replace(/\@/g,'')
            }; 
            
        }

        // Extrat endstop readings
        result.endstops = {};
        var endstop_readings = lines[1].replace(/(\s*\r)$/g,'').split(' ');
        for( var index in endstop_readings){
            var endstop = endstop_readings[index]; 
            var couple = endstop.split(":");
            result.endstops[couple[0]] = couple[1]; 
        }

        // Extract positions
        result.positions = {};
        var decomp = lines[3].split(/([A-Z])/);
        decomp.shift();
        while( decomp.length ){
            var letter = decomp.shift();
            var value = decomp.shift().replace(/^(:)/g,'').replace(/([\s\r]*)$/,'');
            result.positions[letter] = value;
        }

        // Extract progress
        // Example : "13 % complete, elapsed time: 14 s, est time: 86 s" or "Not currently playing"
        result.progress = {};
        result.progress.string = lines[4].replace(/([\s\r]*)$/,'');
        if( result.progress.string.match(/currently/g) ){
            result.progress.playing = false;
        }else{
            result.progress.playing = true;
            result.progress.percent_complete = result.progress.string.match(/[^%]*/i)[0].replace(/\s/g, '')+"%";
            
            // Get the seconds and convert them to HH:MM:SS
            var time_elapsed = result.progress.string.split("elapsed time:").pop().split("s").shift().replace(/ /g, '');
            var estimated_time = result.progress.string.split("est time:").pop().split("s").shift().replace(/ /g, '');
            var time = new Date(null);
            time.setSeconds(time_elapsed)
            result.progress.time_elapsed = time.toISOString().substr(11, 8);
            time.setSeconds(estimated_time-time_elapsed);
            result.progress.est_time = time.toISOString().substr(11, 8);    
        }
        
        // We have extracted all the info we need, we can call the event to inform all modules interrested of the information we found
        kernel.call_event("on_value_update", result);

    },


});
