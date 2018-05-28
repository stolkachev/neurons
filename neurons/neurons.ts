class Neuron
{
    Neuro_Layer: Neuro_Layer;
    Id;
    External_id;
    Name;
    E;
    Curent_E;
    D;
    T;
    S;
    O;
    E_When;
    W_When;
    D_When;
    Charged;
    Func;
    URL;
    Prompt;
    constructor()
    {
        this.Neuro_Layer = null;
        this.Id = -1;
        this.External_id = -1;
        this.Name = "";
        this.E = 0;
        this.Curent_E = 0;
        this.D = 0;
        this.T = 0;
        this.S = 0;
        this.O = 0;
        this.E_When = 0;
        this.W_When = 0;
        this.D_When = 0;
        this.Charged = false;
        this.Func = "";
        this.URL = "";
        this.Prompt = "";
        personal_Neural_Net.neurons.push(this);
        this.Id = personal_Neural_Net.neurons.length - 1;
    }
};

class Nerve
{
    From;
    To;
    W;
    constructor()
    {
        this.From = -1;
        this.To = -1;
        this.W = 0;
        personal_Neural_Net.nerves.push(this);
    }
};

class Neuro_Layer
{
    Name;
    W;
    D;
    T;
    Delay_S;
    Current_trigger_id;
    Disharged_CallBack;
    constructor()
    {
        this.Name = "";
        this.Current_trigger_id = 1;
        this.Disharged_CallBack = null;
        personal_Neural_Net.neuro_Layers.push(this);
    }
};

class Personal_Neural_Net
{
    neurons: Neuron[];
    nerves: Nerve[];
    neuro_Layers: Neuro_Layer[];
    LocalStorage;
    constructor()
    {
        this.neurons = [];
        this.nerves = [];
        this.neuro_Layers = [];
        this.LocalStorage = false;
    }
}

var personal_Neural_Net = new Personal_Neural_Net();
var proto_neuron = new Neuron();
proto_neuron.Name = "Proto Neuron";
proto_neuron.E = 0;
proto_neuron.Curent_E = 0;
proto_neuron.Charged = false;

function Clean_Personal_Neural_Net()
{
    personal_Neural_Net = new Personal_Neural_Net();
    proto_neuron = new Neuron();
    proto_neuron.Name = "Proto Neuron";
    proto_neuron.E = 0;
    proto_neuron.Curent_E = 0;
    proto_neuron.Charged = false;
}

function Clone_Neuron(neuro_layer: Neuro_Layer, external_id: number, name: string)
{
    var neuron = new Neuron();
    neuron.Neuro_Layer = neuro_layer;
    neuron.Name = name;
    if (external_id == -1)
    {
        neuron.External_id = neuron.Id;
    }
    else
    {
        neuron.External_id = external_id;
    }
    return neuron;
}

function Add_Nerve(from: number, to: number, w: number)
{
    if (from == to || from > personal_Neural_Net.neurons.length || to > personal_Neural_Net.neurons.length) return;
    for (var i = 0; i < personal_Neural_Net.nerves.length; i++)
    {
        var nv = personal_Neural_Net.nerves[i];
        if (nv.From == from && nv.To == to) return nv;
    }
    var nerve = new Nerve();
    nerve.From = from;
    nerve.To = to;
    nerve.W = w;
    return nerve;
}

function Add_Neuro_Layer(w: number, d: number, t: number, delay_S: number, name: string)
{
    for (var i = 0; i < personal_Neural_Net.neuro_Layers.length; i++)
    {
        var nl = personal_Neural_Net.neuro_Layers[i];
        if (nl.Name.toLowerCase() == name.toLowerCase()) return nl;
    }
    var neuro_Layer = new Neuro_Layer();
    neuro_Layer.W = w;
    neuro_Layer.D = d;
    neuro_Layer.T = t;
    neuro_Layer.Delay_S = delay_S;
    neuro_Layer.Name = name;
    neuro_Layer.W = w;
    return neuro_Layer;
}

function Find_Neuro_Layer_By_Name(word: string)
{
    for (var i = 0; i < personal_Neural_Net.neuro_Layers.length; i++)
    {
        var nl = personal_Neural_Net.neuro_Layers[i];
        if (nl.Name.toLowerCase() == word.toLowerCase()) return nl;
    }
    return null;
}

function Find_Neuron_Id_By_Name(word: string, neuro_layer: Neuro_Layer)
{
    for (var i = 0; i < personal_Neural_Net.neurons.length; i++)
    {
        var n = personal_Neural_Net.neurons[i];
        if (n.Name.toLowerCase() == word.toLowerCase() && n.Neuro_Layer == neuro_layer) return i;
    }
    return -1;
}

function Find_Neuron_By_Name(word: string, neuro_layer: Neuro_Layer)
{
    for (var i = 0; i < personal_Neural_Net.neurons.length; i++)
    {
        var n = personal_Neural_Net.neurons[i];
        if (n.Name.toLowerCase() == word.toLowerCase() && n.Neuro_Layer == neuro_layer) return n;
    }
    return null;
}

function Find_Neuron_Id_By_External_Id(external_id: number, neuro_layer: Neuro_Layer)
{
    for (var i = 0; i < personal_Neural_Net.neurons.length; i++)
    {
        var n = personal_Neural_Net.neurons[i];
        if (n.External_id == external_id && n.Neuro_Layer == neuro_layer) return i;
    }
    return -1;
}

function Find_Neuron_By_External_Id(external_id: number, neuro_layer: Neuro_Layer)
{
    for (var i = 0; i < personal_Neural_Net.neurons.length; i++)
    {
        var n = personal_Neural_Net.neurons[i];
        if (n.External_id == external_id && n.Neuro_Layer == neuro_layer) return n;
    }
    return null;
}

function Set_Neuron_Name(i: number, name: string)
{
    var n = personal_Neural_Net.neurons[i];
    n.Name = name;
}

function Set_Neuron_Func(i: number, func: string) {
    var n = personal_Neural_Net.neurons[i];
    n.Func = func;
}

function Set_Neuron_Prompt(i: number, prompt: string) {
    var n = personal_Neural_Net.neurons[i];
    n.Prompt = prompt;
}

function Set_Neuron_D(i: number, D: number)
{
    var n = personal_Neural_Net.neurons[i];
    n.D = D;
    var currentTime = +(new Date());
    n.D_When = D * 1000 + currentTime;
    
}

function Reset_Neurons(neuro_layer: Neuro_Layer)
{
    if (neuro_layer == null || neuro_layer == undefined)
    {
        for (var i = 0; i < personal_Neural_Net.neurons.length; i++)
        {
            var n = personal_Neural_Net.neurons[i];
            n.E = 0;
            n.O = 0;
            n.S = 0;
            n.Curent_E = 0;
            n.Charged = false;
        }
    } else
    {
        for (var i = 0; i < personal_Neural_Net.neurons.length; i++)
        {
            var n = personal_Neural_Net.neurons[i];
            if (n.Neuro_Layer == neuro_layer)
            {
                n.E = 0;
                n.O = 0;
                n.S = 0;
                n.Curent_E = 0;
                n.Charged = false;
            }
        }
    }
}

function Reset_Half_Charged_Neurons(neuro_layer: Neuro_Layer)
{
    if (neuro_layer == null || neuro_layer == undefined) return;
    for (var i = 0; i < personal_Neural_Net.neurons.length; i++)
    {
        var n = personal_Neural_Net.neurons[i];
        if (n.Neuro_Layer == neuro_layer && n.Curent_E < 1)
        {
            n.E = 0;
            n.O = 0;
            n.S = 0;
            n.Curent_E = 0;
            n.Charged = false;
        }
    }
}

function Get_Discharged_Triggers(neuro_layer)
{
    var charged_triggers = [];
    var triggers = [];
    if (neuro_layer == null || neuro_layer == undefined)
        return null;
    for (var i = 0; i < personal_Neural_Net.neurons.length; i++) {
        var neuron = personal_Neural_Net.neurons[i];
        if (neuron.Neuro_Layer != neuro_layer) continue;
        if (neuron.Name.indexOf(':') <= 0) continue;
        var split = neuron.Name.split(':');
        if (neuron.Curent_E != 1 && neuron.E != 1)
        {
            if (triggers.indexOf(split[0] + ":" + neuron.Prompt) < 0) triggers.push(split[0] + ":" + neuron.Prompt);
        } else
        {
            if (charged_triggers.indexOf(split[0] + ":" + neuron.Prompt) < 0) charged_triggers.push(split[0] + ":" + neuron.Prompt);
        }
    }
    for (var i = 0; i < charged_triggers.length; i++)
    {
        if (triggers.indexOf(charged_triggers[i]) >= 0)
        {
            triggers.splice(triggers.indexOf(charged_triggers[i]), 1);
        }
    }
    return triggers;
}

function Get_Charged_Triggers(neuro_layer) {
    var triggers = [];
    if (neuro_layer == null || neuro_layer == undefined)
        return null;
    for (var i = 0; i < personal_Neural_Net.neurons.length; i++) {
        var neuron = personal_Neural_Net.neurons[i];
        if (neuron.Neuro_Layer != neuro_layer) continue;
        if (neuron.Name.indexOf(':') <= 0) continue;
        var split = neuron.Name.split(':');
        if (neuron.Curent_E === 1 || neuron.E === 1) {
            if (triggers.indexOf(neuron.Name) < 0) triggers.push(neuron.Name);
        }
    }
    return triggers;
}

function Get_Excited_Neurons(neuro_layer: Neuro_Layer)
{
    var neurons: Neuron[] = [];

    if (neuro_layer == null || neuro_layer == undefined) return null;
    for (var i = 0; i < personal_Neural_Net.neurons.length; i++)
    {
        var neuron = personal_Neural_Net.neurons[i];
        if (neuron.Neuro_Layer != neuro_layer) continue;
        {
            if (neuron.Curent_E == 1 || neuron.E == 1)
            {
                neurons.push(neuron);
            }
        }
    }
    return neurons;
}

function Discharge_Me(neuron: Neuron)
{
    if (neuron == null) return;
    neuron.E_When = 0;
    neuron.E = 0;
    neuron.Curent_E = 0;
    neuron.Charged = false;
    neuron.O = 0;
}

function Excite_Me(neuron: Neuron, e_d: number)
{
    if (neuron == null) return;
    if (e_d > 1) e_d = 1;
    if (e_d < -1) e_d = -1;

    if (e_d == 1 || e_d == -1 || e_d == 0)
    {
        neuron.Curent_E = e_d;
    }
    else
    {
        neuron.Curent_E = Number(neuron.Curent_E) + Number(e_d);
    }
    if (neuron.Curent_E > 1.0) neuron.Curent_E = 1;
    if (neuron.Curent_E < -1.0) neuron.Curent_E = -1;
    if (neuron.Curent_E <= 0) neuron.O = 0;
    if (neuron.D > 0)
    {
        Set_Discharge_Time(neuron, neuron.D, neuron.Neuro_Layer.Disharged_CallBack);
    }
    if (neuron.Curent_E == 1 && neuron.Func != "" && neuron.Func != null)
    {
        try {
            window["" + neuron.Func](neuron);
        } catch (Error) { }
    }
}

function Set_Discharge_Time(neuron: Neuron, discharge_Secs: number, call_Back)
{
    if (neuron == null) return;
    neuron.D = discharge_Secs;
    var discharge_Ticks = discharge_Secs * 1000;

    var currentTime = +(new Date());
    neuron.D_When = discharge_Ticks + currentTime;
    var t = setTimeout(function ()
    {
        var currentTime = +(new Date());
        if (currentTime < neuron.D_When) return;
        neuron.Curent_E = 0;
        neuron.E = 0;
        neuron.Charged = false;
        if (call_Back != null) call_Back();
    }, discharge_Ticks)
}

function Fire_Me(neuron: Neuron)
{
    if (neuron == null) return;
    var token = 0;
    neuron.O = 1;
    var fired = false;

    for (var i = 0; i < personal_Neural_Net.nerves.length; i++)
    {
        var nv = personal_Neural_Net.nerves[i];
        if (nv.From == neuron.Id)
        {
            token = neuron.O * nv.W;
            Excite_Me(personal_Neural_Net.neurons[nv.To], token);
            personal_Neural_Net.neurons[nv.To].S = 0;
            fired = true;
        }
    }
    if (fired)
    {
        neuron.E = 0;
        neuron.Curent_E = 0;
        neuron.Charged = false;
        neuron.O = 0;
    }
}

function Propagate(neuron: Neuron)
{
    if (neuron == null) return;
    var token = 0;
    for (var i = 0; i < personal_Neural_Net.nerves.length; i++)
    {
        var nv = personal_Neural_Net.nerves[i];
        if (nv.From == neuron.Id)
        {
            token = nv.W;
            Excite_Me(personal_Neural_Net.neurons[nv.To], token);
            personal_Neural_Net.neurons[nv.To].S = 0;
        }
    }
    neuron.E = 0;
    neuron.Curent_E = 0;
    neuron.Charged = false;
    neuron.O = 0;
}

function Excite_Word(word: string)
{
    if (word == null || word == undefined) return;
    var neuro_Layer = Find_Neuro_Layer_By_Name("words");
    var neuron = Find_Neuron_By_Name(word, neuro_Layer);
    if (neuron == null) return;
    var token = 0;
    for (var i = 0; i < personal_Neural_Net.nerves.length; i++)
    {
        var nv = personal_Neural_Net.nerves[i];
        if (nv.From == neuron.Id)
        {
            token = nv.W;
            Excite_Me(personal_Neural_Net.neurons[nv.To], token);
            personal_Neural_Net.neurons[nv.To].S = 0;
        }
    }
    for (var i = 0; i < personal_Neural_Net.neurons.length; i++)
    {
        if (personal_Neural_Net.neurons[i].Curent_E == 1 || personal_Neural_Net.neurons[i].E == 1)
        {
            Fire_Me(personal_Neural_Net.neurons[i]);
        }
    }
    neuron.E = 0;
    neuron.Curent_E = 0;
    neuron.Charged = false;
    neuron.O = 0;
}

function Excite_Phrase(phrase: string)
{
    var words_Fired = "";
    var non_Recognized_Words = "";
    if (phrase == null || phrase == "" || phrase == undefined) return;

    var neuro_Layer = Find_Neuro_Layer_By_Name("words");

    if (phrase.indexOf(" ") < 0)
    {
        var j = Find_Neuron_Id_By_Name(phrase, neuro_Layer);
        if (j > 0)
        {
            Propagate(personal_Neural_Net.neurons[j]);
        }
        else
        {
            non_Recognized_Words = phrase;
        }
    }
    else
    {
        var split = phrase.split(' ');
        var word;
        for (var i = 0; i < split.length; i++)
        {
            word = split[i];
            var j = Find_Neuron_Id_By_Name(word, neuro_Layer);

            if (words_Fired.indexOf(word + ':') >= 0) continue;

            words_Fired = words_Fired + word + ':';

            if (j > 0)
            {
                Propagate(personal_Neural_Net.neurons[j]);
            }
            else
            {
                if (non_Recognized_Words == "")
                {
                    non_Recognized_Words = word;
                }
                else
                {
                    non_Recognized_Words = non_Recognized_Words + ":" + word;
                }
            }
        }
    }
    for (var i = 0; i < personal_Neural_Net.neurons.length; i++)
    {
        if (personal_Neural_Net.neurons[i].Curent_E == 1 || personal_Neural_Net.neurons[i].E == 1)
        {
            Fire_Me(personal_Neural_Net.neurons[i]);
        }
    }
    return;
}

function Build_Linguistic_Trigger(neuro_layer: Neuro_Layer, number_of_states: number, initial_id: number)
{
    var to, from = 0;
    var w = 0;

    for (var i = initial_id; i < initial_id + number_of_states * 2; i++)
    {
        var neuron = Clone_Neuron(neuro_layer, i, i.toString());
    }

    for (var i = initial_id; i < initial_id + number_of_states; i++)
    {
        from = Find_Neuron_Id_By_External_Id(i, neuro_layer); 
        for (var j = initial_id + number_of_states; j < initial_id + number_of_states * 2; j++)
        {
            to = Find_Neuron_Id_By_External_Id(j, neuro_layer);
            if (j == i + number_of_states)
            {
                w = 1;
            }
            else
            {
                w = -1;
            }
            Add_Nerve(from, to, w);
        }
    }
}

function Build_Neural_Layer(layer_url: string)
{
    var words_layer = Find_Neuro_Layer_By_Name("words");

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", layer_url, false);
    xmlhttp.send();
    var xmlDoc = xmlhttp.responseXML;
    
    var neuro_triggers = xmlDoc.getElementsByTagName("neuro_triggers");
    var neuro_triggers_name = (<HTMLScriptElement>neuro_triggers[0]).getAttribute("name");

    var neuro_layer = Add_Neuro_Layer(1, -1, 1, 1000, neuro_triggers_name);
    var this_trigger_id = neuro_layer.Current_trigger_id;
    var x = xmlDoc.getElementsByTagName("neuro_trigger");
    
    for (var i = 0; i < x.length; i++)
    {
        if (x[i].childNodes.length < 1) continue;
        var number_of_states = 1;
        for (var j = 0; j < x[i].childNodes.length; j++)
        {
            var y = x[i].childNodes[j];
            if (y.childNodes.length < 1)
            {
                continue;
            }
            number_of_states++;
        }
        var trigger_name = (<HTMLScriptElement>x[i]).getAttribute("name");
        var trigger_prompt = (<HTMLScriptElement>x[i]).getAttribute("prompt");
        Build_Linguistic_Trigger(neuro_layer, number_of_states, neuro_layer.Current_trigger_id);
        this_trigger_id = neuro_layer.Current_trigger_id;

        for (j = 0; j < x[i].childNodes.length; j++)
        {
            var y = x[i].childNodes[j];
            if (y.childNodes.length < 1) continue;
            var state_name = (<HTMLScriptElement>y).getAttribute("name");
            var discharge = (<HTMLScriptElement>y).getAttribute("discharge");
            var func = (<HTMLScriptElement>y).getAttribute("func");
            var j_sema = Find_Neuron_Id_By_External_Id(this_trigger_id, neuro_layer);
            if (j_sema > 0) {
                Set_Neuron_Name(j_sema, state_name);
                Set_Neuron_Name(j_sema + number_of_states, trigger_name + ":" + state_name);
                if (func != null && func != "")
                {
                    Set_Neuron_Func(j_sema + number_of_states, func);
                    console.log(j_sema + number_of_states, func)
                }
                if (trigger_prompt != null) {
                    Set_Neuron_Prompt(j_sema + number_of_states, trigger_prompt);
                }
                Set_Neuron_D(j_sema + number_of_states, +discharge);
            }
            this_trigger_id++;

            for (var k = 0; k < y.childNodes.length; k++)
            {
                try
                {
                    var z = y.childNodes[k];
                    var word = (<HTMLScriptElement>z).getAttribute("word");
                    var j_word = Find_Neuron_Id_By_Name(word, words_layer);
                    if (j_word < 0)
                    {
                        var neuron = Clone_Neuron(words_layer, -1, word);
                    }
                    var j_word = Find_Neuron_Id_By_Name(word, words_layer);
                    var w = (<HTMLScriptElement>z).getAttribute("weight");
                    var weight: number = +w;
                    Add_Nerve(j_word, j_sema, weight);

                } catch (Error)
                { }
            }
        }
        neuro_layer.Current_trigger_id = neuro_layer.Current_trigger_id + number_of_states * 2;
    }
    return neuro_layer;
}

function Save_Linguistics_URL(url: String)
{
    if (url == null || url == undefined) return;
    if (typeof (Storage) !== "undefined" && personal_Neural_Net.LocalStorage)
    {
        var loaded = localStorage.getItem("neuro_layers_url");
        var urls = JSON.parse(loaded);
        if (urls == null)
        {
            var serialized;
            urls = [] ;
            urls.push(url);
            serialized = JSON.stringify(urls);
            localStorage.setItem("neuro_layers_url", serialized);
        } else
        {
            var alreday_saved = false;
            for (var i = 0; i < urls.length; i++)
            {
                if (urls[i] == url)
                {
                    alreday_saved = true;
                    break;
                }
            }
            if (alreday_saved) return;
            urls.push(url);
            serialized = JSON.stringify(urls);
            localStorage.setItem("neuro_layers_url", serialized);
        }
    }
}

function Restore_Linguistics_URLs()
{
    if (typeof (Storage) !== "undefined" && personal_Neural_Net.LocalStorage)
    {
        var loaded = localStorage.getItem("neuro_layers_url");
        var urls = JSON.parse(loaded);
        return urls;
    }
    return null;
}

function Save_Neural_State(neuro_layer: Neuro_Layer)
{
    if (neuro_layer == null || neuro_layer == undefined) return;
    if (typeof (Storage) !== "undefined" && personal_Neural_Net.LocalStorage)
    {
        var neurons = Get_Excited_Neurons(neuro_layer);
        var serialized;
        try
        {
            serialized = JSON.stringify(neurons);
            localStorage.setItem(neuro_layer.Name, serialized);
        } catch (e) {}
    }
}

function Restore_Neural_State(neuro_layer: Neuro_Layer)
{
    if (neuro_layer == null || neuro_layer == undefined) return;
    if (typeof (Storage) !== "undefined" && personal_Neural_Net.LocalStorage)
    {
        var loaded = localStorage.getItem(neuro_layer.Name);
        var neurons = JSON.parse(loaded);
        if (neurons != null)
        {
            for (var i = 0; i < neurons.length; i++)
            {
                var neuron = neurons[i];
                var currentTime = +(new Date());
                neuron.D_When = neuron.D * 1000 + currentTime;
                var name = neuron.Name;
                var e_neuron = Find_Neuron_By_Name(name, neuro_layer);
                Excite_Me(e_neuron, 1.0);
            }
        }
    }
}

function RandomID()
{
    var chars = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
    var str = "";
    for (var i = 0; i < 16; i++)
    {
        var r = Math.floor(Math.random() * 62);
        str += chars.substr(r, 1);
    }
    return str;
}