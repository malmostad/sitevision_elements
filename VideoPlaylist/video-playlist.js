/* global java, Packages, require, out, scriptVariables */
/* jshint strict:false, unused: true */
// jscs:disable

// @scriptVariables {svtype:text} playlistId (Spellista)
//                  - Välj en spellista


//**** CONFIG AT BOTTOM OF THIS FILE ****


var editmode,
    playlist    = [],
    hasPlaylist = false,
    videoClassName;

( function ( API_URL,
             LIMIT,
             CLIENT_ID,
             POLICY_KEY,
             KF_CLIENT_ID,
             KF_POLICY_KEY,
             KF_PLAYLIST_ID,
             playlistID,
             URL,
             httpclient ) {

    var currentPage = require( 'PortletContextUtil' ).getCurrentPage(),
        sitePage    = require( 'ResourceLocatorUtil' ).getSitePage(),
        siteUrl     = sitePage.getProperty( 'URL' ).value.toString(),
        _isExtWeb   = ( siteUrl.indexOf( 'komin' ) === -1 ),
        _playlist, _kfPlaylist, i;

    // 4 videos for komin!
    if ( !_isExtWeb ) {
        LIMIT = 4;
    }

    // class name - different for komin / malmo.se
    videoClassName = 'n' + LIMIT;

    editmode = !( require( 'VersionUtil' ).getCurrentVersion() );

    if ( !playlistID ) {
        return;
    }

    function getURL( id, limit, isKF ) {
        var url = API_URL
            .replace( '{client_id}', ( isKF ? KF_CLIENT_ID : CLIENT_ID ) )
            .replace( '{playlist_id}', id )
            .replace( '{limit}', limit );
        return new URL( url );
    }

    function getData( id, limit, isKF ) {

        var url, connection, getMethod, httpClient, data;

        try {

            url        = getURL( id, limit, isKF );
            connection = url.openConnection();

            getMethod  = new httpclient.methods.GetMethod( url.toString() );
            httpClient = new httpclient.HttpClient();

            httpClient.setConnectionTimeout( 10000 );
            httpClient.setHttpConnectionFactoryTimeout( 10000 );
            httpClient.setTimeout( 10000 );

            getMethod.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
            getMethod.setRequestHeader(
                'Authorization',
                'BCOV-Policy ' + ( isKF ? KF_POLICY_KEY : POLICY_KEY )
            );
            getMethod.setFollowRedirects( true );

            try {
                httpClient.executeMethod( getMethod );
                data = getMethod.getResponseBodyAsString();
            } catch ( e ) {
                out.println( 'Kunde inte hämta data från Brightcoves API<br>' );
            } finally {
                getMethod.releaseConnection();
            }
        } catch ( e ) {
            out.println( 'Kunde inte hämta data från Brightcoves API<br>' );
        }

        return ( data ? data : false );

    }

    function getJsonData( id, limit, isKF ) {
        var data = getData( id, limit, isKF ),
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

    function getVideoThumbnail( sources ) {
        var src = false,
            i, s;
        if ( sources && sources.length ) {
            for ( i = 0; i < sources.length; i += 1 ) {
                s = sources[ i ].src;
                s && ( src = s );
                if ( src && src.startsWith( 'https' ) ) {
                    break;
                }
            }
        }
        return src;
    }

    function getVideoData( video, useExternal ) {
        return {
            id                  : video.id.toString(),
            name                : video.name,
            thumbnailURL        : getVideoThumbnail( video.thumbnail_sources ),
            useExternalVideoLink: !!( useExternal )
        };
    }

    // Get playlist data
    if ( currentPage.equals( sitePage ) && _isExtWeb ) {
        _playlist   = getJsonData( playlistID, LIMIT - 1 );
        _kfPlaylist = getJsonData( KF_PLAYLIST_ID, 1, true );

    } else {
        _playlist = getJsonData( playlistID, LIMIT );
    }

    if ( _playlist && _playlist.videos && _playlist.videos.length ) {
        for ( i = 0; i < _playlist.videos.length && i < LIMIT; i += 1 ) {
            playlist.push( getVideoData( _playlist.videos[ i ] ) );
        }
        hasPlaylist = true;
    }

    if ( _kfPlaylist && _kfPlaylist.videos && _kfPlaylist.videos.length ) {
        playlist.push( getVideoData( _kfPlaylist.videos[ 0 ], true ) );
    }


}(
    // **** CONFIG START ****

    // API_URL
    'https://edge.api.brightcove.com/playback/v1/accounts/' +
    '{client_id}/playlists/{playlist_id}?limit={limit}',

    // Default limit for number of videos to fetch in playlist
    6,

    // Client ID
    '745456160001',

    // POLICY_KEY
    '{ENTER POLICY KEY HERE}',

    // KF Client ID
    '2494809924001',

    // KF_POLICY_KEY
    '{ENTER KF POLICY KEY HERE}',

    // ID for playlist Kommunfullmäktige
    '2623641282001',

    // **** CONFIG END ****

    scriptVariables.playlistId,
    java.net.URL,
    Packages.org.apache.commons.httpclient
) );
