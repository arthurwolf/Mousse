var Basicconfigurationpanel = Class({

    create: function( parent ){
        this.parent = parent;
    },

    open: function(){
        // Append the asset to the configuration panel
        $("#configuration_panel").empty();
        this.parent.asset("basic_panel").appendTo("#configuration_panel");

        // Remember the machine
        this.machine = this.parent.selected_machine;
   
        // Setup the panel
        this.setup(); 
    },

    setup: function(){
        // Display the firmware version
        $("#firmware_version").html( this.machine.version.replace(", ","\n","g") );

        // Display the IP address
        $("#ip_address").html( this.machine.ip );

        // Hide the no machine name warning message if there is a machine name, and display the value
        if( typeof this.machine.configuration.machine_name !== "undefined" ){
            $("#no_machine_name").hide();
            $("#machine_name").val( this.machine.configuration.machine_name );
        }
   
        // Save the machine_name value if changed 
        $("#save_machine_name").click(function(machine){
            return function(){
                machine.configuration.set_value( "machine_name", $("#machine_name").val() + "\t# used for labels in Mousse", function( result ){
                    $("#machine_name_placard").tooltip({
                        delay: {hide: 5000}, 
                        placement: 'right',
                    });
                    $("#machine_name_placard").tooltip('show');
                });
            }
        }(this.machine));

        $('form').validator();


    }


}); 
