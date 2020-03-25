
Variables
---------

Bild
Puffbild för Typ "Standard (text & bild), eller poster för Typ "Video från filarkiv"
Defaultvärde: no-image.png

Rubriktext
Defaultvärde: Rubrik 

Brodtext
Defaultvärde: Text

Kantlinje
Bredd på kantlinje i pixlar. Sätt till negativt värde för att använda sidans globala inställning.
Defaultvärde: -1

Kantlinjefarg
Ange färg i ett format som är giltigt i CSS.
Defaultvärde: [använd global inställning]

Bakgrundsfarg
Ange färg i ett format som är giltigt i CSS.
Defaultvärde: [använd global inställning]

Halvbredd (DEPRECATED)
Inställningen gäller endast då puffen är ensam på en rad. Kryssa i för att begränsa puffens bredd och centrera den.
Defaultvärde: false
 
Lank
Om en Extern länk används ignoreras denna länk.
Defaultvärde: Sitepage
	
ExternLank
För att använda en extern länk: kryssa ur standardvärde "-" och klistra in en extern länk.
Defaultvärde: -

Typ
Typ av puff måste anges för att visningen ska fungera som förväntat
Valmöjligheter: 
- Standard (text & bild) [standard]
- Video från filarkiv [video]
- Video från YouTube [youtube]
- Video från Brightcove [brightcove] 
Defaultvärde: Standard (text & bild)

Videofil
Peka ut en videofil i filarkivet. *Endast vid Typ "Video från filarkiv"
Defaultvärde: placeholder-video.mp4
	
VideoId
Ange ID för video (YouTube eller Brightcove)
Defaultvärde: -

Stil
Halv bredd begränsar en ensam puffs bredd och centrerar den på sidan
Valmöjligheter: 
- Dynamisk bredd [dynamic]
- Halv bredd [half]
half, dynamic
Defaultvärde: Dynamisk bredd

