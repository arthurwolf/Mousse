// Creates new temperaturewidget objects and attaches them to the controlscreen
var Temperaturewidget = Module.extend({
    on_populate_control_screen: function(machine){
        // We were asked to add the widget to the control screen
        kernel.call_event("add_widget", {html: this.asset("temperature"), sizex: 2, sizey: 1});
        
        // Save the machine and its config
        this.parent_machine = machine;
    },
    
    // Update extruder and bed temperature
    on_value_update: function(result){
        // Display the extruder's temperature
        $("#extruder_temp").text("Extruder: "+result.temperature.T.temperature+"°C");
        
        if(typeof this.parent_machine !== "undefined" && this.parent_machine.configuration.temperature_control.bed.enable && typeof result.temperature.B !== "undefined"){
            $("#bed_temp").text("Bed: "+result.temperature.B.temperature+"°C");
        }else {
            $("#bed_temp").text("");
        }
    }
    
});



