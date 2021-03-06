/*!
 * Toastify js 1.3.2
 * https://github.com/apvarun/toastify-js
 * @license MIT licensed
 *
 * Copyright (C) 2018 Varun A P
 */
(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        require('./toastify.css');
        module.exports = factory();
    }
    else {
        root.Toastify = factory();
    }
})(this, function(global) {
    // Object initialization
    var Toastify = function(options) {
            // Returning a new init object
            return new Toastify.lib.init(options);
        },
        // Library version
        version = '1.3.2';

    // Defining the prototype of the object
    Toastify.lib = Toastify.prototype = {
        toastify: version,

        constructor: Toastify,

        // Initializing the object with required parameters
        init: function(options) {
            // Verifying and validating the input object
            if (!options) {
                options = {};
            }

            // Creating the options object
            this.options = {};

            // Validating the options
            this.options.text = options.text || 'No text ... !'; // Display message
            this.options.time = options.time || new Date().toLocaleTimeString();
            this.options.typeText = options.typeText || '';
            this.options.duration = options.duration || 3000; // Display duration
            this.options.autoClose = options.autoClose || false;
            this.options.selector = options.selector; // Parent selector
            this.options.callback = options.callback || function() {
                };
            this.options.actions = options.actions || [];
            this.options.destination = options.destination; // On-click destination
            this.options.newWindow = options.newWindow || false; // Open destination in new window
            this.options.close = options.close || false; // Show toast close icon
            this.options.gravity = options.gravity == 'bottom' ? 'toastify-bottom' : 'toastify-top'; // toast position - top or bottom
            this.options.positionLeft = options.positionLeft || false; // toast position - left or right
            this.options.backgroundColor = options.backgroundColor; // toast background color
            this.options.avatar = options.avatar || ''; // toast position - left or right
            this.options.className = options.className || ''; // additional class names for the toast

            // Returning the current object for chaining functions
            return this;
        },

        // Building the DOM element
        buildToast: function() {
            // Validating if the options are defined
            if (!this.options) {
                throw 'Toastify is not initialized';
            }

            // Creating the DOM object
            var divElement = document.createElement('div');
            divElement.className = 'toastify on ' + this.options.className;

            // Positioning toast to left or right
            if (this.options.positionLeft === true) {
                divElement.className += ' toastify-left';
            }
            else {
                divElement.className += ' toastify-right';
            }

            // Assigning gravity of element
            divElement.className += ' ' + this.options.gravity;

            if (this.options.backgroundColor) {
                divElement.style.background = this.options.backgroundColor;
            }

            var divElementContent = '';

            if (this.options.time) {
                divElementContent += '<span class="toastify-time">' + this.options.time + '</span>';
            }
            if (this.options.typeText) {
                divElementContent += '<span class="toastify-type">' + this.options.typeText + '</span>';
            }
            divElementContent += '<br/><p class="toastify-content">' + this.options.text + '</p>';
            divElement.innerHTML = divElementContent;

            // Adding the toast message

            if (this.options.avatar !== '') {
                var avatarElement = document.createElement('img');
                avatarElement.src = this.options.avatar;

                avatarElement.className = 'toastify-avatar';

                if (this.options.positionLeft === true) {
                    // Adding close icon on the left of content
                    divElement.appendChild(avatarElement);
                }
                else {
                    // Adding close icon on the right of content
                    divElement.insertAdjacentElement('beforeend', avatarElement);
                }
            }

            // Adding a close icon to the toast
            if (this.options.close === true) {
                // Create a span for close element
                var closeElement = document.createElement('span');
                closeElement.innerHTML = '&#10006;';

                closeElement.className = 'toast-close';

                // Triggering the removal of toast from DOM on close click
                closeElement.addEventListener(
                    'click',
                    function(event) {
                        event.stopPropagation();
                        this.removeElement(event.target.parentElement);
                        window.clearTimeout(event.target.parentElement.timeOutValue);
                    }.bind(this)
                );

                //Calculating screen width
                var width = window.innerWidth > 0 ? window.innerWidth : screen.width;

                // Adding the close icon to the toast element
                // Display on the right if screen width is less than or equal to 360px
                if (this.options.positionLeft === true && width > 360) {
                    // Adding close icon on the left of content
                    divElement.insertAdjacentElement('afterbegin', closeElement);
                }
                else {
                    // Adding close icon on the right of content
                    divElement.appendChild(closeElement);
                }
            }

            // Adding an on-click destination path
            if (typeof this.options.destination !== 'undefined') {
                divElement.addEventListener('click', function(event) {
                        event.stopPropagation();
                        if (this.options.newWindow === true) {
                            window.open(this.options.destination, '_blank');
                        }
                        else {
                            window.location = this.options.destination;
                        }
                    }.bind(this)
                );
            }

            if (typeof this.options.actions !== 'undefined') {

                for (var key in this.options.actions) {
                    var actionElement = document.createElement('button');
                    var action = this.options.actions[key];
                    actionElement.innerHTML = action.name;

                    actionElement.setAttribute('data-name', key);
                    if (action.uniqueId) {
                        actionElement.setAttribute('id', action.id + '-' + action.uniqueId + '-' + key);
                    }
                    else {
                        actionElement.setAttribute('id', action.id + '-' + key);
                    }
                    actionElement.disabled = action.disable;
                    actionElement.className = 'toastify-button';

                    actionElement.addEventListener('click', function(event) {
                            event.stopPropagation();
                            this.options.actions[event.target.getAttribute('data-name')].callback &&
                            this.options.actions[event.target.getAttribute('data-name')].callback(event);
                        }.bind(this)
                    );

                    divElement.appendChild(actionElement);
                }
            }

            // Returning the generated element
            return divElement;
        },

        // Displaying the toast
        showToast: function(callback) {
            // Creating the DOM object for the toast
            var toastElement = this.buildToast();

            callback && callback(toastElement);

            // Getting the root element to with the toast needs to be added
            var rootElement;
            if (typeof this.options.selector === 'undefined') {
                rootElement = document.body;
            }
            else {
                rootElement = document.getElementById(this.options.selector);
            }

            // Validating if root element is present in DOM
            if (!rootElement) {
                throw 'Root element is not defined';
            }

            // Adding the DOM element
            rootElement.insertBefore(toastElement, rootElement.firstChild);

            // Repositioning the toasts in case multiple toasts are present
            Toastify.reposition();

            if (this.options.autoClose) {
                toastElement.timeOutValue = window.setTimeout(
                    function() {
                        // Remove the toast from DOM
                        this.removeElement(toastElement);
                    }.bind(this),
                    this.options.duration
                ); // Binding `this` for function invocation
            }
            // Supporting function chaining
            return this;
        },

        // Removing the element from the DOM
        removeElement: function(toastElement) {
            // Hiding the element
            // toastElement.classList.remove("on");
            toastElement.className = toastElement.className.replace(' on', '');

            // Removing the element from DOM after transition end
            window.setTimeout(
                function() {
                    // Remove the elemenf from the DOM
                    toastElement.parentNode.removeChild(toastElement);

                    // Calling the callback function
                    this.options.callback.call(toastElement);

                    // Repositioning the toasts again
                    Toastify.reposition();
                }.bind(this),
                400
            ); // Binding `this` for function invocation
        }
    };

    // Positioning the toasts on the DOM
    Toastify.reposition = function() {
        // Top margins with gravity
        var topLeftOffsetSize = {
            top: 15,
            bottom: 15
        };
        var topRightOffsetSize = {
            top: 15,
            bottom: 15
        };
        var offsetSize = {
            top: 15,
            bottom: 15
        };

        // Get all toast messages on the DOM
        var allToasts = document.getElementsByClassName('toastify');

        var classUsed;

        // Modifying the position of each toast element
        for (var i = 0; i < allToasts.length; i++) {
            // Getting the applied gravity
            if (containsClass(allToasts[i], 'toastify-top') === true) {
                classUsed = 'toastify-top';
            }
            else {
                classUsed = 'toastify-bottom';
            }

            var height = allToasts[i].offsetHeight;
            classUsed = classUsed.substr(9, classUsed.length - 1);
            // Spacing between toasts
            var offset = 15;

            var width = window.innerWidth > 0 ? window.innerWidth : screen.width;

            // Show toast in center if screen with less than or qual to 360px
            if (width <= 360) {
                // Setting the position
                allToasts[i].style[classUsed] = offsetSize[classUsed] + 'px';

                offsetSize[classUsed] += height + offset;
            }
            else {
                if (containsClass(allToasts[i], 'toastify-left') === true) {
                    // Setting the position
                    allToasts[i].style[classUsed] = topLeftOffsetSize[classUsed] + 'px';

                    topLeftOffsetSize[classUsed] += height + offset;
                }
                else {
                    // Setting the position
                    allToasts[i].style[classUsed] = topRightOffsetSize[classUsed] + 'px';

                    topRightOffsetSize[classUsed] += height + offset;
                }
            }
        }

        // Supporting function chaining
        return this;
    };

    function containsClass(elem, yourClass) {
        if (!elem || typeof yourClass !== 'string') {
            return false;
        }
        else if (
            elem.className &&
            elem.className
                .trim()
                .split(/\s+/gi)
                .indexOf(yourClass) > -1
        ) {
            return true;
        }
        else {
            return false;
        }
    }

    // Setting up the prototype for the init object
    Toastify.lib.init.prototype = Toastify.lib;

    // Returning the Toastify function to be assigned to the window object/module
    return Toastify;
});