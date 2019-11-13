//**** CONFIG AT BOTTOM OF THIS FILE ****

var editmode,
    playlist    	 = [],
    hasPlaylist 	 = false,
    videoClassName;

( function ( API_URL,
             LIMIT,
             ACCOUNT_ID,
             POLICY_KEY,
             playlistID
	) {

   var logUtil		  	= require( 'LogUtil' ),
       requester	  	= require( 'Requester' ),
       sitePage    	= require( 'ResourceLocatorUtil' ).getSitePage(),
       siteUrl     	= sitePage.getProperty( 'URL' ).value.toString(),
       _isExtWeb   	= (siteUrl.indexOf( 'komin' ) === -1),
       _filter, _playlist, _video, _targetGroup;


	_filter = _isExtWeb ? 'malmo-se' : 'Komin';

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

   function getURL( id ) {
      var url = API_URL
      .replace( '{account_id}', ACCOUNT_ID )
      .replace( '{playlist_id}', id );

      return url;
   }


   function getJsonData( id, limit ) {
       
      var url 			= getURL( id ),
          reqOptions = {
             contentType: 'application/x-www-form-urlencoded',
             headers: {
                'Authorization': 'BCOV-Policy ' + ( POLICY_KEY )
             }
          };
       
		requester.get(url, reqOptions)
		.done(function(result) {
          
			var limitCounter = 0;
         
         if ( result && result.videos && result.videos.length ) {

            for (let i = 0; i < result.videos.length; i++) {
               
               _targetGroup = null;
               _video = result.videos[i];
               
               if ( _video.custom_fields && _video.custom_fields.targetgroup ) {
               	_targetGroup = _video.custom_fields.targetgroup;
               }
               
               if (_targetGroup) {
                  if (_filter === _targetGroup) {
                     playlist.push( getVideoData( _video ) );
                     limitCounter++;
                  }
               } else {
                  playlist.push( getVideoData( _video ) );
                  limitCounter++;
               }

               hasPlaylist = true;
               
               if (limitCounter >= LIMIT) {
                  return;
               }
            }
         }
		})
      .fail(function(message){

         logUtil.error('Error getting video playlist: ' + message);

      }); 
   }

   function getVideoThumbnail( sources ) {
      var src = false,
          s;

      if ( sources && sources.length ) {
         for (var i = 0; i < sources.length; i += 1 ) {
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
   
	getJsonData(playlistID, LIMIT);
   
}(
   // **** CONFIG START ****

   // API_URL - Limit has to be set very high since filtering on custom fields is done later
   'https://edge.api.brightcove.com/playback/v1/accounts/{account_id}/playlists/{playlist_id}?limit=100',

   // Limit for number of videos to show in playlist
	scriptVariables.videoLimit,

   // Account ID
   '745456160001',

   // POLICY_KEY - Find it in the Brightcove studio website
   'BCpkADawqM0m4UEu0_9utV2NM23ptnXkZenjkdyW0tA71Ks_vwmXVxzF5Q213vR84jMj214bRifId4mVGbSH8QB1enGd2GK4mCLXIHrXrXJOJt_iZwf0riymHA0',

   // **** CONFIG END ****

   scriptVariables.playlistId
) );
