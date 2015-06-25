// Creates new extrusionwidget objects and attaches them to the controlscreen
var Extrusionwidget = Module.extend({
    // TODO
    // add support for dual extrusion
    
    on_populate_control_screen: function(machine){
        // We were asked to add the widget to the control screen
        kernel.call_event("add_widget", {html: this.asset("control"), sizex: 2, sizey: 1});
        
        // Save the machine and its config
        this.parent_machine = machine;
        
        // Add a listener for the extrude button
        $("#extrude").click(function(){
            kernel.call_event("on_send_command", "G91 G0 E"+$("#extrude_length").val()+" F"+$("#e_velocity").val()+" G90");
        });
        
        // Add a listener for the retract button
        $("#retract").click(function(){
            kernel.call_event("on_send_command", "G91 G0 E-"+$("#extrude_length").val()+" F"+$("#e_velocity").val()+" G90");
        });
    }
    
});



