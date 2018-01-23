define(function(require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var dataFetch = ComponentView.extend({

        preRender: function() {
            this.checkIfResetOnRevisit();
        },

        postRender: function() {
            this.setReadyStatus();
            this.getData();
            this.setupInview();
        },

        getData: function() {
            console.log('In HERE');
            source = this.model.get('dataSource');
            console.log("1 " + source);
            $.getJSON( source , function( data ) {
                  console.log("2 " + source);
                  console.log(data);
                  concepts = data.concepts;
                  var items = [];
                  $.each( concepts, function( key, val ) {
                    items.push( "<option id='" + val.id + "' value='"+val.prefLabel+"'>" + val.prefLabel + "</option>" );
                  });
                 
                  $( "<select/>", {
                    "class": "activity-list",
                    html: items.join( "" )
                  }).appendTo( ".dataFetch-body-inner" );
                }
            );
        },

        setupInview: function() {
            var selector = this.getInviewElementSelector();

            if (!selector) {
                this.setCompletionStatus();
            } else {
                this.model.set('inviewElementSelector', selector);
                this.$(selector).on('inview', _.bind(this.inview, this));
            }
        },

        /**
         * determines which element should be used for inview logic - body, instruction or title - and returns the selector for that element
         */
        getInviewElementSelector: function() {
            if(this.model.get('body')) return '.component-body';

            if(this.model.get('instruction')) return '.component-instruction';
            
            if(this.model.get('displayTitle')) return '.component-title';

            return null;
        },

        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }
        },

        inview: function(event, visible, visiblePartX, visiblePartY) {
            if (visible) {
                if (visiblePartY === 'top') {
                    this._isVisibleTop = true;
                } else if (visiblePartY === 'bottom') {
                    this._isVisibleBottom = true;
                } else {
                    this._isVisibleTop = true;
                    this._isVisibleBottom = true;
                }

                if (this._isVisibleTop && this._isVisibleBottom) {
                    this.$(this.model.get('inviewElementSelector')).off('inview');
                    this.setCompletionStatus();
                }
            }
        },

        remove: function() {
            if(this.model.has('inviewElementSelector')) {
                this.$(this.model.get('inviewElementSelector')).off('inview');
            }
            
            ComponentView.prototype.remove.call(this);
        }
    },
    {
        template: 'text'
    });

    Adapt.register('dataFetch', dataFetch);

    return dataFetch;
});
