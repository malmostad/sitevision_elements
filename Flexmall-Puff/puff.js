/* eslint no-unused-vars:1 */

var teaser                 = {
        type           : 'standard',
        imageUrl       : false,
        videoUrl       : false,
        videoId        : false,
        bcPlayerId     : 'default',
        headingText    : false,
        bodyText       : false,
        href           : false,
        styleAttr      : [],
        imgStyleAttr   : '',
        clsNameModifier: ''
    },
    rowFullBackgroundColor = '';

(function (config) {

    'use strict';

    var propertyUtil          = require('PropertyUtil'),
        currentPage           = require('PortletContextUtil').currentPage,
        sitePage              = require('ResourceLocatorUtil').sitePage,
        _teaserTypes          = [ 'standard', 'imagebg', 'video', 'youtube', 'brightcove' ],
        _bcPlayers            = {
            'standard': 'ac887454-ec8b-4ffc-a530-4af5c1c8e8c7',
            'komin'   : '89c148e0-a23e-47f7-9efd-51723d6dbae4'
        },

        globalBorderWidth     = propertyUtil.getInt(currentPage, 'teaserBorderWidth', 0),
        globalUseBorderRadius = propertyUtil.getString(currentPage, 'teaserUseBorderRadius'),

        _innerRadius          = -1;

    function setBorders() {
        var borders = config.Kantlinjer.split(''),
            cssProp = [ 'border-top-style', 'border-right-style',
                        'border-bottom-style', 'border-left-style' ],
            i;
        if (borders.length !== 4) {
            return;
        }
        for (i = 0; i < 4; i += 1) {
            if (borders[ i ] === 'x') {
                teaser.styleAttr.push(cssProp[ i ] + ': solid !important;');
            } else if (borders[ i ] === '-') {
                teaser.styleAttr.push(cssProp[ i ] + ': none !important;');
            }
        }
    }

    /*----- COMMON SETTINGS -----*/

    if (config.Typ && config.Typ !== 'standard' && _teaserTypes.indexOf(config.Typ) > 0) {
        // video, youtube, brightcove, imagebg, standard (text/bild)
        teaser.type = config.Typ;
    }

    if (config.Bild && config.Bild.toString() !== 'no-image.png') {
        teaser.imageUrl = propertyUtil.getString(config.Bild, 'URL', '');
        teaser.imageUrl = teaser.imageUrl ? teaser.imageUrl : false;
    }

    teaser.headingText = (config.Rubriktext &&
                          config.Rubriktext !== 'Rubrik' &&
                          config.Rubriktext.trim() !== '') ? config.Rubriktext : false;

    teaser.bodyText = (config.Brodtext &&
                       config.Brodtext !== 'Text' &&
                       config.Brodtext.trim() !== '') ? config.Brodtext : false;

    if (config.ExternLank && config.ExternLank !== '-') {
        teaser.href = config.ExternLank;
        teaser.href = teaser.href ? teaser.href : false;
    } else if (config.Lank && !config.Lank.equals(sitePage)) {
        teaser.href = propertyUtil.getString(config.Lank, 'URL', '');
        teaser.href = teaser.href ? teaser.href : false;
    }

    if (config.TextFarg && config.TextFarg.charAt(0) !== '[') {
        teaser.styleAttr.push('color:' + config.TextFarg + ' !important;');
    }

    if (config.Kantlinjer && config.Kantlinjer !== 'use-global') {
        setBorders();
    }

    if (config.Textjustering && config.Textjustering.charAt(0) !== '[' && config.Textjustering !==
        '-') {
        teaser.styleAttr.push('text-align:' + config.Textjustering + ' !important;');
    }

    if (config.RundadeHorn && config.RundadeHorn !== '-') {
        teaser.styleAttr.push('border-radius:' + config.RundadeHorn + ' !important;');
    }

    if (config.Kantlinje && config.Kantlinje >= 0) {
        // Bredd på kantlinje i pixlar.
        // Sätt till negativt värde för att använda sidans globala inställning.
        teaser.styleAttr.push('border-width:' + config.Kantlinje + 'px !important;');
    }

    if (config.Kantlinje && config.Kantlinje >= 0) {
        if (config.RundadeHorn === '6px') {
            _innerRadius = (6 - config.Kantlinje);
        } else if (config.RundadeHorn === '0') {
            _innerRadius = 0;
        } else if (globalUseBorderRadius === 'Ja') {
            _innerRadius = (6 - config.Kantlinje);
        }
    } else {
        if (globalBorderWidth > 0) {
            if (config.RundadeHorn === '6px') {
                _innerRadius = (6 - globalBorderWidth);
            } else if (config.RundadeHorn === '0') {
                _innerRadius = 0;
            }
        }
    }

    if (_innerRadius >= 0) {
        if (!config.Brodtext || config.Brodtext === 'Text' || config.Brodtext.trim() !== '') {
            teaser.imgStyleAttr = 'border-radius:' + _innerRadius + 'px !important;';
        } else {
            teaser.imgStyleAttr = 'border-radius:' + _innerRadius + 'px ' +
                                  _innerRadius + 'px 0 0 !important;';
        }
    }

    if (config.Kantlinjefarg && config.Kantlinjefarg.charAt(0) !== '[') {
        // Ange färg i ett format som är giltigt i CSS.
        // Defaultvärde: [använd global inställning]
        teaser.styleAttr.push('border-color:' + config.Kantlinjefarg + ' !important;');
    }

    if (config.Bakgrundsfarg && config.Bakgrundsfarg.charAt(0) !== '[') {
        // Ange färg i ett format som är giltigt i CSS.
        // Defaultvärde: [använd global inställning]
        teaser.styleAttr.push('background-color:' + config.Bakgrundsfarg + ' !important;');
    }

    if (config.FargBakgrundsplattaFullbredd && config.FargBakgrundsplattaFullbredd !== '-') {
        rowFullBackgroundColor = config.FargBakgrundsplattaFullbredd;
    }

    /*----- TEXT AND IMAGE BACKGROUND SETTINGS -----*/

    if (teaser.type === 'imagebg' && teaser.imageUrl) {
        teaser.styleAttr.push('background-image: url(' + teaser.imageUrl + ');');
    }

    /*----- VIDEO FILE TEASER SETTINGS -----*/

    if (teaser.type === 'video' && config.Videofil) {
        teaser.videoUrl = propertyUtil.getString(config.Videofil, 'URL', '')
            .replace('/download/', '/download-streamed/');
        teaser.videoUrl = teaser.videoUrl ? teaser.videoUrl : false;
    }

    /*----- YOUTUBE TEASER SETTINGS -----*/

    // 4CbLXeGSDxg
    // ELLER
    // https://www.youtube.com/watch?v=4CbLXeGSDxg

    if (teaser.type === 'youtube' && config.VideoId) {
        if (config.VideoId.indexOf('?v=') > -1) {
            teaser.videoId = config.VideoId.substr(config.VideoId.indexOf('?v=') + 3);
        } else {
            teaser.videoId = config.VideoId;
        }
    }

    /*----- BRIGHTCOVE TEASER SETTINGS -----*/

    // 4865258261001

    if (teaser.type === 'brightcove' && config.VideoId) {
        teaser.videoId = config.VideoId;
        if (sitePage.getProperty('URL').value.toString().indexOf('komin') > -1) {
            // Intranet
            teaser.bcPlayerId = _bcPlayers.komin;
        } else {
            teaser.bcPlayerId = _bcPlayers.standard;
        }
    }

    /*----- CSS MODIFIER COMMON TEASER SETTING -----*/

    teaser.styleAttr = teaser.styleAttr.join('');

    if (teaser.type === 'standard' && !teaser.imageUrl) {
        teaser.clsNameModifier += ' teaser--txt ';
    } else if (teaser.type === 'imagebg' && teaser.imageUrl) {
        teaser.clsNameModifier += ' teaser--bgimg ';
    } else if (teaser.type === 'video') {
        teaser.clsNameModifier += ' teaser--video ';
    } else if (teaser.type === 'youtube') {
        teaser.clsNameModifier += ' teaser--youtube ';
    }

    // NOTE: Halvbredd is a legacy setting, not used anymore!
    // Style only used for :only-child
    if ((config.Stil && config.Stil !== 'dynamic') || config.Halvbredd) {
        // conf.Stil => half, dynamic
        teaser.clsNameModifier += ' teaser--halfwidth ';
    }

}(scriptVariables));

