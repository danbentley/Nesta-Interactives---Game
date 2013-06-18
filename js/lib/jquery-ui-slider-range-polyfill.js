define(['jquery', 'slider'], function($) {

    function hasRangeSupport() {
        var input = document.createElement('input');
        input.setAttribute('type', 'range');
        return input.type === 'range';
    }

    $(document).ready(function() {

        if (hasRangeSupport()) return

        $('input[type=range]').each(function(index, input) {
            $input = $(input);

            var $slider = $('<div />').slider({
                min: parseInt($input.attr('min')),
                max: parseInt($input.attr('max')),
                value: parseInt($input.attr('value')),
                step: parseInt($input.attr('step')),
                slide: function(event, ui) {
                    $(this).prev('input').val(ui.value).change();
                }
            });

            $input.after($slider).addClass('accessibility');
        });
    });
});
