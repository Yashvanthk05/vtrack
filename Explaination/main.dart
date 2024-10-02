import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
class LocationChecker extends StatefulWidget {
  @override
  _LocationCheckerState createState() => _LocationCheckerState();
}
class _LocationCheckerState extends State<LocationChecker> {
  Position? _currentPosition;
  List<Map<String, double>> polygon = [
	{'latitude': 12.84252844169831, 'longitude': 80.15087616357157},
	{'latitude': 12.842840448604258, 'longitude': 80.15132835492903},
	{'latitude': 12.843425673897842, 'longitude': 80.15140829659303},
	{'latitude': 12.843495941866225, 'longitude': 80.15127174078874},
	{'latitude': 12.845272900669434, 'longitude': 80.15240201746927},
	{'latitude': 12.844788565481585, 'longitude': 80.1561051466986},
	{'latitude': 12.8433955825647, 'longitude': 80.15852235294946},
	{'latitude': 12.837851343172668, 'longitude': 80.15531798138569},
	{'latitude': 12.837851343172668, 'longitude': 80.15531798138569}
  ];
  bool isPointInPolygon(double lat, double lng, List<Map<String, double>> polygon) {
	bool inside = false;
	for (int i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
  	double xi = polygon[i]['latitude']!;
  	double yi = polygon[i]['longitude']!;
  	double xj = polygon[j]['latitude']!;
  	double yj = polygon[j]['longitude']!;
  	bool intersect = ((yi > lng) != (yj > lng)) &&
                   	(lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
  	if (intersect) {
    	inside = !inside;
  	}
	}
	return inside;
  }
  Future<void> _getCurrentLocation() async {
	bool serviceEnabled;
	LocationPermission permission;
	serviceEnabled = await Geolocator.isLocationServiceEnabled();
	if (!serviceEnabled) {
  	return Future.error('Location services are disabled.');
	}
	permission = await Geolocator.checkPermission();
	if (permission == LocationPermission.denied) {
  	permission = await Geolocator.requestPermission();
  	if (permission == LocationPermission.denied) {
    	return Future.error('Location permissions are denied.');
  	}
	}
	if (permission == LocationPermission.deniedForever) {
  	return Future.error('Location permissions are permanently denied.');
	}
	Position position = await Geolocator.getCurrentPosition(
    	desiredAccuracy: LocationAccuracy.high);
	setState(() {
  	_currentPosition = position;
	});
	bool isInside = isPointInPolygon(
    	position.latitude, position.longitude, polygon);
	if (isInside) {
  	print('User is inside the polygon');
	} else {
  	print('User is outside the polygon');
	}
  }

  @override
  Widget build(BuildContext context) {
	return Scaffold(
  	appBar: AppBar(
    	title: Text('Location Checker'),
  	),
  	body: Center(
    	child: Column(
      	mainAxisAlignment: MainAxisAlignment.center,
      	children: <Widget>[
        	_currentPosition == null
            	? Text('Press the button to get your location.')
            	: Text('Current Location: (${_currentPosition!.latitude}, ${_currentPosition!.longitude})'),
        	SizedBox(height: 20),
        	ElevatedButton(
          	onPressed: _getCurrentLocation,
          	child: Text('Check Location'),
        	),
      	],
    	),
  	),
	);
  }
}
