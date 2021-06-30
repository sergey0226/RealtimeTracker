import React, { useRef, useState } from 'react';

import { Button, Card, Overlay  } from 'react-native-elements';

export const Popup = (props) => {
    const [textVisible, settextVisible] = useState(false);

    return (
        <Overlay 
          style={{ width: SLIDER_WIDTH}}
          isVisible={props.visible} onBackdropPress={()=>setdialogVisible(false)}>
          <Card
            containerStyle={{ margin: 0 }}
            >
            <Card.Title>Select Attachments Type:</Card.Title>
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
              title=' Choose Photo from Library' />
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
              title=' Take a Photo' />
            <Button
                icon={
                  <MaterialCommunityIcons
                    name="message-bulleted"
                    size={15}
                    color="#5395CE"
                  />}
                type="clear"
                buttonStyle={{
                  width: '100%',
                  borderRadius: 0, 
                  marginLeft: 0, 
                  marginRight: 0, 
                  marginBottom: 0}}
                title=' Add Note' />
          </Card>
        </Overlay>
    );

}