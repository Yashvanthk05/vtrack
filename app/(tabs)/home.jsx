import { View, Text, StyleSheet, Alert, FlatList, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db } from './../../Configs/FirebaseConfig';
import { onSnapshot, doc } from 'firebase/firestore';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import { Redirect } from 'expo-router';
import MapView, { Circle, Marker } from 'react-native-maps';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Foundation from '@expo/vector-icons/Foundation';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MapComp from '../../components/MapComp';
import {LogBox} from 'react-native';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userData, setUserData] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address,setAddress]=useState(null);
  const [syncedTime, setSyncedTime] = useState(null);
  const [workmsg,setWorkMsg]=useState(null);

  LogBox.ignoreAllLogs();

  const user = auth.currentUser;
  const VIT_LATITUDE = 12.840705871582031;
  const VIT_LONGITUDE = 80.1539077758789;
  const GEOFENCE_RADIUS = 1000;
  const LOCATION_TASK_NAME = 'background-location-task';

  const globalErrorHandler = (error, isFatal) => {
    console.log(`Error: ${error.message}`);
    if (isFatal) {
      alert('Unexpected error occurred, restarting the app.');
    }
  };
  
  if (!__DEV__) {
    ErrorUtils.setGlobalHandler(globalErrorHandler);
  }

  Notifications.setNotificationHandler({
    handleNotification: async()=>({
      shouldShowAlert:true,
      shouldPlaySound:true,
      shouldSetBadge:false
    })
  })


  useEffect(() => {
    let unsubscribeUserData;
    let unsubscribeAttendance;

    if (user) {
      const email = user.email;
      const docRef = doc(db, "faculties", email);

      unsubscribeUserData = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          subscribeToAttendance(email);
        } else {
          console.log("No such document");
        }
      }, (error) => {
        console.error("Error getting document: ", error);
      });
    }

    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      if (unsubscribeUserData) unsubscribeUserData();
      if (unsubscribeAttendance) unsubscribeAttendance();
      clearInterval(intervalId);
    };
  }, [user]);

  useEffect(() => {
    let intervalId;

    const VIT_LATITUDE = 12.840705871582031;
    const VIT_LONGITUDE = 80.1539077758789;;
    const GEOFENCE_RADIUS = 1000;

    const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
      const R = 6371e3;
      const φ1 = lat1 * (Math.PI / 180);
      const φ2 = lat2 * (Math.PI / 180);
      const Δφ = (lat2 - lat1) * (Math.PI / 180);
      const Δλ = (lon2 - lon1) * (Math.PI / 180);

      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c;
    };

    const checkLocationAndAlert = async () => {
      try {
        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        if (foregroundStatus !== 'granted') {
          alert('Foreground location permission not granted.');
          return false;
        }
    
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
          alert('Background location permission not granted.');
          return false;
        }
    
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const address = await Location.reverseGeocodeAsync({ latitude, longitude });
        const locationName = address[0]?.formattedAddress || 'Unknown location';
        setAddress(locationName);
    
        const distance = getDistanceFromLatLonInMeters(latitude, longitude, VIT_LATITUDE, VIT_LONGITUDE);
        const userHasNotPunchedOut = convertTimestampToTime(attendance?.PunchIn)==="12:00:00 AM";
        const userHasNotPunchedIn = convertTimestampToTime(attendance?.PunchOut)==="12:00:00 AM";
    
        const currentHour = currentTime?.getHours();
        const currentMinute = currentTime?.getMinutes();
        if (formattedTime=="8:00:00 AM" && userHasNotPunchedIn) {
          await sendNotification("Good Morning!", "Please punch in for the day.");
        }
        
        if (distance > GEOFENCE_RADIUS && userHasNotPunchedOut && !userHasNotPunchedIn) {
          await sendNotification("Reminder", "You have not punched out and you're outside VIT Chennai!");
        }
    
        setLocation(location);
    
        const currentTime = new Date();
        setSyncedTime(currentTime.toLocaleTimeString());
      } catch (error) {
        console.error("Error fetching location: ", error);
      }
    };    

    checkLocationAndAlert();
    intervalId = setInterval(checkLocationAndAlert, 900000);
    return () => clearInterval(intervalId);
  },[]);
  
  const sendNotification = async (title, body) => {
    await Notifications.requestPermissionsAsync();
    console.log("Notification Called")
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null,
    });
  };

  const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const subscribeToAttendance = (email) => {
    const formattedDate = formatDate(currentTime);
    const attendanceRef = doc(db, "faculties", email, "attendance", formattedDate);

    const unsubscribeAttendance = onSnapshot(attendanceRef, (docSnap) => {
      if (docSnap.exists()) {
        setAttendance(docSnap.data());
      } else {
        console.log("No attendance data for today");
        setAttendance(null);
      }
    }, (error) => {
      console.error("Error getting attendance data: ", error);
    });

    return unsubscribeAttendance;
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const convertTimestampToTime = (times) => {
    if (times?.seconds) {
      const date = new Date(times?.seconds * 1000);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    }
    return 'N/A';
  };

  let latitude = 'Loading...';
  let longitude = 'Loading...';

  if (errorMsg) {
    latitude = errorMsg;
    longitude = errorMsg;
  } else if (location) {
    latitude = location.coords.latitude;
    longitude = location.coords.longitude;
  }

  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = formatDate(currentTime);
  const punchInTime = attendance?.PunchIn ? convertTimestampToTime(attendance.PunchIn) : 'N/A';
  const punchOutTime = attendance?.PunchOut ? convertTimestampToTime(attendance.PunchOut) : 'N/A';

  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.error('Background Task Error:', error);
      return;
    }
  
    if (data) {
      const { locations } = data;
      const location = locations[0]; // Get the latest location
      const { latitude, longitude } = location.coords;
  
      // Perform the distance check
      const distance = getDistanceFromLatLonInMeters(
        latitude,
        longitude,
        VIT_LATITUDE,
        VIT_LONGITUDE
      );
  
      // Send a notification if the user is outside the geofence
      if (distance > GEOFENCE_RADIUS) {
        await sendNotification('You are outside VIT', 'Remember to punch out!');
      }
    }
  });

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Notification permissions not granted!');
      }
    };
    
  
    requestPermissions();
  }, []);
  
  const [region, setRegion] = useState({
    latitude: VIT_LATITUDE,
    longitude: VIT_LONGITUDE,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });






  useEffect(()=>{
    const startTaskReg=async()=>{
      await Location.startLocationUpdatesAsync(BACKGROUND_NOTIFICATION_TASK, {
        accuracy: Location.Accuracy.High,
        distanceInterval: 1,
        timeInterval: 60000,
        deferredUpdatesInterval: 1000,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: 'VTRACKING....',
          notificationBody: 'Your location is being tracked in the background.',
        },
      });
    }

    const scheduleBackgroundTask = async () => {
      try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK, {
          minimumInterval: 60,
          stopOnTerminate: false,
          startOnBoot: true,
        });

        console.log('Task registered successfully!');
      } catch (error) {
        console.log('Task registration failed:', error);
      }
    };
    startTaskReg();
    scheduleBackgroundTask();
  },[])








  useEffect(() => {
    let notifyIntervalId = null;
    let punchOutNotifyIntervalId = null;
    let outsideVITNotifyId = null;
  
    // Store the working time update interval separately
    const updateWorkingTime = (punchInTime, punchOutTime,pout) => {
      let hasPunchedOut = false;
      let workingTime;
      if (pout!="12:00:00 AM") {
        workingTime = punchOutTime - punchInTime;
        hasPunchedOut = true;
      } else {
        workingTime = new Date() - punchInTime; // If not punched out, calculate from current time
        const distance = getDistanceFromLatLonInMeters(latitude, longitude, VIT_LATITUDE, VIT_LONGITUDE);
        // if(distance>GEOFENCE_RADIUS && !outsideVITNotifyId){
        //   outsideVITNotifyId=setInterval(async()=>{
        //     await sendNotification("Reminder","You have not Punched Out and You're Outside VIT Chennai. So Kindly Punch Out");
        //   },60*1000);
        // }
        if(!isPointInPolygon(latitude,longitude) && !outsideVITNotifyId){
          outsideVITNotifyId=setInterval(async()=>{
            await sendNotification("Reminder","You have not Punched Out and You're Outside VIT Chennai. So Kindly Punch Out");
          },60*1000);
        }
      }
  
      const hours = Math.floor(workingTime / 3600000);
      const minutes = Math.floor((workingTime % 3600000) / 60000);
      const seconds = Math.floor((workingTime % 60000) / 1000);
  
      // If user punched out and worked less than 8 hours
      if (hasPunchedOut && hours < 8) {
        const remainingTime = 8 - hours;
        setWorkMsg(`You punched out earlier. You had ${remainingTime} hour(s) left to complete 8 hours.`);
        if (!punchOutNotifyIntervalId) {
          punchOutNotifyIntervalId = setInterval(async () => {
            await sendNotification("Warning!!", `You punched out earlier. You still had ${remainingTime} hour(s) left.`);
          }, 60*1000); // Notify every 15 minutes
        }
      } else if (!hasPunchedOut) {
        // Update working time if not punched out
        setWorkMsg(`${hours}hr ${minutes}min ${seconds}sec`);
        
        // Notify after 8 hours if the user hasn't punched out
        if (hours >= 8 && !notifyIntervalId) {
          notifyIntervalId = setInterval(async () => {
            await sendNotification("Reminder", "You have worked 8 hours, you can punch out.");
            setWorkMsg("You have worked 8 hours, you can punch out.");
          }, 60 *1000); // Notify every 15 minutes
        }
      }
    };

    const polygon = [
      { latitude: 12.84252844169831, longitude: 80.15087616357157},
      { latitude: 12.842840448604258, longitude: 80.15132835492903}, 
      { latitude: 12.843425673897842, longitude: 80.15140829659303}, 
      { latitude: 12.843495941866225, longitude: 80.15127174078874},
      { latitude: 12.845272900669434, longitude: 80.15240201746927},
      { latitude: 12.844788565481585 , longitude: 80.1561051466986 },
      { latitude: 12.8433955825647 , longitude: 80.15852235294946 },
      { latitude: 12.837851343172668, longitude: 80.15531798138569  },
      { latitude: 12.837851343172668, longitude: 80.15531798138569  }
    ];

    const isPointInPolygon = (x,y) => {
      let inside = false;
    
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].latitude, yi = polygon[i].longitude;
        const xj = polygon[j].latitude, yj = polygon[j].longitude;
    
        const intersect = ((yi > y) !== (yj > y)) &&
                          (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
    
      return inside;
    };
  
    const checkWorkingHours = async () => {
      // Convert Firebase timestamps for PunchIn and PunchOut
      const punchInTime = attendance?.PunchIn && (attendance?.PunchIn?.seconds !== 1726857000)
        ? convertFirebaseTimestampToDate(attendance?.PunchIn)
        : null;
      const punchOutTime = attendance?.PunchOut && (attendance?.PunchOut?.seconds !== 1726857000)
        ? convertFirebaseTimestampToDate(attendance?.PunchOut)
        : null;
      if (!punchInTime) {
        setWorkMsg("You have not started working.");
        return;
      }
  
      const pout = attendance?.PunchOut ? convertTimestampToTime(attendance.PunchOut) : 'N/A';
      updateWorkingTime(punchInTime, punchOutTime,pout);
    };
  
    // Check attendance and working time every second
    const intervalId = setInterval(checkWorkingHours, 1000);
  
    return () => {
      clearInterval(intervalId);
      if (notifyIntervalId) clearInterval(notifyIntervalId);
      if (punchOutNotifyIntervalId) clearInterval(punchOutNotifyIntervalId);
      if(outsideVITNotifyId) clearInterval(outsideVITNotifyId);
    };
  },[attendance]);  // Only track attendance changes
  
  
  const convertTimestampToHMS = (timestamp) => {
    if (!timestamp?.seconds) {
      return 'Invalid timestamp';
    }
    console.log(`${hours}:${minutes}:${seconds}`);
  };
  const convertFirebaseTimestampToDate = (timestamp) => {
    return new Date(timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000));
  };

  return (
    <ScrollView>
    {user?<SafeAreaView style={styles.container}>

      {user?<View style={{width:'100%'}}>
        <Text style={{textAlign:'left',fontWeight:'bold',fontSize:26}}>Welcome</Text>
        <Text style={{textAlign:'left',fontWeight:'bold',fontSize:24}}>{userData?.empid}, {userData?.name}👋</Text>
        <Text style={{marginTop:10,color:'grey'}}>Last Synced at {syncedTime}<EvilIcons name="refresh" size={20} color="grey" /></Text>
      </View>:null}

      <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',width:'100%'}}>
        <Text style={{fontWeight:'bold',fontSize:24}}>{formattedDate}</Text>
        <Text style={{fontWeight:'bold',fontSize:24}}>{formattedTime}</Text>
      </View>

      {/* Our Features */}
      <View style={{width:'100%'}}>
        <Text style={{textAlign:'left',fontWeight:'bold',fontSize:20}}>Our Features</Text>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>

          <View style={{justifyContent:'center',alignItems:'center'}}>
            <View style={{backgroundColor:'#F9D689',borderRadius:100,width:60,height:60,padding:5,alignItems:'center',justifyContent:'center'}}>
              <Foundation name="alert" size={32} color="#D24545" />
            </View>
            <Text>Alerting</Text>
          </View>

          <View style={{justifyContent:'center',alignItems:'center'}}>
            <View style={{backgroundColor:'#DEF9C4',borderRadius:100,width:60,height:60,padding:5,alignItems:'center',justifyContent:'center'}}>
            <FontAwesome6 name="map-location-dot" size={30} color="#40A578" />
            </View>
            <Text>Tracking</Text>
          </View>

          <View style={{justifyContent:'center',alignItems:'center'}}>
            <View style={{backgroundColor:'#A7E6FF',borderRadius:100,width:60,height:60,padding:5,alignItems:'center',justifyContent:'center'}}>
            <MaterialCommunityIcons name="security" size={30} color="#050C9C" />
            </View>
            <Text>Security</Text>
          </View>
          <View style={{justifyContent:'center',alignItems:'center'}}>
            <View style={{backgroundColor:'#FFD0EC',borderRadius:100,width:60,height:60,padding:5,alignItems:'center',justifyContent:'center'}}>
            <FontAwesome5 name="border-style" size={24} color="#6C22A6" />
            </View>
            <Text>Geofencing</Text>
          </View>
        </View>
      </View>

      <View style={{flexDirection:'row',height:'auto',gap:10,borderWidth:1,borderColor:'#FABC3F',alignItems:'center',padding:10,borderRadius:25}}>
        <View style={{backgroundColor:'#FABC3F',borderRadius:100,height:50,width:50,justifyContent:'center',alignItems:'center'}}>
          <FontAwesome5 name="map-marker-alt" size={24} color="#343131" />
        </View>
        <View style={{width:'82%',alignItems:'center'}}>
          <Text style={{fontSize:14,fontWeight:'bold'}}>{address}</Text>
        </View>
      </View>

      {/* punchin and punchout box */}
      <View style={{flexDirection:'row',width:'100%',justifyContent:'space-around'}}>
        {/*punch in box */}
        <View style={styles.smallbox}>
          <Text style={styles.label}>Punch In</Text>
          <Text style={{color:'#C68FE6',textAlign:'center',fontSize:22,fontWeight:'bold'}}>{punchInTime=="12:00:00 AM"?"N/A":punchInTime}</Text>
        </View>
        {/*punch out box */}
        <View style={styles.smallbox}>
          <Text style={styles.label}>Punch Out</Text>
          <Text style={{color:'#C68FE6',textAlign:'center',fontSize:22,fontWeight:'bold'}}>{punchOutTime=="12:00:00 AM"?"N/A":punchOutTime}</Text>
        </View>
      </View>

      <View style={{width:'100%'}}>
        <Text style={{fontWeight:'bold',textAlign:'left',fontSize:18}}>Working Time: {workmsg}</Text>
      </View>

      {/* <MapComp  location={location} region={region} /> */}
      
    </SafeAreaView>:<Redirect href={'./'}/>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 25,
    gap: 20,
    backgroundColor:'white'
  },
  box: {
    backgroundColor: 'black',
    borderRadius: 20,
    width: '100%',
    padding: 20,
  },
  label: {
    color: '#8967B3',
    fontWeight: 'bold',
    fontSize: 18,
  },
  date: {
    textAlign:'center',
    color: 'white',
    fontSize: 26,
    fontWeight:'bold'
  },
  time: {
    textAlign:'center',
    color: 'white',
    fontSize: 26,
    fontWeight:'bold'
  },
  smallbox:{
    backgroundColor:'black',
    borderRadius:15,
    gap:10,
    height:120,
    width:'48%',
    padding:15
  }
});
