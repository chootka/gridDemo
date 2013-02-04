;(function( $ ) {

  var grid = {
    'cfg': {
      '$curTile':null,
      '$row':null,
      '$colA':null,
      '$colB':null,
      'colA_top':0,
      'colB_top':0,
      'padding':11,
      'current_closed_height':0,
      'scaleHeightA':false,
      'scaleHeightB':false,
      'animating':false
    },
    'evt': {
      'ready': function() {
        grid.fn.init();
      }
    },
    'fn': {
      'init': function() {
        $( 'body' ).on( 'mouseenter', '.grid-image', function() {
          var $this = $(this);
          var $cover = $(this).find( 'div.cover' );
          var $title = $cover.find( '.title' ).hide();
          var $cta = $cover.find( '.cta' ).show();
          var $button = $cover.find( 'button' ).show();
          $cover.css('border-bottom','1px solid #fff');
          $cover.animate( {
            height:$this.height()-42,
            bottom:15
          },
          { duration:200, 
            easing:'easeOutQuad',
            complete:function() {
            }
          });
        });

        $( 'body' ).on( 'mouseleave', '.grid-image', function() {
          var $cover = $(this).find( 'div.cover' );
          var $title = $cover.find( '.title' ).show();
          var $cta = $cover.find( '.cta' ).hide();
          var $button = $cover.find( 'button' ).hide();
          $cover.css('border-bottom','none');
          $cover.animate( {
            bottom:0,
            height:"20px"
          },
          { duration:200,
            easing:'easeOutQuad',
            complete:function() {
            }
          });
        });

        $( '.grid-image' ).on( 'click', function() {
          if( grid.cfg.animating ) return;
          var $clicked = $(this);
          grid.cfg.animating = true;
          // close the current open tile and open the one just clicked
          if(grid.cfg.$curTile != null) {
            // move the rows beneath the opened tile back up
            if( !grid.cfg.$curTile.hasClass( 'tall' ) ) {
              grid.cfg.$row
                .nextAll()
                .animate({
                  top: "-="+(grid.cfg.current_closed_height+grid.cfg.padding)
                },
                {duration: 300,easing: 'easeOutQuad'}
              );
              // move the columns back up, only if the tile is not a tallboy
              if( !grid.cfg.scaleHeightA ) {
                grid.cfg.$colA.animate({
                    top: "-="+(grid.cfg.current_closed_height+grid.cfg.padding)
                  },
                  {duration: 300,easing: 'easeOutQuad'}
                );
              }
              if( !grid.cfg.scaleHeightB ) {
                grid.cfg.$colB.animate({
                    top: "-="+(grid.cfg.current_closed_height+grid.cfg.padding)
                  },
                  {duration: 300,easing: 'easeOutQuad'}
                );
              }
            }
            // restore the previously opened tile's height
            grid.cfg.$curTile.animate({
                height:grid.cfg.current_closed_height
              },
              { duration: 300,
                easing: 'easeOutQuad',
                complete: function() {
                  // restore the previously opened tile's width and the left position,
                  // if this is a center tile, restore the left margin as well
                  if( grid.cfg.$curTile.hasClass( 'expand-center' ) ) {
                    grid.cfg.$curTile.animate({
                        width:240,
                        left:"34%"
                      },
                      { duration: 300,
                        easing: 'easeInQuad',
                        complete: function() {
                          var $cover = grid.cfg.$curTile.find( 'div.cover' );
                          $cover.fadeIn( 'fast' );
                          grid.fn.moveUp( $clicked );
                        }
                      }
                    );
                  }
                  // restore the previously opened tile's width
                  else {
                    grid.cfg.$curTile.animate({
                        width:240
                      },
                      { duration: 300,
                        easing: 'easeInQuad',
                        complete: function() {
                          var $cover = grid.cfg.$curTile.find( 'div.cover' );
                          $cover.fadeIn( 'fast' );
                          grid.fn.moveUp( $clicked );
                        }
                      }
                    );
                  }
                }
              }
            );
          }
          else {
            // open the tile!
            grid.fn.openTile( $clicked );
          }
        });
      },
      'moveUp': function( $clicked ) {
        // continue to move the rows beneath back up
        grid.cfg.$row
          .nextAll()
          .animate({
            top: "-="+(grid.cfg.current_closed_height+grid.cfg.padding)
          },
          {
            duration: 300,
            easing: 'easeOutQuad'
          }
        );
        // continue to move the columns beneath back up, if the tile is not a tallboy
        if( !grid.cfg.scaleHeightB ) {
          grid.cfg.$colB.animate({ 
              top:grid.cfg.colB_top
            },
            {duration: 300,easing: 'easeOutQuad'}
          );
        }
        else {
          grid.cfg.$colB.animate({ 
            height:411
          }, 
          { duration: 300,
            easing: 'easeOutQuad',
            complete: function() {
                //turn scale height off after the height of the tallboy has been restored
                grid.cfg.scaleHeightB = false;
              }
            }
          );
        }
        if( !grid.cfg.scaleHeightA ) {
          grid.cfg.$colA.animate({ 
              top:grid.cfg.colA_top
            }, 
            {duration: 300,easing: 'easeOutQuad'}
          );
        }
        else {
          grid.cfg.$colA.animate({ 
              height:411
            }, 
            { duration: 300,
              easing: 'easeOutQuad',
              complete: function() {
                //turn scale height off after the height of the tallboy has been restored
                grid.cfg.scaleHeightA = false;
              }
            }
          );
        }
        setTimeout(function() {
            // finally, open the tile (if it is not already open)
            if($clicked[0] !== grid.cfg.$curTile[0]) {
              grid.fn.openTile( $clicked );
            }
            else {
              // or set $curTile back to null so on next click, the tile is simply opened
              grid.cfg.$curTile = null;
              // set animating back to false, so tiles are clickable again
              grid.cfg.animating = false;
            }
          }, 
          800
        );
      },
      'moveDown': function() {
        // now expand the selected tile's height
        grid.cfg.$curTile.animate({ 
            height: 411
          },
          {duration: 300,easing: 'easeOutQuad'}
        );
        // continue to move the rows beneath the tile down as the height grows
        grid.cfg.$row
          .nextAll()
          .animate({
              top: "+="+(grid.cfg.current_closed_height+grid.cfg.padding)
            },
            {
              duration: 300,
              easing: 'easeOutQuad'
            }
          );
        // continue to move the columns beneath the tile down as the height grows
        if( !grid.cfg.scaleHeightA ) {
          grid.cfg.$colA.animate({
              top: "+="+(grid.cfg.current_closed_height+grid.cfg.padding)
            },
            {
              duration: 300,
              easing: 'easeOutQuad'
            }
          );
        }
        if( !grid.cfg.scaleHeightB ) {
          grid.cfg.$colB.animate({
              top: "+="+(grid.cfg.current_closed_height+grid.cfg.padding)
            },
            {
              duration: 300,
              easing: 'easeOutQuad',
              complete: function() {
                // set animating back to false, so tiles are clickable again
                grid.cfg.animating = false;
              }
            }
          );
        }
      },
      'openTile': function( tile ) {
        grid.cfg.$curTile = tile;
        grid.cfg.current_closed_height = tile.height();
        var col = grid.cfg.$curTile.data('col')
            ,$row = grid.cfg.$curTile.closest('.row')
            ,row = grid.cfg.$curTile.closest('.row').data('row')
            ,$colA
            ,$colB
            ,$cover = grid.cfg.$curTile.find( 'div.cover' );

        if( col == 1 ) {
          // there won't always be a $colA or $colB if a tallboy from the row above is extending down
          // if so, grab $colA or $colB from one row up
          $colA = $row.find( "[data-col='" + 2 + "']" );
          if ( $colA.height() == null ) {
            grid.cfg.scaleHeightA = true;
            $colA = $row.prev().find( "[data-col='" + 2 + "']" );
          }

          $colB = $row.find( "[data-col='" + 3 + "']" );
          if ( $colB.height() == null ) {
            grid.cfg.scaleHeightB = true;
            $colB = $row.prev().find( "[data-col='" + 3 + "']" );
          }
        }
        else if( col == 2 ) {
          // there won't always be a $colA or $colB if a tallboy from the row above is extending down
          // if so, grab $colA or $colB from one row up
          $colA = $row.find( "[data-col='" + 1 + "']" );
          if ( $colA.height() == null ) {
            grid.cfg.scaleHeightA = true;
            $colA = $row.prev().find( "[data-col='" + 1 + "']" );
          }

          $colB = $row.find( "[data-col='" + 3 + "']" );
          if ( $colB.height() == null ) {
            grid.cfg.scaleHeightB = true;
            $colB = $row.prev().find( "[data-col='" + 3 + "']" );
          }
        }
        else if( col == 3 ) {
          // there won't always be a $colA or $colB if a tallboy from the row above is extending down
          // if so, grab $colA or $colB from one row up
          $colA = $row.find( "[data-col='" + 1 + "']" );
          if ( $colA.height() == null ) {
            grid.cfg.scaleHeightA = true;
            $colA = $row.prev().find( "[data-col='" + 1 + "']" );
          }

          $colB = $row.find( "[data-col='" + 2 + "']" );
          if ( $colB.height() == null ) {
            grid.cfg.scaleHeightB = true;
            $colB = $row.prev().find( "[data-col='" + 2 + "']" );
          }
        }

        grid.cfg.$row = $row;
        grid.cfg.$colA = $colA;
        grid.cfg.$colB = $colB;
        grid.cfg.colA_top = $colA.css('top');
        grid.cfg.colB_top = $colB.css('top');

        $cover.fadeOut( 'fast' );

        // move the rows beneath down
        grid.cfg.$row
          .nextAll()
          .animate({
              top: "+="+(grid.cfg.current_closed_height+grid.cfg.padding)
            },
            {duration: 300,easing: 'easeOutQuad'}
          );
        // move the neighboring column B down
        // or scaling its height, if the scaleHeight flag is set ( it should be if $colB is a tallboy)
        if( grid.cfg.scaleHeightB ) {
          grid.cfg.$colB.animate({
              height: grid.cfg.current_closed_height
            },
            {duration: 300,easing: 'easeOutQuad'}
          );
        }
        else {
          grid.cfg.$colB.animate({
              top: "+="+(grid.cfg.current_closed_height+grid.cfg.padding)
            },
            {duration: 300,easing: 'easeOutQuad'}
          );
        }
        // move the neighboring column A down
        // or scaling its height, if the scaleHeight flag is set ( it should be if $colA is a tallboy)
        if( grid.cfg.scaleHeightA ) {
          grid.cfg.$colA.animate({
              height: grid.cfg.current_closed_height
            },
            {duration: 300,easing: 'easeOutQuad'}
          );
        }
        else {
          grid.cfg.$colA.animate({
              top: "+="+(grid.cfg.current_closed_height+grid.cfg.padding)
            },
            {duration: 300,easing: 'easeOutQuad'}
          );
        }
        setTimeout( function() {
            // expand the selected tile's width
            if( grid.cfg.$curTile.hasClass( 'expand-center' ) ) {
              grid.cfg.$curTile.animate({
                  width: 742,
                  left:0
                }, 
                { duration: 300,
                  easing: 'easeInQuad',
                  complete: function() {
                    if( !grid.cfg.$curTile.hasClass( 'tall' ) ) {
                      setTimeout( grid.fn.moveDown(), 300 );
                    }
                    else {
                      grid.cfg.animating = false;
                    }
                  }
                }
              );
            }
            else {
              grid.cfg.$curTile.animate({
                  width: 742
                }, 
                { duration: 300,
                  easing: 'easeInQuad',
                  complete: function() {
                    if( !grid.cfg.$curTile.hasClass( 'tall' ) ) {
                      setTimeout( grid.fn.moveDown(), 300 );
                    }
                    else {
                      grid.cfg.animating = false;
                    }
                  }
                }
              );
            }
          },
          300
        );
      }
    }
  }

  grid.evt.ready();

}( $ ));