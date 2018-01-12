(function(){
    $.extend($.fn,{
        mask: function(msg,maskDivClass){
            this.unmask();
            // 参数
            var op = {
                opacity: 0.8,
                z: 10000,
                bgcolor: '#ccc'
            };
            var original=$(document.body);
            var position={top:0,left:0};
            if(this[0] && this[0]!==window.document){
                original=this;
                position=original.position();
            }
            // 创建一个 Mask 层，追加到对象中
            var maskDiv=$('<div class="maskdivgen"> </div>');
            maskDiv.appendTo(original);
            var maskWidth=original.outerWidth();
            if(!maskWidth){
                maskWidth=original.width();
            }
            var maskHeight=original.outerHeight();
            if(!maskHeight){
                maskHeight=original.height();
            }
            maskDiv.css({
                position: 'absolute',
                top: position.top,
                left: position.left,
                'z-index': op.z,
                width: maskWidth,
                height:maskHeight,
                'background-color': op.bgcolor,
                opacity: 0
            });
            if(maskDivClass){
                maskDiv.addClass(maskDivClass);
            }
            if(msg){
                var msgDiv=$('<div style="position:absolute;border:#6593cf 1px solid; padding:2px;background:#ccca"><div style="line-height:24px;border:#a3bad9 1px solid;background:white;padding:2px 10px 2px 10px">'+msg+'</div></div>');
                msgDiv.appendTo(maskDiv);
                var widthspace=(maskDiv.width()-msgDiv.width());
                var heightspace=(maskDiv.height()-msgDiv.height());
                msgDiv.css({
                    cursor:'wait',
                    top:(heightspace/2-2),
                    left:(widthspace/2-2)
                });
            }
            maskDiv.fadeIn('fast', function(){
                // 淡入淡出效果
                $(this).fadeTo('slow', op.opacity);
            })
            return maskDiv;
        },
        unmask: function(){
            var original=$(document.body);
            if(this[0] && this[0]!==window.document){
                original=$(this[0]);
            }
            original.find("> div.maskdivgen").fadeOut('slow',0,function(){
                $(this).remove();
            });
        }
    });
})();
(function($) {

    var placeholderfriend = {
        focus: function(s) {
            s = $(s).hide().prev().show().focus();
            var idValue = s.attr("id");
            if (idValue) {
                s.attr("id", idValue.replace("placeholderfriend", ""));
            }
            var clsValue = s.attr("class");
            if (clsValue) {
                s.attr("class", clsValue.replace("placeholderfriend", ""));
            }
        }
    }
    //判断是否支持placeholder
    function isPlaceholer() {
        var input = document.createElement('input');
        return "placeholder" in input;
    }
    //不支持的代码
    if (!isPlaceholer()) {
        $(function() {
            var form = $(this);
            //遍历所有文本框，添加placeholder模拟事件
            var elements = form.find("input[type='text'][placeholder]");
            elements.each(function() {
                var s = $(this);
                var pValue = s.attr("placeholder");
                var sValue = s.val();
                if (pValue) {
                    if (sValue == '') {
                        s.val(pValue);
                    }
                }
            });
            elements.focus(function() {
                var s = $(this);
                var pValue = s.attr("placeholder");
                var sValue = s.val();
                if (sValue && pValue) {
                    if (sValue == pValue) {
                        s.val('');
                    }
                }
            });
            elements.blur(function() {
                var s = $(this);
                var pValue = s.attr("placeholder");
                var sValue = s.val();
                if (!sValue) {
                    s.val(pValue);
                }
            });
            //遍历所有密码框，添加placeholder模拟事件
            var elementsPass = form.find("input[type='password'][placeholder]");
            elementsPass.each(function(i) {
                var s = $(this);
                var pValue = s.attr("placeholder");
                var sValue = s.val();
                if (pValue) {
                    if (sValue == '') {
                        //DOM不支持type的修改，需要复制密码框属性，生成新的DOM
                        var html = this.outerHTML || "";
                        html = html.replace(/\s*type=(['"])?password\1/gi, " type=text placeholderfriend")
                            .replace(/\s*(?:value|on[a-z]+|name)(=(['"])?\S*\1)?/gi, " ")
                            .replace(/\s*placeholderfriend/, " placeholderfriend value='" + pValue
                                + "' " + "onfocus='placeholderfriendfocus(this);' ");
                        var idValue = s.attr("id");
                        if (idValue) {
                            s.attr("id", idValue + "placeholderfriend");
                        }
                        var clsValue = s.attr("class");
                        if (clsValue) {
                            s.attr("class", clsValue + "placeholderfriend");
                        }
                        s.hide();
                        s.after(html);
                    }
                }
            });
            elementsPass.blur(function() {
                var s = $(this);
                var sValue = s.val();
                if (sValue == '') {
                    var idValue = s.attr("id");
                    if (idValue) {
                        s.attr("id", idValue + "placeholderfriend");
                    }
                    var clsValue = s.attr("class");
                    if (clsValue) {
                        s.attr("class", clsValue + "placeholderfriend");
                    }
                    s.hide().next().show();
                }
            });
        });
    }
    window.placeholderfriendfocus = placeholderfriend.focus;
})(jQuery);
function switchTab(tab){

    if(tab == "main"){
        location.href = "";

    }else if(tab == "sqhd"){
        location.href = "/qhSqhdWeb/sqhd/sqhd.html"
    }else if(tab == "wyhd"){
        location.href = "";
    }else if(tab == "nsfw"){
        location.href = "";
    }else if(tab == "gzcx"){
        location.href = "";
    }else if(tab == "bjfw"){
        location.href = "";
    }

}