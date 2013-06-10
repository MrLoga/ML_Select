(function( $ ){

  $.fn.ML_Select = function( options ) {  

    var s = $.extend( {
      'width'  : 80,
      'height' : 350,
      'oHeight': 40,
      'transformTiming': 'ease',
      'transformTime': 0.5,
      'middle'  : false 
    }, options);

    var arrSelect = [];
    function wrapOption(oHeight,sel,id,wrap,middle,num){
      this.num = num;
      this.id = id;
      this.middle = middle;
      this.oHeight = oHeight;
      this.sel = sel;
      this.wrap = wrap;
      this.y = oHeight * sel;
      this.changeY(this.sel);

      this.opacity(this.sel);
    };

    wrapOption.prototype.changeY = function(sel) {
      this.sel = sel;
      
      
      if(s.middle){
        this.y = -(this.oHeight * sel) + this.middle;
      }else{
        this.y = -(this.oHeight * sel);
      }
      this.wrap.css('-webkit-transform', 'translate3d(0px, ' + this.y + 'px, 0px)');
    };

    wrapOption.prototype.opacity = function(sel){
      for(i=0;i<10;i++){
        var q = this.sel + i;
        var opac = 10 - i;
        $('#ML_' + this.id + '_' + this.num + '_' + q).css('opacity', '0.'+ opac);  
      }
      for(i=0;i<this.sel+1;i++){
        var q = this.sel - i;
        var opac = 10 - i;
        $('#ML_' + this.id + '_' + this.num + '_' + q).css('opacity', '0.'+ opac);  
      }
      $('#ML_' + this.id + '_' + this.num + '_' + this.sel).css('opacity', '1');
    };

    wrapOption.prototype.change = function(sel){
      $('#' + this.id).prop("selectedIndex",sel).change();
    };

    return this.each(function(i) {    
      
      var
        _this = $(this),
        sel = $('#' + this.id + ' option:selected').index(),
        num = i,
        className = this.className ? this.className : 'selectDefoult',
        ML_wrap = $(document.createElement('div')),
        wrap = $(document.createElement('div')),
        item = $(document.createElement('div')),
        middle = s.height / 2 - s.oHeight / 2,
        optionsSum = this.options.length;

      ML_wrap.prop({id: 'ML_' + this.id + '_' + num, class: 'ML_' + className});
      ML_wrap.css({height: s.height, width: s.width, overflow: 'hidden'});
      wrap.prop({id: 'ML_optionWrap_' + this.id + '_' + num});
      wrap.css({'-webkit-transition': '-webkit-transform ' + s.transformTime + 's ' + s.transformTiming});

      arrSelect.push(new wrapOption(s.oHeight, sel ,this.id, wrap, middle, num));
      
      for(var i=0;i<optionsSum;i++){
        var option = item.clone().append(this.options[i].text);
        if(this.options[i].selected){
          option.data('selected', true);
        }
        option.prop({class: 'ML_options', id: 'ML_' + this.id + '_' + num + '_' + i});
        option.data({'id': i, 'h': s.oHeight});
        option.css({width: s.width - 2, height: s.oHeight, margin: '0 auto'});
        wrap.append(option);
      }
      

      var oldY = 0;
      var oldYA = true;
      var oldT = '';
      var shift = 0;
      var speed = 0;
      $(wrap).hammer({ drag_max_touches:0}).on("touch release drag swipeup swipedown", function(ev) {
        var touches = ev.gesture.touches[0];
        $('#' + wrap[num].id + ' .ML_options').css('opacity', 1);
        ev.gesture.preventDefault();
        switch(ev.type){
          case 'touch':
            oldY = touches.pageY;
            oldYA = false;
            oldT = 'touch';
            break;
          case 'drag':
            
            shift = $(this).offset().top - $(ML_wrap).offset().top + (touches.pageY - oldY);
            if(s.middle){
              if(shift>middle){
                shift=middle;
              }
              if(shift<(-(wrap.height()) + middle + s.oHeight)){
                shift = -wrap.height() + middle + s.oHeight;
              }
            }else{
              if(shift>0){
                shift=0;
              }
              if(shift<(-(wrap.height()) + s.oHeight)){
                shift = -wrap.height() + s.oHeight;
              }
            }
            wrap.css({'-webkit-transition': '-webkit-transform 0s ' + s.transformTiming});
            $(wrap).css('-webkit-transform', 'translate3d(0px, ' + shift + 'px, 0px)');

            oldY = touches.pageY;
            oldT = 'drag';
            break;
          case 'swipeup':
            oldT = 'swipeup';
            speed = ev.gesture.velocityY;
            break;
          case 'swipedown':
            oldT = 'swipedown';
            speed = ev.gesture.velocityY;
            break;

          case 'release':
            var newSel = 0;
            switch(oldT){
              case 'touch':
                newSel = $(touches.target).index();
                break;
              case 'drag':
                if(s.middle){
                  var diff = shift - middle;
                  if(diff<0){diff = diff*(-1)}
                  newSel = Math.round(diff/s.oHeight);    
                }else{
                  if(shift<0){shift = shift*(-1)}
                  newSel = Math.round(shift/s.oHeight);  
                }
                break;
              case 'swipeup':
                if(s.middle){
                  var diff = shift - middle;
                  if(diff<0){diff = diff*(-1)}
                  newSel = Math.round(diff/s.oHeight) + Math.round(speed * 1.5);
                }else{
                  if(shift<0){shift = shift*(-1)}
                  newSel = Math.round(shift/s.oHeight) + Math.round(speed * 1.5);
                }
                break;
              case 'swipedown':
                if(s.middle){
                  var diff = shift - middle;
                  if(diff<0){diff = diff*(-1)}
                  newSel = Math.round(diff/s.oHeight) - Math.round(speed * 1.5);
                }else{
                  if(shift<0){shift = shift*(-1)}
                  newSel = Math.round(shift/s.oHeight) - Math.round(speed * 1.5);
                }
                break;
            }
            wrap.css({'-webkit-transition': '-webkit-transform ' + s.transformTime + 's ' + s.transformTiming});

            if(newSel>= optionsSum){
              newSel = optionsSum - 1;
            }
            if(newSel<0){
              newSel = 0;
            }
            arrSelect[num].changeY(newSel);
            arrSelect[num].change(newSel);
            arrSelect[num].opacity(newSel);
            
            break;
        }
    });


      ML_wrap.append(wrap);
      _this.after(ML_wrap);
      arrSelect[num].opacity(sel);
      
      _this.hide();

      _this.height(s.height);
      _this.width(s.width);

    });

  };
})( jQuery );