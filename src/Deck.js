import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH
const SWIPE_OUT_DURATION = 250

class Deck extends Component {
  constructor(props){
    super(props);
    const position = new Animated.ValueXY()
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true, // everytime user taps the screen
      onPanResponderMove: (event, gesture ) => {
        position.setValue({ x: gesture.dx , y: gesture.dy })
      }, // When user is panning
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD){
          this.forceSwipe({direction: 'right'})
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe()
        } else {
          this.resetPosition({direction: 'left'})
        }
      } // When user is removing finger
    });
    this.panResponder = panResponder
    this.position = position
  }

  forceSwipe = ({direction}) => {
    let x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH
    let y = 0
    Animated.timing(this.position, {
      toValue: { x,  y },
      duration: SWIPE_OUT_DURATION
    }).start();
  }

  getCardStyle = () => {
    const rotate = this.position.x.interpolate({
      inputRange: [ -SCREEN_WIDTH * 2.0, 0, SCREEN_WIDTH * 2.0 ],
      outputRange: [ '-120deg', '0deg', '120deg']
    })
    return {
      ...this.position.getLayout(),
      transform: [{ rotate }]
    }
  }

  resetPosition = () => {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  renderCards = () => {
    return this.props.data.map((item, index)=> {
      if (index === 0 ) {
        return(
          <Animated.View
            key={ item.id }
            { ...this.panResponder.panHandlers }
            style={this.getCardStyle()}
            >
            { this.props.renderCard(item) }
          </Animated.View>
        )
      }
      return (this.props.renderCard(item))
    })
  }

  render(){
    return(
      <View>
        {this.renderCards()}
      </View>
    )
  }
}


export default Deck;
