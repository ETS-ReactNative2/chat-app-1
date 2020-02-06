import React, { Component } from 'react';
import { StatusBar, Text, View, SafeAreaView, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';

import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as base64 from 'base-64';

export default class App extends Component {
    state = {
      photos: [],
      hasPermission: null,
      cameraType: Camera.Constants.Type.front,
      latestImage: null,
      photosPath: `${FileSystem.documentDirectory}photos/`
  }

  async componentDidMount() {
      const { status } = await Camera.requestPermissionsAsync();

      this.setState({
          hasPermission: status === 'granted'
      });
  }


  handleTakePicture = async () => {
      if (!this.camera) {
          return;
      }

      let photo = await this.camera.takePictureAsync({
        base64:true
      });

      if (!photo || !photo.uri) {
          return Alert('Error: Photo returned empty');
      }

      // submit image to server via blob format
      let blob = this.handleConvertBase64ToBlob(photo.uri);

      let data =  {
        'image': blob
      };

      let opts = {
        'headers': {
          'Authorization': `Token <ADD AUTHTOKEN HERE>`
        },
        'content-type': 'multipart/form-data'
      }

      // if submission successful, go back a page
      axios.post('http://localhost:8000/api/v1/photo/', data, opts).then(_ => {
        console.log('success');
      }).catch(err => {
        console.log(err);
      })
  }

  handleConvertBase64ToBlob = (dataURI) => {
    // source: https://gist.github.com/fupslot/5015897

    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    console.log(typeof dataURI);
    let byteString = base64.atob(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    let bb = new Blob([ab]);
    return bb;
  }

  render() {
      let permission = this.state.hasPermission;
      let type = this.state.cameraType;
      let addPhoto = this.handleAddPhoto;
      let flipCamera = this.handleFlipCamera;

      let cameraWidth = Dimensions.get('window').width;
      let cameraHeight = cameraWidth / 0.75;

      if (!permission) {
          return (
              <SafeAreaView style={styles.container}>
                  <Text>No access to camera</Text>
              </SafeAreaView>
          )
      }

      return (
          <SafeAreaView style={styles.container}>
              <View style={{flex: 1, backgroundColor: 'black'}}></View>
              <Camera
                  style={{width: cameraWidth, height: cameraHeight}}
                  type={type} ref={ref => {this.camera = ref}}
              >
              </Camera>
              <View style={styles.cameraFooter}>
                  <View style={styles.flipContainer}>
                      <TouchableOpacity onPress={flipCamera}>
                          <Ionicons
                              name="md-reverse-camera"
                              style={{color: 'white'}}
                              size={40}
                          />
                      </TouchableOpacity>
                  </View>
                  <View style={styles.buttonContainer}>
                      <TouchableOpacity
                          style={styles.circleButton}
                          onPress={() => this.handleTakePicture(addPhoto)}
                      >
                      </TouchableOpacity>
                  </View>
                  <View style={styles.imageContainer}></View>
              </View>
          </SafeAreaView>
      );
  }
}

const styles = StyleSheet.create({
  cameraFooter: {
      height: 100,
      padding: 15,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'black'
  },
  circleButton: {
      borderWidth: 5,
      borderColor: 'grey',
      alignItems:'center',
      justifyContent:'center',
      width:75,
      height:75,
      backgroundColor:'white',
      borderRadius:150,
  },
  camera: {
      flex: 1
  },
  container: {
      flex: 1,
      marginTop: StatusBar.currentHeight
  },
  buttonContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center'
  },
  flipContainer: {
      flex: 1
  },
  imageContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end'
  },
  image: {
      width: 50,
      height: 50,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: 'white'
  }
});
