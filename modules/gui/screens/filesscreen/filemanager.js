var Filemanager = new Class({
    // We were asked to play a file
    on_play_file: function(machine, filepath){
        this.machine = machine;
    },
    
    // We were asked to remove a file
    on_remove_file: function(machine, filepath){
        this.machine = machine;
    },
    
    on_response_received: function(fileinfo){
        if(fileinfo.action == "play"){
            console.log("Playing " + fileinfo.filename);
        }else {
            console.log("Deleted " + fileinfo.filename);
        }
    }
});