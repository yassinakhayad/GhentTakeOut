/**
 * jQuery plugin to convert a given $.ajax response xml object to json.
 *
 * @example var json = $.xml2json(response);
 */
(function(){
    jQuery.extend({

        /**
         * Converts an xml response object from a $.ajax() call to a JSON object.
         *
         * @param xml
         */
        xml2json: function xml2json(xml) {
            var result = {};

            for(var i in xml.childNodes) {
                var node = xml.childNodes[i];
                if(node.nodeType == 1) {
                    var child = node.hasChildNodes() ? xml2json(node) : node.nodevalue;
                    child = child == null ? {} : child;

                    if(result.hasOwnProperty(node.nodeName)) {
                        // For repeating elements, cast the node to array
                        if(!(result[node.nodeName] instanceof Array)){
                            var tmp = result[node.nodeName];
                            result[node.nodeName] = [];
                            result[node.nodeName].push(tmp);
                        }
                        result[node.nodeName].push(child);
                    } else {
                        result[node.nodeName] = child;
                    }

                    // Add attributes if any
                    if(node.attributes.length > 0) {
                        result[node.nodeName]['@attributes'] = {};
                        for(var j in node.attributes) {
                            var attribute = node.attributes.item(j);
                            result[node.nodeName]['@attributes'][attribute.nodeName] = attribute.nodeValue;
                        }
                    }

                    // Add element value
                    if(node.childElementCount == 0 && node.textContent != null && node.textContent != "") {
                        result[node.nodeName].value = node.textContent.trim();
                    }
                }
            }

            return result;
        }

    });
})();


