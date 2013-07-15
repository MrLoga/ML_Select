function ML_Select_up(set){

  var dateObj = new Date(),
      curDay = dateObj.getDate(),
      curMonth = dateObj.getMonth() + 1,
      curYear = dateObj.getFullYear();
  
  var s = {
      width  : 80,
      height : 350,
      oHeight: 40,
      transformTiming: 'ease',
      transformTime: 0.5,
      middle  : true 
    };

  var arrSelect = [];
  function wrapOption(oHeight,sel,id,wrap,middle,num,optionsSum){
    this.num = num;
    this.id = id;
    this.middle = middle;
    this.oHeight = oHeight;
    this.sel = sel;
    this.wrap = wrap;
    this.y = oHeight * sel;
    this.changeY(this.sel);
    this.optionsSum = optionsSum;
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

  wrapOption.prototype.change = function(sel){
    $('#' + this.id).prop("selectedIndex",sel).change();
  };

  wrapOption.prototype.dataCheck = function(sel){
    var Day=$('#'+set.day.id).val(),
        Month=$('#'+set.month.id).val(),
        Year=$('#'+set.year.id).val(); 
    var newData = reWriteDate(Day, Month, Year);
    $('#ML_optionWrap_S1_0').css('visibility', 'hidden');
    showDate(0, newData.day);
    $('#ML_optionWrap_S1_0').css('visibility', 'visible');
    showDate(1, newData.month);
    if(newData.day < Day){
      arrSelect[0].changeY(newData.day);
      arrSelect[0].change(newData.day);
    }else{
      arrSelect[0].changeY(Day-1);
      arrSelect[0].change(Day-1);
    }
    if(newData.month < Month){
      arrSelect[1].changeY(newData.month);
      arrSelect[1].change(newData.month);
    }else{
      arrSelect[1].changeY(Month-1);
      arrSelect[1].change(Month-1);
    }
    
  };

  function showDate(num, optionsSum){
    $(arrSelect[num].wrap[0].children).each(function(i){
      $(this).removeClass('none');
      if(i>optionsSum){
        $(this).addClass('none');
      }
    });
  }

  function reWriteDate(day, month, year){
    var days_in_month = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
    var newDay=day,
        newMonth=month;

    if ((year % 4 == 0) && (month == 2)){
      newDay = 29;
    }else{
      newDay = days_in_month[month - 1];
    }
    if (year == curYear){
      newMonth = curMonth;
      if(month >= curMonth){
        newDay = curDay;
      }
    }else{
      newMonth = 12;
    }
    return {day: newDay-1, month: newMonth-1};
  };

  var ind = 0;
  $.each(set, function(i,data){

      var
        _this = $('#' + data.id),
        sel = $('#' + data.id + ' option:selected').index(),
        num = ind,
        className = _this[0].className ? _this[0].className : 'selectDefoult',
        ML_wrap = $(document.createElement('div')),
        wrap = $(document.createElement('div')),
        item = $(document.createElement('div')),
        middle = s.height / 2 - s.oHeight / 2,
        optionsSum = $('#' + data.id + ' option').length;
      ind++;

      ML_wrap.prop({id: 'ML_' + this.id + '_' + num, class: 'ML_' + className});
      ML_wrap.css({height: s.height, width: data.width, overflow: 'hidden'});
      wrap.prop({id: 'ML_optionWrap_' + this.id + '_' + num});
      wrap.css({'-webkit-transition': '-webkit-transform ' + s.transformTime + 's ' + s.transformTiming});

      arrSelect.push(new wrapOption(s.oHeight, sel ,this.id, wrap, middle, num, optionsSum));
      for(var i=0;i<optionsSum;i++){
        var option = item.clone().append($('#' + data.id + ' option')[i].text);
        if($('#' + data.id + ' option')[i].selected){
          option.data('selected', true);
        }
        option.prop({class: 'ML_options', id: 'ML_' + this.id + '_' + num + '_' + i});
        option.data({'id': i, 'h': s.oHeight});
        option.css({width: data.width - 2, height: s.oHeight, margin: '0 auto'});
        wrap.append(option);
      }
      

      var oldY = 0;
      var oldYA = true;
      var oldT = '';
      var shift = 0;
      var speed = 0;

      $(wrap).hammer({ drag_max_touches:0}).on("touch release drag swipeup swipedown", function(ev) {
        var touches = ev.gesture.touches[0];
        // $('#' + wrap[num].id + ' .ML_options').css('opacity', 1);
        ev.gesture.preventDefault();
        switch(ev.type){
          case 'touch':
            oldY = touches.pageY;
            oldYA = false;
            oldT = 'touch';
            break;
          case 'drag':
            // console.log($(this).offset().top  + ' - ' + $(ML_wrap).offset().top  + ' + (' + touches.pageY  + ' - ' + oldY  + ')');
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

            if(newSel>= arrSelect[num].optionsSum){
              newSel = arrSelect[num].optionsSum - 1;
            }
            if(newSel<0){
              newSel = 0;
            }
            arrSelect[num].changeY(newSel);
            arrSelect[num].change(newSel);
            arrSelect[num].dataCheck(newSel);
            
            
            break;
        }


      });
    ML_wrap.append(wrap);
    _this.after(ML_wrap);
    
    _this.hide();

    _this.height(s.height);
    _this.width(data.width);

  });
}