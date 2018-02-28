    var generic_triggers_url = "triggers/triggers_bb_generic.xml";
    var cameras_triggers_url = "triggers/triggers_bb_cameras.xml";

    var linguistic_URLs = [];
    var layers = [];
    var layer = null;
    var url;

    var words_layer = null;
    var generic_triggers_layer = null;

    function load_nnod() {
        words_layer = Add_Neuro_Layer(1, -1, 1, 50000, "words");
        generic_triggers_layer = Build_Neural_Layer(generic_triggers_url);
        generic_triggers_layer.Disharged_CallBack = Show_Neural_State;
        layers.push(generic_triggers_layer);
    
        Save_Linguistics_URL(generic_triggers_url);

        linguistic_URLs = Restore_Linguistics_URLs();

        if (linguistic_URLs != null) {
            for (var i = 0; i < linguistic_URLs.length; i++) {
                url = linguistic_URLs[i];
                if (url == generic_triggers_url) continue;
                layer = Build_Neural_Layer(url);
                layers.push(layer);
                Save_Linguistics_URL(url);
            }
        }

        Restore_Neural_State(generic_triggers_layer);
        for (var i = 0; i < layers.length; i++) {
            Restore_Neural_State(layers[i]);
        }
        Show_Neural_State();
        linguistic_URLs = Restore_Linguistics_URLs();
        
        add_Layer(cameras_triggers_url);
    }

    function Discharge_Node(node)
    {
        for (var i = 0; i < personal_Neural_Net.neurons.length; i++) 
        {
            var neuron = personal_Neural_Net.neurons[i];
            if (neuron.Name == node)
            {
                neuron.Curent_E = 0;
                neuron.E = 0;
            }
        }
    }

    function Get_Excited_Nodes()
    {        
        var context = "";
        for (var i = 0; i < layers.length; i++) 
        {
            var layer = layers[i];
            var c_triggers = Get_Charged_Triggers(layer);
            var d_triggers = Get_Discharged_Triggers(layer);
            if (layer.Name == "Generic") continue;
            for (var j = 0; j < c_triggers.length; j++) {
                var splitter = c_triggers[j].split(":")
                context = context + splitter[0] + ":" + splitter[1] + "<br>";
            }
        }
        return context;
    }

    function Reset() {
        Reset_Neurons(null);
        localStorage.clear();
        linguistic_URLs = [];
        layers = [];
        layer = null;

        Clean_Personal_Neural_Net();
        load_completed();
        Show_Neural_State();
    }

    function add_Layer(linguistic_triggers_url) {
        if (linguistic_URLs == null) {
            layer = Build_Neural_Layer(linguistic_triggers_url);
            layers.push(layer);
            Show_Neural_State();
        } else {
            for (var k = 0; k < linguistic_URLs.length; k++) {
                if (linguistic_URLs[k] == linguistic_triggers_url) return;
            }
            layer = Build_Neural_Layer(linguistic_triggers_url);
            layers.push(layer);
            Save_Linguistics_URL(linguistic_triggers_url);
            linguistic_URLs = Restore_Linguistics_URLs();
            Show_Neural_State();
        }
    }

    function check_Controls() {
        var g_neurons = Get_Excited_Neurons(generic_triggers_layer);
        if (g_neurons == null) return;
        for (var i = 0; i < g_neurons.length; i++) {
            var nl = g_neurons[i];
            var splitter = nl.Name.split(':');

            if (nl.Name.toLowerCase() == "shopping:cameras") {
                add_Layer(cameras_triggers_url);
                return;
            }
            if (nl.Name.toLowerCase() == "clean:clean") {
                localStorage.clear();
                return;
            }
        }
    }

    function Submit_Phrase(phrase) {
        //          Reset_Neurons(generic_triggers_layer);
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            Reset_Half_Charged_Neurons(layer);
        }
        phrase = phrase.toLowerCase();
        var l = phrase.length - 1;
        var q = phrase.indexOf('?');

        Excite_Word(".");
        if (phrase == "") phrase = "*enter*";
        phrase = phrase.replace('?', ' ? ');
        Excite_Phrase(phrase);
        try {
            localStorage.removeItem(generic_triggers_layer.Name);
            Save_Neural_State(generic_triggers_layer);
            for (var i = 0; i < layers.length; i++) {
                Save_Neural_State(layers[i]);
            }
        } catch (Error) {}

        Show_Neural_State();
        check_Controls();
    }

    // NEURON'S FUNCTIONS
    function Help() {
        Save_Neural_State(generic_triggers_layer);
        for (var i = 0; i < layers.length; i++) {
            Save_Neural_State(layers[i]);
        }
        //       window.open("http://www.256gl.com");
    }

    function Hello_World() {
        //       alert("Hello_World was activated!")
    }