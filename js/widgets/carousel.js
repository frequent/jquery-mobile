//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Formats groups of images into a carousel.
//>>label: Carousel
//>>group: Widgets
//>>css.structure: ../css/structure/jquery.mobile.carousel.css
//>>css.theme: ../css/themes/default/jquery.mobile.theme.css

define( [ 
	"jquery",
	"../jquery.mobile.widget"
	"../jquery.mobile.core"
], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");
    (function( $, undefined ) {

$.widget( "mobile.carousel", $.extend( {

	options: {
		barrel: null,
		bullets: true,
		bulletsPos: "bottom",
		corners: false,
		captions: false,
		captionpos: "bottom",
		captiontheme: "a",
		carouseltransition: "slide",
		enhanced: false,
		heading: "h1,h2,h3,h4,h5,h6,legend",
		inset: false,
		shadow: false
	},

	_create: function () {
		this._ui = {};
		this.refresh( true );
	},

	_enhance: function ( el, o ) {
		var i, item, radio, label, barrel, containsLink, captionsHeading, prefix,
			captionsContent,
			id = this.uuid,
			items = el.children(),
			len = items.length,
			carouselClasses = "ui-carousel ",
			fragment = document.createDocumentFragment(),
			prefix = 'radio-' + id,
			emptyString = "";

		for ( i = 0; i < len; i += 1 ) {
			item = items[i];

			// captions
			if ( o.captions ) {
				containsLink = item.children[ 0 ].tagName === "A";
				captionsContent = $( item )
					.find( containsLink ? "a *" : "*" )
					.not( "img" )
					.wrap( "<div class='ui-carousel-captions-content ui-bar-" + 
							o.captiontheme + " ui-carousel-captions-" + 
									o.captionpos + "'></div>")
					.parent();
				captionsHeading = captionsContent
					.find( o.heading )
					.addClass( "ui-carousel-captions-heading" );
			}

			// radios bullets
			if ( o.bullets ) {
				label = $( "<label data-" + $.mobile.ns + "-iconpos='notext'></label>" );
				radio = $( "<input type='radio' name='" + prefix + "' value='" + 
						prefix + "-" + i + "'/>" )
						// set item as reference
						.data( "reference", $( item ) );

				if ( i === 0 ) {
					radio.prop('checked', true);
					$( item ).addClass( "ui-carousel-active" );
				}
				label.append( radio );
				fragment.appendChild( label[0] );
			}
		}

		carouselClasses += o.captions ? " ui-carousel-captions" : emptyString;
		carouselClasses += o.inset ? " ui-carousel-inset" : emptyString;

		if ( !!o.inset ) {
			carouselClasses += o.corners ? " ui-corner-all" : emptyString;
			carouselClasses += o.shadow ? " ui-shadow" : emptyString;
		}

		if ( o.bullets ) {
			carouselClasses += " ui-carousel-bullets";
			barrel = $( "<div id='ui-carousel-barrel-" + id + "' class='" +
					"ui-carousel-controls ui-carousel-controls-" + o.bulletsPos + 
							"'></div>");
			while ( fragment.firstChild ) {
				$( fragment.firstChild ).children().checkboxradio();
				barrel.append(fragment.firstChild);
			}
			this._ui.barrel = barrel;
		}

		el.addClass( carouselClasses );
	},

	refresh: function ( create ) {
		var el = this.element,
			o = this.options;

		if ( !o.enhanced ) {
			// clear barrel on refesh
			if ( !create ) {
				$( "#ui-carousel-barrel-" + this.uuid ).remove();
			}
			// generate UI and barrel and append to DOM
			this._enhance( el, o );
			el[ o.bulletsPos === "top" ? "before" : "after" ]( this._ui.barrel );
		} else {
			this._ui.barrel = $( "#" + o.barrel );
		}
		this._on( this._ui.barrel.find( "input" ), { 
			change: "_onChange"
		});
	},

	_onChange: function (e) {
		var el = this.element,
			o = this.options,
			events = this._transitionEndEvents,
			currentActive = el.children().filter( ".ui-carousel-active" ),
			nextActive = $( e.target ).data( "reference" ),
			transition = $.mobile._maybeDegradeTransition( o.carouseltransition );
		
		this._transitionClasses = transition + " in out ";

		// click on active radio
		if ( nextActive.hasClass( "ui-carousel-active" ) ) {
			return;
		}

		currentActive.addClass( transition + " out" );
		nextActive
			.addClass( transition + " in ui-carousel-active" )
			.animationComplete( function () {
				nextActive.removeClass( transition + " in " );
				currentActive.removeClass( transition + " ui-carousel-active in out" );
			});

	}
}, $.mobile.behaviors.addFirstLastClasses ) );

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");