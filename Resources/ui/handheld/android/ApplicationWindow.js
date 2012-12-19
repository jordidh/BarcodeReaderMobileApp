//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	var FirstView = require('ui/common/FirstView');
		
	//create component instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#AAAAAA',
		navBarHidden:true,
		exitOnClose:true
	});
		
	//create a button to work with the camera	
	var button = Ti.UI.createButton({
		title: 'Use camera',
		width: 200,
		height: 50,
		bottom: 14,
		zIndex: 2
	});
	
	button.addEventListener('click', function(e){
		Ti.Media.showCamera({
			success:function(e){
				if (e.mediaType === Ti.Media.MEDIA_TYPE_PHOTO){
					//Photo
					var imageView = Ti.UI.createImageView({
						image:e.media,
						width:288,
						height:215,
						top:12,
						zIndex:1
					});
					self.add(imageView);
				}
				else if (e.mediaType === Ti.Media.MEDIA_TYPE_VIDEO){
					//Video
					var w = Ti.UI.createWindow({
						title:'New video',
						backgroundColor:'#000000'
					});
					
					var videoPlayer = Ti.Media.createVideoPlayer({
						media:e.media
					});
					
					w.add(videoPlayer);
					videoPlayer.addEventListener('complete',function(e){
						w.remove(videoPlayer);
						videoPlayer = null;
						w.close();
					});
				}
			},
			error:function(e){
				alert('Some error');
			},
			cancel:function(e){
				alert('Cancel');
			},
			allowEditing:true,
			saveToPhotoGallery:true,
			mediaTyped:[Ti.Media.MEDIA_TYPE_PHOTO, Ti.Media.MEDIA_TYPE_VIDEO],
			videoQuality:Ti.Media.QUALITY_HIGH
		});
	});
	
	//create a button to work with the database	
	var buttonDB = Ti.UI.createButton({
		title: 'Use Database',
		width: 200,
		height: 50,
		bottom: 74,
		zIndex: 2
	});
	
	buttonDB.addEventListener('click', function(e){
		//create or open DB
		var db = Ti.Database.open('weatherDB');
		db.execute('CREATE TABLE IF NOT EXISTS station(id INTEGER PRIMARY KEY, name TEXT, capturedLat REAL, capturedLong REAL);');
		db.close();
		
		//store data
		var db = Ti.Database.open('weatherDB');
		db.execute('INSERT INTO station (name,capturedLat, capturedLong) VALUES (?,?,?)', 'station', 1.2, 1.3);
		var lastID = db.lastInsertRowID; // presumes `city` has an auto-increment column
		db.close();
		
		//retrieve data
		var db = Ti.Database.open('weatherDB');
		var stationWeatherRS = db.execute('SELECT id,name,capturedLat,capturedLong FROM station');
		while (stationWeatherRS.isValidRow())
		{
		  var stationId = stationWeatherRS.fieldByName('id');
		  var stationName = stationWeatherRS.fieldByName('name');
		  stationWeatherRS.next();
		}
		stationWeatherRS.close();
		db.close();
		
		alert('Database created/opened and data stored and retrieved');
	});
	
	//create a button to work with the database	
	var buttonBarcode = Ti.UI.createButton({
		title: 'Use barcode',
		width: 200,
		height: 50,
		bottom: 124,
		zIndex: 2
	});
	
	buttonBarcode.addEventListener('click', function(e){
		// load the Scandit SDK module
		var scanditsdk = require("com.mirasense.scanditsdk"); 
		
		// disable the status bar for the camera view on the iphone and ipad
		if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad'){
		     Titanium.UI.iPhone.statusBarHidden = true;
		} 
		
		// instantiate the Scandit SDK Barcode Picker view
		var picker = scanditsdk.createView({
		     "width":Ti.Platform.displayCaps.platformWidth,
		     "height":Ti.Platform.displayCaps.platformHeight
		}); 
		
		// Initialize the barcode picker,
		picker.init("RG1MikksEeKQF1smgv1Xb6Q3ZnsfbQJxUT6XUHeL1eQ", 0); 
		
		// Set callback functions for when scanning succeeds and for when the
		// scanning is canceled.
		picker.setSuccessCallback(function(e) {
		     alert("success (" + e.symbology + "): " + e.barcode);
		     //picker.stopScanning();
		     window.close();
		});
		picker.setCancelCallback(function(e) { alert("canceled");
			//picker.stopScanning();
			window.close();
		});
		
		// add a tool bar at the bottom of the scan view with a cancel button
		// (iphone/ipad only)
		if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad'){
			picker.showToolBar(true); 
		}
		
		// Start the scanning process.
		picker.setQrEnabled(true);
		picker.startScanning();
		
		// Create a window to add the picker to and display it.
		var window = Titanium.UI.createWindow({
		     title:'Scandit SDK',
		     backgroundColor:'#fff',
		});
		window.add(picker);
		window.open();
	});

	//construct UI
	var firstView = new FirstView();
	self.add(firstView);
	self.add(button);
	self.add(buttonDB);
	self.add(buttonBarcode);
	
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
