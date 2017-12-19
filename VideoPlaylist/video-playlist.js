/* global java, Packages, require, out, scriptVariables */
/* jshint strict:false, unused: true */
// jscs:disable

// @scriptVariables {svtype:text} playlistId (Spellista)
//                  - Välj en spellista

var editmode,
    playlist     = [],
    hasPlaylist  = false,
    playlistInfo = {},
    video_class  = 'n6'; // jshint ignore:line

( function ( playlistID, URL, IOUtils ) {

    // **** CONFIG ****
    var TOKEN       = '--- Enter Brightcove API Token here---',
        API_URL     = 'http://api.brightcove.com/services/library?',
        LIST_PARAMS = {
            media_delivery: 'http',
            get_item_count: true,
            token         : TOKEN,
            command       : 'find_playlist_by_id',
            playlist_id   : ''
        },
        // **** CONFIG ****
        maxCount    = 6,
        siteUrl     = require( 'ResourceLocatorUtil' ).getSitePage()
                                                      .getProperty( 'URL' ).value.toString(),
        _playlist, i;

    // 4 videos for komin!
    if ( siteUrl.indexOf( 'komin' ) > -1 ) {
        maxCount    = 4;
        video_class = 'n4';
    }

    playlistID = ( playlistID && playlistID !== '-' ) ? playlistID : false;
    editmode   = !( require( 'VersionUtil' ).getCurrentVersion() );

    function extend() {
        var i, key;
        for ( i = 1; i < arguments.length; i += 1 ) {
            for ( key in arguments[ i ] ) {
                if ( arguments[ i ].hasOwnProperty( key ) ) {
                    if ( typeof arguments[ 0 ][ key ] === 'object' &&
                         typeof arguments[ i ][ key ] === 'object' ) {
                        extend( arguments[ 0 ][ key ], arguments[ i ][ key ] );
                    } else {
                        arguments[ 0 ][ key ] = arguments[ i ][ key ];
                    }
                }
            }
        }
        return arguments[ 0 ];
    }

    function params( obj ) {
        return Object.keys( obj ).map( function ( key ) {
            return key + '=' + obj[ key ];
        } ).join( '&' );
    }

    function getURL( id ) {
        var p   = extend( {}, LIST_PARAMS, { playlist_id: id } ),
            url = API_URL + params( p );
        return new URL( url );
    }

    function getData( id ) {
        var url, connection, data;
        try {
            url        = getURL( id );
            connection = url.openConnection();
            data       = IOUtils.toString( connection.getInputStream(), 'UTF-8' );
        } catch ( e ) {
            out.println( 'Kunde inte hämta data från Brightcoves API<br>' );
        }
        return ( data ? data : false );
    }

    function getJsonData( id ) {
        var data = getData( id ),
            json;
        if ( data ) {
            try {
                json = JSON.parse( data );
            } catch ( e ) {
                out.println( 'Fel i data från API:et, kunde inte skapa JSON-objekt.<br>' );
            }
        }
        return ( json ? json : undefined );
    }

    if ( playlistID ) {
        _playlist = getJsonData( playlistID );
        if ( _playlist && _playlist.id ) {
            playlistInfo = {
                id   : _playlist.id.toString(),
                name : _playlist.name,
                count: ( _playlist.videoIds ? _playlist.videoIds.length : 0 ).toString()
            };
            for ( i = 0; i < _playlist.videos.length && i < maxCount; i += 1 ) {
                if ( _playlist.videos[ i ] && _playlist.videos[ i ].id ) {
                    playlist.push( {
                        id                  : _playlist.videos[ i ].id.toString(),
                        name                : _playlist.videos[ i ].name,
                        thumbnailURL        : _playlist.videos[ i ].thumbnailURL,
                        useExternalVideoLink: _playlist.videos[ i ].useExternalVideoLink
                    } );
                }
            }
            hasPlaylist = true;
        }
    }

}(
    scriptVariables.playlistId,
    java.net.URL,
    Packages.org.apache.commons.io.IOUtils
) );