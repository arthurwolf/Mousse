// Creates new widgetcontroller objects
var Widgetcontroller = Module.extend({
    on_populate_control_screen: function(machine){
        // Save the machine and its config
        this.parent_machine = machine;
    },

    // We were asked to send a command
    on_send_command: function( command ){
        console.log("sending: " + command);
        
        this.parent_machine.interface.send_command({
            command: command + "\n",
            caller: this,
            done: this.on_received_response,
        });
    },
    
    // We got a response from the board
    on_received_response: function( request, answer ){
        console.log(answer);
    }
    
});



