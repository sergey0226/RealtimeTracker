import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import { 
  Header, 
  Button, 
  Card,  
  Overlay, 
  Input  
} from 'react-native-elements';
import Toggle from 'react-native-toggle-element';
import DatePicker from 'react-native-date-picker';
import OutlineInput from 'react-native-outline-input';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import { Urls } from '../utils/imageUrl';
import { NAME_OF_MON, NAME_OF_WEEK } from '../utils/constants';
import AddNewImg from '../asserts/images/noData.png'


const SLIDER_WIDTH = Dimensions.get('window').width*0.95;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 3 / 4);

const HomeScreen = ({ navigation }) => {
  
  const carouselRef = useRef(null);

  const [durationSwitch, setDurationSwitch] = useState(false);
  const [guardme, setGuardme] = useState('10');
  const [period, setPeriod] = useState(100);
  const [visibleTimePicker, setVisibleTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [tDate, setTDate] = useState(new Date());
  
  const [entries, setEntries] = useState([]);
  
  const [memo, setMemo] = useState('This is template for Note');
  const [tMemo, setTMemo] = useState('This is template for Note');
  const [memoDialog, setMemoDialog] = useState(false);
  const [dialogVisible, setdialogVisible] = useState(false);
  
  const [startGuard, setstartGuard] = useState(false);
  const [delFlag,setDelFlag] = useState(false);

  // google map variables.
  const [marker, setMarker] = useState({});
  const [enableDrag, setEnableDrag]  = useState(false);
  const [tPosition, setTPosition] = useState({});
  const [position, setPosition] = useState({});

  useEffect(() => {
    setEntries(Urls);
    console.log(Urls,'that is url');
  },[]);

  const _renderItem = ({item, index}, parallaxProps) => {

    // if(item.title === 'Add New') console.log((item.illustration))
      return (    
        <View style={styles.item}>
            <Text style={{ fontFamily: 'IBMPlexSans-Regular' }}>
              {item.title.slice(0,10)+'...'+(item.type?item.type:('video/'+item.duration+'s'))}
            </Text>
            <ParallaxImage
              source={item.title==='Add New'?AddNewImg:{uri: item.illustration}}
              containerStyle={styles.imageContainer}
              style={styles.image}
              parallaxFactor={0.4}
              {...parallaxProps}
            />
            <Button
              disabled={item.title==='Add New'}
              type="clear"
              buttonStyle={{
                width: '100%',
              }}
              title='Delete' 
              titleStyle={{ fontFamily: 'IBMPlexSans-Regular' }}
              onPress={()=>{entries.splice(index,1); setDelFlag(!delFlag); setEntries(entries) }}/>
        </View>
      );
  };
  
  const launch_Camera = () => {
    console.log('button pressed launch camera.');
    let options = {
      title:'custom TItle',
      saveToPhotos: true,
      mediaType: 'mixed',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, (response) => {
      console.log('Response = ', response);
  
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        console.log(response);
        response.assets.map((item, index) => {
          if(item.type)
            Urls.push({
              title: item.fileName,
              type: item.type,
              illustration: item.uri
            });
          else
            Urls.push({
              title: item.fileName,
              duration: item.duration,
              illustration: item.uri
            })
        })
        console.log(Urls);
      }
      
      setdialogVisible(false);
    });
  };
  
  const launch_ImageGallery = () => {
    console.log('button pressed launch image gallery');
    let options = {
      title:'custom TItle',
      saveToPhotos: true,
      mediaType: 'mixed',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, (response) => {
      console.log('Response = ', response);
  
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        console.log(response);
        response.assets.map((item, index) => {
          if(item.type)
            Urls.push({
              title: item.fileName,
              type: item.type,
              illustration: item.uri
            });
          else
            Urls.push({
              title: item.fileName,
              duration: item.duration,
              illustration: item.uri
            })
        })
        console.log(Urls);
      }
      setdialogVisible(false);
    });
  };

  const getDateValue = (date) => {
    const today = new Date();
    if( date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear() )
     return 'Today'+' '
     +(date.getHours()%12)+
     ':'+(date.getMinutes().toString().length<2?('0'+date.getMinutes()):date.getMinutes())+' '
     +(date.getHours()>=12?'PM':'AM');
    else
      return NAME_OF_WEEK[date.getDay()]+' '
      +NAME_OF_MON[date.getMonth()]+' '
      +date.getDate()+' '
      +(date.getHours()%12)+
      ':'+(date.getMinutes().toString().length<2?('0'+date.getMinutes()):date.getMinutes())+' '
      +(date.getHours()>=12?'PM':'AM');
  }

  const handleStartGuard = () => {
    if(startGuard) { // the countdown timer is in operation.
      setPeriod(0);
      setstartGuard(false); //stop the countdown Timer.
      return;
    }

    if(durationSwitch) { //if it is selected the Period Time mode.
      setPeriod(Number(guardme)*60);
      setstartGuard(true); // start up timer.
    } else { // if it is selected for the exact Tme period mode.
      let date_now = new Date();
      if(date_now.getTime()>date.getTime()){
        alert('End time must bigger than now. Please set time correctly.');
        return;
      }
      console.log(Math.floor((date.getTime()-date_now.getTime())/1000));
      setPeriod(Math.floor((date.getTime()-date_now.getTime())/1000));
      setstartGuard(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header>
        <Text></Text>
        <Text style={{ fontSize: 32, color: 'white', fontFamily: 'IBMPlexSans-Regular' }}>Home</Text>
        <Text></Text>
      </Header>
      <ScrollView>
        <View style={{ flex: 1, padding: 16, flexDirection: 'column'}}>

          {/* Map View */}
          <View style={{ padding:10, }} justify="center">
            {/* title */}
            <Text style={{ fontFamily: 'IBMPlexSans-Regular', paddingBottom:10 }}>
              You can find yourself on Google Map.
            </Text>
            {/* main map frame */}
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>                
                {/* {enableDrag&&(<Marker.Animated draggable
                  ref={marker=> {
                    setMarker(marker);
                  }}
                  coordinate={tPosition}
                  onDragEnd={(e) => setTPosition(e.nativeEvent.coordinate)}
                />)} */}
            </MapView>
            {/* action buttons */}
            <View style={{ flexDirection:'row', marginTop:20 }}>              
              <View style={{ flex:1, marginRigth:3 }}>
                <Button
                  icon={
                    <MaterialCommunityIcons
                      name="map-marker-radius-outline"
                      size={15}
                      color="#5395CE"
                    />
                  }
                  type="outline"
                  title=" Adjust Position"
                  titleStyle={{ fontFamily: 'IBMPlexSans-Regular' }}
                  onPress={()=>setEnableDrag(!enableDrag)}
                />
              </View>
              <View style={{ flex:1, marginLeft:3 }}>                
                <Button
                  disabled={enableDrag}
                  icon={
                    <MaterialCommunityIcons
                      name="map-marker-plus-outline"
                      size={15}
                      color="#5395CE"
                    />
                  }
                  type="outline"
                  title=" Save Position"
                  titleStyle={{ fontFamily: 'IBMPlexSans-Regular' }}
                  onPress={(e)=>setPosition(tPosition)}
                />
              </View>
            </View>
          </View>

          {/* duration input */}
          <View style={{ flexDirection: 'row', padding: 16 }}>
            <View style={{ flex:1 }}>
              <Toggle
                value={durationSwitch}
                onPress={(val)=>setDurationSwitch(val)}
                // onToggle={(newState) => console.log(newState)}
                trackBar={{
                  activeBackgroundColor: '#5395CE',
                  inActiveBackgroundColor: '#5395CE',
                  borderActiveColor: '#5395CE',
                  borderInActiveColor: '#5395CE',
                  borderWidth: 2,
                  width: 100,
                }}
                leftComponent={
                  <MaterialCommunityIcons name="timer-outline" size={24} />
                }
                rightComponent={
                  <MaterialCommunityIcons name="timer-sand" size={24} />
                }
              />
            </View>
            <View style={{ flex:2 }}>
             { durationSwitch&&(<OutlineInput
                value={guardme}
                onChangeText={(e: string) => setGuardme(e)}
                label="GuardMe Duration (minutes)"
                activeValueColor="#6c63fe"
                activeBorderColor="#6c63fe"
                activeLabelColor="#6c63fe"
                passiveBorderColor="#5395CE"
                passiveLabelColor="#5395CE"
                passiveValueColor="#5395CE"
                keyboardType="number-pad"
              />)}
              { !durationSwitch&&(
                <Button
                  buttonStyle={{ height: 56 }}
                  type="outline"
                  title={getDateValue(date)}
                  titleStyle={{ fontSize:20, fontFamily: 'IBMPlexSans-Regular' }}
                  onPress={()=>setVisibleTimePicker(true)}
                />)}
            </View>
          </View>
          
          {/* add attachment button */}
          <View 
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16
            }}>
            <Button
              icon={
                <MaterialCommunityIcons
                  name="plus"
                  size={15}
                  color="#5395CE"
                />
              }
              buttonStyle={{ width:SLIDER_WIDTH*0.9, fontFamily: 'IBMPlexSans-Regular' }}
              type="outline"
              title="Add Attachments"
              titleStyle={{ fontFamily: 'IBMPlexSans-Regular' }}
              onPress={()=>setdialogVisible(true)}
            />
          </View>
          
          {/* attached image carousel */}
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Carousel
              ref={carouselRef}
              sliderWidth={SLIDER_WIDTH}
              itemWidth={ITEM_WIDTH}
              data={entries.length?entries:[{title:'Add New', type: 'image/jpg', illustration: '../asserts/images/noData.png'}]}
              renderItem={_renderItem}
              hasParallaxImages={true}      
            />
          </View>
          
          {/* place notes */}
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 30,
            }}>
              
            <Card
              containerStyle={{ width:'100%' }}>
              <Text style={{ textAlign: 'center', marginBottom: 10, fontFamily: 'IBMPlexSans-Bold' }}>NOTE</Text>
              <Card.Divider/> 
                <Text style={{ marginBottom: 10, fontFamily: 'IBMPlexSans-Italic' }}>
                  {memo}
                </Text>
              <Card.Divider/>
              <Button
                icon={
                  <MaterialCommunityIcons
                    name="comment-edit-outline"
                    size={15}
                    color="white"
                  />
                }              
                containerViewStyle={{ width: '100%' }}
                // type="outline"
                title={' Edit Note'}
                titleStyle={{ fontFamily: 'IBMPlexSans-Regular' }}
                onPress={()=>setMemoDialog(true)}
              />
            </Card>
          </View>
          
          {/* countdown */}
          {startGuard&&
          (<View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16
            }}>
            <CountdownCircleTimer
              isPlaying={startGuard}
              duration={period}
              colors={[
                ['#004777', 0.4],
                ['#F7B801', 0.4],
                ['#A30000', 0.2],
              ]}
              onComplete={() => {
                setstartGuard(false);
                return [false, 10]
              }}
            >
              {({ remainingTime, animatedColor }) => (
                <Animated.Text style={{ color: animatedColor, fontFamily: 'IBMPlexSans-Regular' }}>
                  {remainingTime}
                </Animated.Text>
              )}
            </CountdownCircleTimer>
          </View>)}

          {/* start guardme button */}
          <View 
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Button
              icon={
                <MaterialCommunityIcons
                  name="shield-half-full"
                  size={15}
                  color="white"
                />
              }              
              buttonStyle={{ width: SLIDER_WIDTH*0.9 }}
              // type="outline"
              title={startGuard?" STOP GUARDME":" START GUARDME"}
              titleStyle={{ fontFamily: 'IBMPlexSans-Regular' }}
              onPress={handleStartGuard}
            />
          </View>
        
          {/* dialog box for media gallery */}
          <View >
            <Overlay 
              style={{ width: SLIDER_WIDTH}}
              isVisible={dialogVisible} onBackdropPress={()=>setdialogVisible(false)}>
              <Card
                containerStyle={{ margin: 0 }}
                >
                <Text style={{ textAlign: 'center', marginBottom: 10, fontFamily: 'IBMPlexSans-Bold' }}>Select Attachments From:</Text>
                <Card.Divider/>
                <Button
                  icon={
                    <MaterialCommunityIcons
                      name="image-multiple"
                      size={15}
                      color="#5395CE"
                    />}
                  type="clear"
                  buttonStyle={{
                    width: '100%',
                    borderRadius: 0, 
                    marginLeft: 0, 
                    marginRight: 0, 
                    marginBottom: 10}}
                  title=' Choose Photo from Library' 
                  titleStyle={{ fontFamily: 'IBMPlexSans-Regular' }}
                  onPress={() => launch_ImageGallery()}/>
                <Button
                  icon={
                    <MaterialCommunityIcons
                      name="camera"
                      size={15}
                      color="#5395CE"
                    />}
                  type="clear"
                  buttonStyle={{
                    width: '100%',
                    borderRadius: 0, 
                    marginLeft: 0, 
                    marginRight: 0, 
                    marginBottom: 10}}
                  title=' Take a Photo' 
                  titleStyle={{ fontFamily: 'IBMPlexSans-Regular' }}
                  onPress={() => launch_Camera()}/>
              </Card>
            </Overlay>
          </View>
        
          {/* dialog box for date & time picker */}
          <View>
            <Overlay 
              style={{ width: SLIDER_WIDTH}}
              isVisible={visibleTimePicker} onBackdropPress={()=>setVisibleTimePicker(false)}>
              <Card
                containerStyle={{ margin: 0 }}
                >
                <Text style={{ textAlign: 'center', marginBottom: 10, fontFamily: 'IBMPlexSans-Bold' }}>Select Date and Time:</Text>
                <Card.Divider/>
                  <DatePicker
                    style={{ marginTop:20, marginBottom:20 }}
                    date={tDate}
                    mode='datetime'
                    onDateChange={setTDate}
                  />
                <Card.Divider/>
                <View style={{ flexDirection:'row' }}>
                  <View style={{ flex:1 }}>                    
                    <Button
                      icon={
                        <MaterialCommunityIcons
                          name="content-save-outline"
                          size={15}
                          color="#5395CE"
                        />}
                      type="clear"
                      buttonStyle={{
                        width: '100%',
                        borderRadius: 0, 
                        marginLeft: 0, 
                        marginRight: 0, 
                        marginBottom: 10}}
                      title=' Save' 
                      titleStyle={{ fontFamily: 'IBMPlexSans-Regular' }}
                      onPress={() => {setDate(tDate),setVisibleTimePicker(false)}}/>
                  </View>
                  <View style={{ flex:1 }}>                    
                    <Button
                      icon={
                        <MaterialCommunityIcons
                          name="close-outline"
                          size={15}
                          color="#5395CE"
                        />}
                      type="clear"
                      buttonStyle={{
                        width: '100%',
                        borderRadius: 0, 
                        marginLeft: 0, 
                        marginRight: 0, 
                        marginBottom: 10}}
                      title=' Cancel' 
                      titleStyle={{ fontFamily: 'IBMPlexSans-Regular' }}
                      onPress={() => setVisibleTimePicker(false)}/>
                  </View>
                </View>
              </Card>
            </Overlay>

          </View>
        
          {/* dialog box for add note */}
          <View>
            <Overlay 
              isVisible={memoDialog} onBackdropPress={()=>setMemoDialog(false)}>
              <Card
                containerStyle={{ margin: 0 }}
                >
                <Text style={{ textAlign: 'center', marginBottom: 10, fontFamily: 'IBMPlexSans-Bold' }}>Edit note for attached media.</Text>
                <Card.Divider/>
                <TextInput
                  style={{ width: SLIDER_WIDTH*0.8, fontFamily: 'IBMPlexSans-Italic' }}
                  onChangeText={setTMemo}
                  value={tMemo}
                />
                <Card.Divider/>
                <View style={{ flexDirection:'row' }}>
                  <View style={{ flex:1 }}>  
                    <Button
                      icon={
                        <MaterialCommunityIcons
                          name="content-save-outline"
                          size={15}
                          color="#5395CE"
                        />}
                      type="clear"
                      buttonStyle={{
                        width: '100%',
                        borderRadius: 0, 
                        marginLeft: 0, 
                        marginRight: 0, 
                        marginBottom: 10}}
                      title=' Save' 
                      titleStyle={{ fontFamily: 'IBMPlexSans-Regular' }}
                      onPress={() => {setMemo(tMemo),setMemoDialog(false)}}/>                      
                  </View>
                  <View style={{ flex:1 }}>         
                    <Button
                      icon={
                        <MaterialCommunityIcons
                          name="close-outline"
                          size={15}
                          color="#5395CE"
                        />}
                      type="clear"
                      buttonStyle={{
                        width: '100%',
                        borderRadius: 0, 
                        marginLeft: 0, 
                        marginRight: 0, 
                        marginBottom: 10}}
                      title=' Cancel' 
                      titleStyle={{ fontFamily: 'IBMPlexSans-Regular' }}
                      onPress={() => {setMemoDialog(false)}}/>
                  </View>
                </View>
              </Card>
            </Overlay>            
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: 50
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'dodgerblue'
  },
  itemLabel: {
    color: 'white',
    fontSize: 24
  },
  counter: {
    marginTop: 25,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  
  item: {
    width: ITEM_WIDTH ,
    height: ITEM_WIDTH ,
  },
  
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  map: {
    width: '100%',
    height: 300
  },
});

export default HomeScreen;