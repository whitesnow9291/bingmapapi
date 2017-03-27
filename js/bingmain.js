$.noConflict();
$(document).ready(function () {
    $("#origin, #destination").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "http://dev.virtualearth.net/REST/v1/Locations",
                dataType: "jsonp",
                data: {
                    key: "BSMNNLLc1rjAlvJElfwN~TMwyjXx5IGREOD9GedzmrA~AsR43Rn6QpVCNWqW2Dmq73dT9lCQ8YEZ4neZFWiWmOWCPplHP_2vlERKHpGhO32Y",
                    q: request.term
                },
                jsonp: "jsonp",
                success: function (data) {
                    var result = data.resourceSets[0];
                    if (result) {
                        if (result.estimatedTotal > 0) {
                            response($.map(result.resources, function (item) {
                                return {
                                    data: item,
                                    label: item.name + ' (' + item.address.countryRegion + ')',
                                    value: item.name
                                }
                            }));
                        }
                    }
                }
            });
        },
        minLength: 1,
        change: function (event, ui) {
            // if (!ui.item)
            //     $("#searchBox").val('');
        },
        select: function (event, ui) {
            //displaySelectedItem(ui.item.data);
        }
    });

});
