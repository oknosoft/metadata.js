Object.defineProperties(Object.prototype, {

  /**
   * Подключает наблюдателя
   * @method observe
   * @for Object
   */
  observe: {
    value: function(target, observer) {
      if(!target){
        return;
      }
      if(!target._observers){
        Object.defineProperties(target, {
          _observers: {
            value: []
          },
          _notis: {
            value: []
          }
        });
      }
      target._observers.push(observer);
    }
  },

  /**
   * Отключает наблюдателя
   * @method unobserve
   * @for Object
   */
  unobserve: {
    value: function(target, observer) {
      if(target && target._observers){

        if(!observer){
          target._observers.length = 0;
        }

        for(let i=0; i<target._observers.length; i++){
          if(target._observers[i]===observer){
            target._observers.splice(i, 1);
            break;
          }
        }
      }
    }
  },

  /**
   * Возвращает объект нотификатора
   * @method getNotifier
   * @for Object
   */
  getNotifier: {
    value: function(target) {
      var timer;
      return {
        notify(noti) {

          if(!target._observers || !noti)
            return;

          if(!noti.object)
            noti.object = target;

          target._notis.push(noti);
          noti = null;

          if(timer){
            clearTimeout(timer);
          }

          timer = setTimeout(() => {
            //TODO: свернуть массив оповещений перед отправкой
            if(target._notis.length){
              target._observers.forEach((observer) => observer(target._notis));
              target._notis.length = 0;
            }
            timer = false;

          }, 4);
        }
      }
    }
  }

});

Function.prototype._extend = function( Parent ) {
	var F = function() { };
	F.prototype = Parent.prototype;
	this.prototype = new F();
	this.prototype.constructor = this;
	this.__define("superclass", {
		value: Parent.prototype,
		enumerable: false
	});
}

export default {};
