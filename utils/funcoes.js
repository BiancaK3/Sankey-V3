//função que trata o selecionamento ou deselecionamento dos links das Fontes de Tragefo
function linkHandler(event, link) {
    if (link.id.indexOf("Abandono") >= 0) return;
    var target = link.id.split("-")[1],
        $link = jQuery("#" + link.id),
        $ativados 

    if (!$link.hasClass("desativado"))
        if (jQuery("path[id*=-"+target+"]:not(.desativado)").length == 1) 
            return;

    $link.toggleClass("desativado");

    $ativados = jQuery("path[id*=-"+target+"]:not(.desativado)")
    jQuery("path").attr("style", "stroke:"+getColor("default"))  
    if ($ativados.length <= 3 && $ativados.length > 0){

      $ativados.each(function(ativ){
        midia = this.id.split("-")[0];
        jQuery("path[id*=-"+midia+"]").attr("style", "stroke:"+getColor(midia))
      })
    }
    setFilters()   
 };

//função que adiciona uma função de click nos Links
function clicks (links){
    links[0].forEach(function(link){
    document.getElementById(link).onclick = function (event) { 
      return linkHandler(event, this);
     }
  });
 }

//função que trata do hover de links
function hoverHandler(link){
    var name = (link.source.name+"-"+link.target.name).replace(/\s+/g, '_');
    if (link.midia){
        jQuery("#" + (name+"-"+ link.midia).replace(/\s+/g, '_')).hover(function () {
            jQuery('path[id^=' + name + "]").addClass("hover");
        }, function () {
            jQuery('path[id^=' + name + "]").removeClass("hover");
        });
        original_path[(name+"-"+ link.midia).replace(/\s+/g, '_')] = jQuery("#" + (name+"-"+ link.midia).replace(/\s+/g, '_')).attr("d"); 
    }
    else{
        jQuery("#" + name).hover(function () {
            jQuery(this).addClass("hover");
        }, function () {
            jQuery(this).removeClass("hover");
        });
        original_path[name] = jQuery("#" + name).attr("d"); 
    }
    
}

//fução que trata dos cliques em nós
function nodeHandler(event, node) {
    var nodesByX = [], 
    $this = jQuery("path[id*="+node.id+"]"),
    $nodeLinks = jQuery("path[id*="+node.id+"]:not(.desativado)"), 
    x = original_nodes[event.name].x;
    var nodesAfter = links[parseInt(x)].map(function(value){
            var aux = value.split("-")[0];  
            if(aux.indexOf("Abandono") <0 ) 
                return  aux;
        }).filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
        });
    if (nodesAfter.length == 1 && nodesAfter[0] == node.id) return;


    if ($nodeLinks.length <= 0){
       $this.toggleClass("desativado")
    }
    else{
        Object.keys(original_nodes).forEach(function (el){
            if (x == original_nodes[el].x && el != event.name && el.indexOf("Abandono") < 0)
                nodesByX.push(el.replace(/\s+/g, '_'));
        })
        var existeOutroFluxo = false
        for (var i = nodesByX.length - 1; i >= 0; i--) {
            if (jQuery("path[id*="+nodesByX[i]+"]:not(.desativado)").length > 0)
                existeOutroFluxo = true;
        };
        if (existeOutroFluxo)
            $this.toggleClass("desativado")  
    } 
    setFilters();
};

 // função que monta os filtros
function setFilters() {
    var passos = {},
        resp = "";

    Object.keys(original_nodes).forEach(function (node) {
        var x = parseInt(original_nodes[node].x), 
            name = node.replace(/\s+/g, '_'), 
            linksAtiv = (x == 0) ? jQuery("path[id*="+name+"-]:not(.desativado)").length : jQuery("path[id*="+name+"]:not(.desativado)").length; 
        if (linksAtiv > 0){
            if (passos[x]) 
                passos[x].push(node);
            else
                passos[x] = [node];
        }      
    });

    Object.keys(passos).sort(function(a,b) {return +a > +b? 1: -1}).forEach(function (el, i) {
        if (i == 0){
            resp += "<div style='margin:3px;height: 100px;'><h3>Fontes de Tráfego</h3><ul id='filtro" + parseInt(el) + "'>"
        }
        else{
            resp += "<div style='margin:3px;height: 100px;'><h3>Passo " + i + "</h3><ul id='filtro" + parseInt(el) + "'>"
        }
        var i = 0, 
            limite = (passos[el].length < 3) ? passos[el].length : 3;
        while (i < limite){
            if (passos[el][i].indexOf("Abandono") < 0)
                 resp += "<li '>" + passos[el][i] + "</li>";    
           i++;

        }
        
        resp += "</ul></div><img src='utils/proximo.png' style='height: 100%;margin-top: 80px;'>";
    });
    document.getElementById("filtro").innerHTML = resp.slice(0, -62);
}

//função que retorna as cores de cada fonte
function getColor(name) {
    if (name.indexOf("Aband") >= 0)
        return "#8A3334"
    switch (name) {
    case "Facebook":
        return "#2E4DA7"
        break;
    case "Banner":
        return "#091540"
        break;
    case "Google":
        return "#5CD0DB"
        break;
    case "Warning":
        return "#DBBB3D"
        break;
    case "Outros":
        return "#99A1A6"
        break;
    case "Menu":
        return "#E3DCD4"
        break;
    case "Atalhos":
        return "#CAB27D"
        break;
    default:
        return "#6B6F72"
        break;
    }
 }


 
 