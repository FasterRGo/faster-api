import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geocoding/geocoding.dart';

class MapPage extends StatefulWidget {
  @override
  _MapPageState createState() => _MapPageState();
}

class _MapPageState extends State<MapPage> {
  late GoogleMapController mapController;
  Set<Marker> markers = {};
  final TextEditingController _searchController = TextEditingController();

  final double initialLat = -29.7495;
  final double initialLong = -57.0882;

  void _onMapCreated(GoogleMapController controller) {
    mapController = controller;
  }

  Future<void> _searchLocation(String address) async {
    try {
      List<Location> locations = await locationFromAddress(address);
      if (locations.isNotEmpty) {
        Location location = locations.first;
        LatLng latLng = LatLng(location.latitude, location.longitude);
        mapController.animateCamera(CameraUpdate.newLatLngZoom(latLng, 15.0));

        // Clear previous markers and add new searched location marker
        setState(() {
          markers.clear();
          markers.add(Marker(markerId: MarkerId('searchedLocation'), position: latLng));
        });

        // Reverse geocoding to get detailed place information
        List<Placemark> placemarks = await placemarkFromCoordinates(
          location.latitude,
          location.longitude,
          localeIdentifier: 'pt_BR', // Optionally, specify locale for region-specific results
        );

        if (placemarks.isNotEmpty) {
          Placemark placemark = placemarks.first;
          print('Localidade: ${placemark.locality}');
          print('Bairro: ${placemark.subLocality}');
          print('País: ${placemark.country}');
          // You can access more details like street, postal code, etc. from the placemark
        }
      }
    } catch (e) {
      // Handle error (e.g., show a message to the user)
      print('Error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Mapa"),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Pesquisar localização',
                suffixIcon: IconButton(
                  icon: Icon(Icons.search),
                  onPressed: () {
                    _searchLocation(_searchController.text);
                  },
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8.0),
                ),
              ),
            ),
          ),
          Expanded(
            child: GoogleMap(
              onMapCreated: _onMapCreated,
              onCameraMove: (data) {
                print(data);
              },
              onTap: (position) {
                print(position);
              },
              initialCameraPosition: CameraPosition(
                target: LatLng(initialLat, initialLong),
                zoom: 15.0,
              ),
              markers: markers,
            ),
          ),
        ],
      ),
    );
  }
}
