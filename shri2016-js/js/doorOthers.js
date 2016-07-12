// ===================== Пример кода первой двери =======================
/**
 * @class Door0
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door0(number, onUnlock) {
    DoorBase.apply(this, arguments);

    var buttons = [
        this.popup.querySelector('.door-riddle__button_0'),
        this.popup.querySelector('.door-riddle__button_1'),
        this.popup.querySelector('.door-riddle__button_2')
    ];

    buttons.forEach(function(b) {
        b.addEventListener('pointerdown', _onButtonPointerDown.bind(this));
        b.addEventListener('pointerup', _onButtonPointerUp.bind(this));
        b.addEventListener('pointercancel', _onButtonPointerUp.bind(this));
        b.addEventListener('pointerleave', _onButtonPointerUp.bind(this));
    }.bind(this));

    function _onButtonPointerDown(e) {
        e.target.classList.add('door-riddle__button_pressed');
        checkCondition.apply(this);
    }

    function _onButtonPointerUp(e) {
        e.target.classList.remove('door-riddle__button_pressed');
    }

    /**
     * Проверяем, можно ли теперь открыть дверь
     */
    function checkCondition() {
        var isOpened = true;
        buttons.forEach(function(b) {
            if (!b.classList.contains('door-riddle__button_pressed')) {
                isOpened = false;
            }
        });

        // Если все три кнопки зажаты одновременно, то откроем эту дверь
        if (isOpened) {
            this.unlock();
        }
    }
}

// Наследуемся от класса DoorBase
Door0.prototype = Object.create(DoorBase.prototype);
Door0.prototype.constructor = DoorBase;
// END ===================== Пример кода первой двери =======================

/**
 * @class Door1
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door1(number, onUnlock) {
    DoorBase.apply(this, arguments);

    // ==== Напишите свой код для открытия второй двери здесь ====
    var fixer = this.popup.querySelector('.door-riddle__fixer'), 
        bolt = this.popup.querySelector('.door-riddle__bolt');
    var x0 = getNumFromXXXpx(getElementCssLeft(fixer));
    var x2 = getNumFromXXXpx(getElementCssLeft(bolt));
    var x1 = bolt.clientWidth + x2;
    
    var len = x1 - x0;

    bolt.addEventListener('pointerdown', _onBoltPointerDown.bind(this));
    bolt.addEventListener('pointerup', _onBoltPointerUp.bind(this));
    bolt.addEventListener('pointermove', _onBoltPointerMove.bind(this));

    var touch_beg, touch_end, touch_pos, is_pressed = false;

    function _onBoltPointerDown(e) {
        is_pressed = true;
        touch_beg = e.x;
    }

    function _onBoltPointerUp(e) {
        is_pressed = false;
        touch_end = e.x;
        if(touch_beg - touch_end > len) {
            this.unlock();
        }
    }

    function _onBoltPointerMove(e) {
        touch_pos = e.x;
        if (is_pressed) {
            // Здесь нужно задать css-свойство left засова сдвинутым на touch_beg - touch_pos влево относительно начального положения
            bolt.style.left = (x2 - (touch_beg - touch_pos)) + "px";
        }
    }
    // ==== END Напишите свой код для открытия второй двери здесь ====

    function getNumFromXXXpx(str) {
        var s = str.substring(0, str.length - 2);
        return parseInt(s);
    }

    function getElementCssLeft(e) {
        return window.getComputedStyle(e).getPropertyValue('left');
    }
}
Door1.prototype = Object.create(DoorBase.prototype);
Door1.prototype.constructor = DoorBase;

/**
 * @class Door2
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door2(number, onUnlock) {
    DoorBase.apply(this, arguments);

    // ==== Напишите свой код для открытия третей двери здесь ====
    // Для примера дверь откроется просто по клику на неё
    this.popup.addEventListener('click', function() {
        this.unlock();
    }.bind(this));
    // ==== END Напишите свой код для открытия третей двери здесь ====
}
Door2.prototype = Object.create(DoorBase.prototype);
Door2.prototype.constructor = DoorBase;

/**
 * Сундук
 * @class Box
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Box(number, onUnlock) {
    DoorBase.apply(this, arguments);

    // ==== Напишите свой код для открытия сундука здесь ====
    // Для примера сундук откроется просто по клику на него
    this.popup.addEventListener('click', function() {
        this.unlock();
    }.bind(this));
    // ==== END Напишите свой код для открытия сундука здесь ====

    this.showCongratulations = function() {
        alert('Поздравляю! Игра пройдена!');
    };
}
Box.prototype = Object.create(DoorBase.prototype);
Box.prototype.constructor = DoorBase;
