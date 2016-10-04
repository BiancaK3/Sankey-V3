function linkHandler(event, link) {
    if (link.id.indexOf("Abandono") >= 0) return;
    var source = link.id.split("-")[0],
        target = link.id.split("-")[1],
        columnS = parseInt(event.source.x),
        $link = jQuery("#" + link.id),
        $source = jQuery("ul#" + parseInt(event.source.x) + " li:visible"),
        $target = jQuery("ul#" + parseInt(event.target.x) + " li:visible");

    var passos = [];
    nodes.forEach(function (node) {
        if (passos.indexOf(parseInt(node.x)) < 0)
            passos.push(parseInt(node.x));
    });
    passos.sort();

    if ($link.hasClass("desativado")) {
        if (columnS != 0)
            if (jQuery("path[id*=-" + source + "].desativado").length  ==  jQuery("path[id*=-" + source + "]").length) return;
        $link.removeClass("desativado");
        jQuery("path[id*=" + source + "-Aband]").removeClass("desativado");
        if (columnS > 0)
            jQuery("#" + target).show();
        else
            jQuery("#" + source).show();
    } else {
        $link.addClass("desativado");

        if (columnS == 0) {
            if ($source.length <= 1) {
                jQuery("ul li").hide();
                jQuery("path").addClass("desativado");

            }
        } else {
                var aux = [];
                Object.keys(links).sort().forEach(function (el, i) {
                    if (columnS > el) return;
                    if (columnS == el)                    
                        links[el].forEach(function(el, i){
                            if (el.indexOf("Abandono") < 0)
                                if (jQuery("#" + el).hasClass("desativado")){
                                    aux.push(1);  
                                }      
                        });
                        jQuery("#"+source+"-"+target).addClass("desativado");
                        jQuery("path[id^="+source+"-Abandono]").addClass("desativado");
                        
                        if (jQuery("path[id$=-"+target+"]:not(.desativado)").length > 0){
                            return
                        }
                        if (jQuery("path[id^="+source+"-]:not(.desativado)").length > 0 ){
                            jQuery("path[id^="+target+"-]").addClass("desativado");
                            return
                        }
                        if (jQuery("path[id^=-"+target+"]:not(.desativado)").length <= 1){
                            if (passos[passos.indexOf(parseInt(el))+1] >= 0){
                                links[passos[passos.indexOf(parseInt(el))+1]].forEach(function(link, i){
                                    jQuery("#" + link).addClass("desativado");
                                    jQuery("#" + link.split('-')[0]).hide();
                                    jQuery("#" + link.split('-')[1]).hide();
                                }); 
                            }                           
                        }

                });
        }
        if (columnS > 0)
            jQuery("#" + target).hide();
        else
            jQuery("#" + source).hide();


    }
 };
function colorLinks(){
    jQuery(".link").each(function(){
        var midias = jQuery(this).data("cores");
        if (!midias) return;
        console.log(midias);
    });
}

 jQuery("#limpar").on("mousedown", function(){
    nodes.forEach(function(node){
        jQuery("g text:contains('" + node.name + "')").parent().attr("transform", function(d) { 
      return "translate(" + node.x + "," + node.y + ")"; })
        sankey.relayout();
    });
 });

 // monta filtros
 function setFilters() {
    var passos = {},
        resp = "";
    nodes.forEach(function (node) {
        if (passos[parseInt(node.x)]) 
            passos[parseInt(node.x)].push(node.name);
        else 
            passos[parseInt(node.x)] = [node.name];
    });
    Object.keys(passos).sort(function(a,b) {return +a > +b? 1: -1}).forEach(function (el, i) {
        resp += "<div style='margin:3px;height: 100px;'><h3>Passo " + (i + 1) + "</h3><ul id='" + parseInt(el) + "'>"
        passos[el].forEach(function (name, i) {
            if (name.indexOf("Abandono") < 0)
                resp += "<li id='" + name.replace(/\s+/g, '_') + "'>" + name + "</li>";
        });

        resp += "</ul></div><img src='utils/proximo.png' style='height: 100%;margin-top: 80px;'>";
    });
    return resp.slice(0, -62);
 }

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