// Creates new extrusionwidget objects and attaches them to the controlscreen
var Temperaturecontrolwidget = Module.extend({
    // TODO
    // add support for dual extrusion
    
    on_populate_control_screen: function(machine){
        // We were asked to add the widget to the control screen
        kernel.call_event("add_widget", {html: this.asset("control"), sizex: 2, sizey: 1});
        
        // Save the machine and its config
        this.parent_machine = machine;
        
        // Add a listener for the set extruder temperature button
        $("#set_extruder_temperature").click(function(){
            kernel.call_event("on_send_command", "M104 S"+$("#extruder_temperature_input").val());
            $("#extruder_temperature_input").val("");
        });
        
        // Add a listener for the set bed temperature button
        $("#set_bed_temperature").click(function(){
            kernel.call_event("on_send_command", "M140 S"+$("#bed_temperature_input").val());
            $("#bed_temperature_input").val("");
        });
        
        // Add a listener for the set extruder temperature button
        $("#extruder_heat_off").click(function(){
            kernel.call_event("on_send_command", "M104 S0");
            $("#extruder_temperature_input").val("");
        });
        
        // Add a listener for the set bed temperature button
        $("#bed_heat_off").click(function(){
            kernel.call_event("on_send_command", "M140 S0");
            $("#bed_temperature_input").val("");
        });
    },
    
    // Update the display for the extruder and bed temperature target
    on_value_update: function(result){
        // Display the extruder's target temperature
        $("#extruder_temperature_input").attr("placeholder", result.temperature.T.target);
        
        // If the machine has a heated bed, display its temperature target
        if(typeof this.parent_machine !== "undefined" && this.parent_machine.configuration.temperature_control.bed.enable && typeof result.temperature.B !== "undefined"){
            $("#bed_temperature_input").attr("placeholder", result.temperature.B.target);
        }else {
            $("#bed_temp_input").hide();
        }
    }
    
});



