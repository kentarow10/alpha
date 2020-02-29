/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useTheme,
  Card,
  Avatar,
  Title,
  Paragraph,
  Button,
} from 'react-native-paper';
import {
  View,
  Button as Bt,
  FlatList,
  Dimensions,
  Image,
  SafeAreaView,
} from 'react-native';
import { Text } from 'react-native-paper';

// import { SafeAreaView } from 'react-native-safe-area-context';
import { GetPosts } from '../store/timeLine/selector';
import { asyncGetPosts } from '../store/timeLine/actions';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const timeLine = () => {
  const dispatch = useDispatch();
  const posts = useSelector(GetPosts);

  useEffect(() => {
    dispatch(asyncGetPosts());
    console.log(posts);
  }, []);

  return (
    <React.Fragment>
      <SafeAreaView style={{ height: HEIGHT }}>
        <FlatList
          data={posts.posts}
          keyExtractor={(item, index) => index.toString()}
          numColumns={1}
          renderItem={item => (
            <Card>
              <Card.Title
                title={item.item.ownerId}
                left={props => <Avatar.Icon {...props} icon="folder" />}
              />
              <Card.Content>
                <Title>Card title</Title>
                <Paragraph>Card content</Paragraph>
              </Card.Content>
              <Image
                source={{ uri: item.item.path }}
                resizeMode="contain"
                style={{ width: WIDTH, height: 200, backgroundColor: 'black' }}
              />
              {/* <Card.Cover source={{ uri: item.item.path }} /> */}
              <Card.Actions>
                <Button>Cancel</Button>
                <Button>Ok</Button>
              </Card.Actions>
            </Card>
          )}
        />
      </SafeAreaView>
    </React.Fragment>
  );
};

export default timeLine;
